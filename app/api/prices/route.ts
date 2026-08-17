export const dynamic = "force-dynamic";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { collectionRuns, priceSnapshots, sourceChecks } from "../../../db/schema";

type SourceStatus = { id: string; name: string; url: string; status: "ok" | "changed" | "blocked" | "error"; detail: string; checkedAt: string; records: number };
type PriceUpdate = { model: string; provider: string; input?: number; cached?: number; write?: number; output?: number; source: string; currency?: string; nativeInput?: number; nativeOutput?: number; listInput?: number; listOutput?: number; discountPercent?: number; pricingRegion?: string; fxRate?: number; fxAsOf?: string; tier?: string };
type AdapterResult = { source: SourceStatus; updates: PriceUpdate[] };
type PriceChange = { model:string;provider:string;field:string;before:number;after:number;percent:number;direction:"up"|"down" };

const TARGETS = [
  { match: ["deepseek-v4-flash", "deepseek/v4-flash"], model: "DeepSeek V4 Flash" },
  { match: ["deepseek-v4-pro", "deepseek/v4-pro"], model: "DeepSeek V4 Pro" },
  { match: ["qwen3.7-plus", "qwen/qwen3.7-plus"], model: "Qwen3.7 Plus" },
  { match: ["gemini-2.5-flash", "google/gemini-2.5-flash"], model: "Gemini 2.5 Flash" },
  { match: ["gpt-5-mini", "openai/gpt-5-mini"], model: "GPT-5 mini" },
  { match: ["claude-4-sonnet", "anthropic/claude-4-sonnet"], model: "Claude 4 Sonnet" },
];

function dollars(value: unknown) {
  const n = Number(value);
  if (!Number.isFinite(n)) return undefined;
  const normalized = n < 0.01 ? n * 1_000_000 : n;
  return Math.round(normalized * 1_000_000) / 1_000_000;
}

async function fetchWithTimeout(url: string, accept = "text/html,application/json") {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  try {
    return await fetch(url, {
      headers: { "accept": accept, "user-agent": "ModelScopePriceRadar/1.0 (+public-pricing-monitor)" },
      cache: "no-store",
      signal: controller.signal,
    });
  } finally { clearTimeout(timer); }
}

function status(id: string, name: string, url: string, state: SourceStatus["status"], detail: string, records = 0): SourceStatus {
  return { id, name, url, status: state, detail, records, checkedAt: new Date().toISOString() };
}

async function jsonCatalog(id: string, name: string, url: string, provider: string): Promise<AdapterResult> {
  try {
    const response = await fetchWithTimeout(url, "application/json");
    if (response.status === 403 || response.status === 429) return { source: status(id,name,url,"blocked",`官网返回 ${response.status}，已保留上次已知价格`), updates: [] };
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const body = await response.json() as { data?: Array<Record<string, unknown>> } | Array<Record<string, unknown>>;
    const rows = Array.isArray(body) ? body : body.data;
    if (!Array.isArray(rows)) return { source: status(id,name,url,"changed","JSON 结构变化，等待解析规则更新"), updates: [] };
    const updates: PriceUpdate[] = [];
    for (const target of TARGETS) {
      const row = rows.find(item => target.match.some(part => String(item.id ?? item.name ?? "").toLowerCase().includes(part)));
      if (!row) continue;
      const pricing = (row.pricing ?? row.cost ?? {}) as Record<string, unknown>;
      updates.push({ model: target.model, provider, input: dollars(pricing.prompt ?? pricing.input), cached: dollars(pricing.input_cache_read ?? pricing.cached_input ?? pricing.cache_read), write: dollars(pricing.input_cache_write ?? pricing.cache_write), output: dollars(pricing.completion ?? pricing.output), source: id });
    }
    return { source: status(id,name,url,"ok",`成功解析 ${rows.length} 个公开模型条目`,updates.length), updates };
  } catch (error) {
    return { source: status(id,name,url,"error",error instanceof Error ? error.message : "抓取失败"), updates: [] };
  }
}

function textOnly(html: string) { return html.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/&nbsp;|&#160;/g," ").replace(/&lt;/gi,"<").replace(/&gt;/gi,">").replace(/&le;/gi,"≤").replace(/&ge;/gi,"≥").replace(/&yen;/gi,"¥").replace(/&amp;/gi,"&").replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/\s+/g," ").trim(); }

async function publicPage(id: string, name: string, url: string, signatures: string[]): Promise<AdapterResult> {
  try {
    const response = await fetchWithTimeout(url);
    if (response.status === 403 || response.status === 429) return { source: status(id,name,url,"blocked",`官网返回 ${response.status}；未绕过限制，保留上次已知价格`), updates: [] };
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = textOnly(await response.text()).toLowerCase();
    const found = signatures.filter(x => text.includes(x.toLowerCase()));
    if (found.length < Math.ceil(signatures.length / 2)) return { source: status(id,name,url,"changed","页面可访问，但关键字段发生变化，已标记人工复核"), updates: [] };
    return { source: status(id,name,url,"ok",`公开定价页可访问；校验到 ${found.length}/${signatures.length} 个结构锚点`), updates: [] };
  } catch (error) { return { source: status(id,name,url,"error",error instanceof Error ? error.message : "抓取失败"), updates: [] }; }
}

async function pricedPage(id:string,name:string,url:string,signatures:string[],extract:(text:string)=>PriceUpdate[]):Promise<AdapterResult>{
  try{
    const response=await fetchWithTimeout(url);
    if(response.status===403||response.status===429)return{source:status(id,name,url,"blocked",`官网返回 ${response.status}；保留上次可信价格`),updates:[]};
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const text=textOnly(await response.text());
    const found=signatures.filter(x=>text.toLowerCase().includes(x.toLowerCase()));
    if(found.length<Math.ceil(signatures.length/2))return{source:status(id,name,url,"changed","关键字段缺失，解析器已停止写入"),updates:[]};
    const updates=extract(text).filter(u=>u.input!=null&&u.output!=null&&u.input>0&&u.output>0);
    if(!updates.length)return{source:status(id,name,url,"changed","页面可访问，但目标价格行未通过完整性校验"),updates:[]};
    return{source:status(id,name,url,"ok",`成功解析官方价格表，${updates.length} 条通过完整性校验`,updates.length),updates};
  }catch(error){return{source:status(id,name,url,"error",error instanceof Error?error.message:"抓取失败"),updates:[]}}
}

function moneyList(text:string){return[...text.matchAll(/\$\s*([0-9]+(?:\.[0-9]+)?)/g)].map(m=>Number(m[1]));}
function section(text:string,start:string,end:string,max=2400){const at=text.toLowerCase().indexOf(start.toLowerCase());if(at<0)return"";const tail=text.slice(at,at+max);const stop=tail.toLowerCase().indexOf(end.toLowerCase(),start.length);return stop>0?tail.slice(0,stop):tail;}

function anthropicPrices(text:string):PriceUpdate[]{
  const row=section(text,"Claude Sonnet 4 ","Claude Haiku",700);
  const values=moneyList(row);
  return values.length>=5?[{model:"Claude 4 Sonnet",provider:"Anthropic 官方",input:values[0],write:values[1],cached:values[3],output:values[4],source:"anthropic"}]:[];
}
function googlePrices(text:string):PriceUpdate[]{
  const block=section(text,"Gemini 2.5 Flash","Gemini 2.5 Flash-Lite",2600);
  const standard=section(block,"Standard","Batch",1400);
  const input=standard.match(/Input price[^$]{0,120}\$\s*([0-9.]+)/i)?.[1];
  const output=standard.match(/Output price[^$]{0,120}\$\s*([0-9.]+)/i)?.[1];
  const cached=standard.match(/Context caching price[^$]{0,120}\$\s*([0-9.]+)/i)?.[1];
  return input&&output&&cached?[{model:"Gemini 2.5 Flash",provider:"Google AI",input:+input,cached:+cached,output:+output,source:"google"}]:[];
}
function deepseekPrices(text:string):PriceUpdate[]{
  const block=section(text,"deepseek-v4-flash","Deduction Rules",2200);
  const hit=moneyList(section(block,"CACHE HIT","CACHE MISS",500));
  const miss=moneyList(section(block,"CACHE MISS","OUTPUT TOKENS",500));
  const output=moneyList(section(block,"OUTPUT TOKENS","Concurrency Limit",500));
  const hour=new Date().getUTCHours();
  const peak=(hour>=1&&hour<4)||(hour>=6&&hour<10);
  const i=peak?2:0;
  if(hit[i]==null||miss[i]==null||output[i]==null)return[];
  const tier=peak?"PEAK · 01:00–04:00 / 06:00–10:00 UTC":"OFF-PEAK · 峰值时段外";
  return [
    {model:"DeepSeek V4 Flash",provider:"DeepSeek 官方",input:miss[i],cached:hit[i],output:output[i],source:"deepseek",currency:"USD",nativeInput:miss[i],nativeOutput:output[i],listInput:miss[2]??miss[i],listOutput:output[2]??output[i],discountPercent:peak?0:50,pricingRegion:"全球",tier},
    {model:"DeepSeek V4 Pro",provider:"DeepSeek 官方",input:miss[i+1],cached:hit[i+1],output:output[i+1],source:"deepseek",currency:"USD",nativeInput:miss[i+1],nativeOutput:output[i+1],listInput:miss[3]??miss[i+1],listOutput:output[3]??output[i+1],discountPercent:peak?0:50,pricingRegion:"全球",tier},
  ];
}

function togetherPrices(text:string):PriceUpdate[]{
  const parse=(start:string,end:string,model:string)=>{const values=moneyList(section(text,start,end,700));return values.length>=3?{model,provider:"Together AI",input:values[0],cached:values[1],output:values[2],source:"together",currency:"USD",pricingRegion:"全球",tier:"Serverless · Standard"}:null};
  const qwen=section(text,"Qwen3.7 Plus","Google Gemma",350).match(/\$\s*([0-9.]+)\s*-\s*\$\s*([0-9.]+)/);
  return [parse("DeepSeek-V4-Pro","DeepSeek-V4-Flash","DeepSeek V4 Pro"),parse("DeepSeek-V4-Flash-0731","NVIDIA Nemotron","DeepSeek V4 Flash"),qwen?{model:"Qwen3.7 Plus",provider:"Together AI",input:+qwen[1],output:+qwen[2],source:"together",currency:"USD",pricingRegion:"全球",tier:"Serverless · Standard"}:null].filter((x):x is PriceUpdate=>x!==null);
}

function fireworksPrices(text:string):PriceUpdate[]{
  const parse=(start:string,end:string,model:string)=>{const values=moneyList(section(text,start,end,500));return values.length>=3?{model,provider:"Fireworks AI",input:values[0],cached:values[1],output:values[2],source:"fireworks",currency:"USD",pricingRegion:"全球",tier:"Serverless · Standard"}:null};
  return [parse("DeepSeek V4 Pro","DeepSeek V4 Flash","DeepSeek V4 Pro"),parse("DeepSeek V4 Flash (0731)","GLM 5.2","DeepSeek V4 Flash"),parse("Qwen 3.7 Plus","MiniMax M3","Qwen3.7 Plus")].filter((x):x is PriceUpdate=>x!==null);
}

async function deepseekPage():Promise<AdapterResult>{
  const id="deepseek",name="DeepSeek",primary="https://api-docs.deepseek.com/quick_start/pricing",fallback="https://api-docs.deepseek.com/quick_start/pricing/?article_id=article_1779470751466_8";
  try{
    for(const [url,label] of [[primary,"主定价页"],[fallback,"官方文章快照"]] as const){
      const response=await fetchWithTimeout(url);
      if(response.status===403||response.status===429)continue;
      if(!response.ok)continue;
      const text=textOnly(await response.text());
      const updates=deepseekPrices(text);
      if(updates.length){const tier=updates[0].tier?.startsWith("PEAK")?"峰值价":"谷时价";return{source:status(id,name,url,"ok",`成功解析${label}；当前按 UTC 时段采用${tier}，主页面与备用页面自动切换`,updates.length),updates}}
    }
    return{source:status(id,name,primary,"changed","主定价页与官方备用页面均缺少完整价格字段，已停止写入"),updates:[]};
  }catch(error){return{source:status(id,name,primary,"error",error instanceof Error?error.message:"抓取失败"),updates:[]}}
}
function qwenPrices(text:string,fxRate=7.2,fxAsOf="reference"):PriceUpdate[]{
  const at=text.toLowerCase().indexOf("qwen3.7-plus");
  const block=at<0?"":text.slice(at,at+1200);
  const discount=block.match(/原价\s*([0-9.]+)\s*元\s*限时\s*([0-9.]+)\s*折[\s\S]{0,100}?原价\s*([0-9.]+)\s*元\s*限时\s*([0-9.]+)\s*折/);
  const plain=block.match(/0<Token≤256K[^0-9]{0,80}([0-9.]+)\s*元[^0-9]{0,80}([0-9.]+)\s*元/);
  const inputCny=discount?+discount[1]*(+discount[2]/10):plain?+plain[1]:undefined;
  const outputCny=discount?+discount[3]*(+discount[4]/10):plain?+plain[2]:undefined;
  return inputCny&&outputCny?[{model:"Qwen3.7 Plus",provider:"阿里云百炼",input:Math.round(inputCny/fxRate*1e6)/1e6,output:Math.round(outputCny/fxRate*1e6)/1e6,source:"qwen",currency:"CNY",nativeInput:inputCny,nativeOutput:outputCny,listInput:discount?+discount[1]:inputCny,listOutput:discount?+discount[3]:outputCny,discountPercent:discount?100-(+discount[2]*10):undefined,pricingRegion:"中国大陆 · 华北2（北京）",fxRate,fxAsOf,tier:"0<Token≤256K"}]:[];
}

async function qwenPage():Promise<AdapterResult>{
  const id="qwen",name="阿里云百炼",url="https://help.aliyun.com/zh/model-studio/model-pricing";
  try{
    const [page,fx]=await Promise.all([fetchWithTimeout(url),fetchWithTimeout("https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml","application/xml")]);
    if(page.status===403||page.status===429)return{source:status(id,name,url,"blocked",`官网返回 ${page.status}；保留上次可信价格`),updates:[]};
    if(!page.ok)throw new Error(`HTTP ${page.status}`);
    const text=textOnly(await page.text());
    let fxRate=7.2,fxAsOf="reference";
    if(fx.ok){const xml=await fx.text();const usd=xml.match(/currency=['\"]USD['\"] rate=['\"]([0-9.]+)/)?.[1];const cny=xml.match(/currency=['\"]CNY['\"] rate=['\"]([0-9.]+)/)?.[1];const date=xml.match(/time=['\"]([0-9-]+)/)?.[1];if(usd&&cny){fxRate=+cny/+usd;fxAsOf=date||"ECB daily"}}
    const updates=qwenPrices(text,fxRate,fxAsOf);
    if(!updates.length)return{source:status(id,name,url,"changed","页面可访问，但北京地域目标价格行未通过完整性校验"),updates:[]};
    return{source:status(id,name,url,"ok",`解析北京地域促销价；原币种 CNY，ECB 汇率 ${fxRate.toFixed(4)}（${fxAsOf}）`,updates.length),updates};
  }catch(error){return{source:status(id,name,url,"error",error instanceof Error?error.message:"抓取失败"),updates:[]}}
}

function maxChange(previous: { input:number|null; cached:number|null; cacheWrite:number|null; output:number|null } | undefined, next: PriceUpdate) {
  if (!previous) return 0;
  const pairs: Array<[number|null|undefined,number|undefined]> = [[previous.input,next.input],[previous.cached,next.cached],[previous.cacheWrite,next.write],[previous.output,next.output]];
  return pairs.reduce((max,[before,after]) => before && after != null ? Math.max(max,Math.abs((after-before)/before)*100) : max,0);
}

async function persist(updates: PriceUpdate[], sources: SourceStatus[], collectedAt: string) {
  const db = getDb();
  const accepted: PriceUpdate[] = [];
  const changes: PriceChange[] = [];
  let rejected = 0;
  for (const update of updates) {
    const [previous] = await db.select({ input:priceSnapshots.input,cached:priceSnapshots.cached,cacheWrite:priceSnapshots.cacheWrite,output:priceSnapshots.output }).from(priceSnapshots).where(and(eq(priceSnapshots.model,update.model),eq(priceSnapshots.provider,update.provider),eq(priceSnapshots.accepted,true))).orderBy(desc(priceSnapshots.collectedAt)).limit(1);
    const change = maxChange(previous,update);
    const safe = !previous || change <= 50;
    await db.insert(priceSnapshots).values({ collectedAt,model:update.model,provider:update.provider,source:update.source,input:update.input,cached:update.cached,cacheWrite:update.write,output:update.output,currency:update.currency,nativeInput:update.nativeInput,nativeOutput:update.nativeOutput,listInput:update.listInput,listOutput:update.listOutput,discountPercent:update.discountPercent,pricingRegion:update.pricingRegion,fxRate:update.fxRate,fxAsOf:update.fxAsOf,tier:update.tier,accepted:safe,confidence:safe?"structured":"anomaly",changePercent:change });
    if (safe) {
      accepted.push(update);
      if(previous){
        const fields:Array<["input"|"cached"|"write"|"output",number|null|undefined,number|undefined]>=[["input",previous.input,update.input],["cached",previous.cached,update.cached],["write",previous.cacheWrite,update.write],["output",previous.output,update.output]];
        for(const[field,before,after]of fields)if(before&&after!=null&&Math.abs(after-before)>0.000001){const percent=Math.round((after-before)/before*10000)/100;changes.push({model:update.model,provider:update.provider,field,before,after,percent,direction:after>before?"up":"down"})}
      }
    } else rejected++;
  }
  await db.insert(collectionRuns).values({ collectedAt,sourceCount:sources.length,okCount:sources.filter(s=>s.status==="ok").length,updateCount:accepted.length,rejectedCount:rejected });
  if(sources.length)await db.insert(sourceChecks).values(sources.map(s=>({checkedAt:collectedAt,sourceId:s.id,sourceName:s.name,url:s.url,status:s.status,detail:s.detail,records:s.records})));
  return { accepted,rejected,changes };
}

export async function GET() {
  const adapters = await Promise.allSettled([
    jsonCatalog("openrouter","OpenRouter","https://openrouter.ai/api/v1/models","OpenRouter"),
    jsonCatalog("opencode-go","OpenCode Go","https://opencode.ai/zen/go/v1/models","OpenCode Go"),
    publicPage("openai","OpenAI","https://openai.com/api/pricing/",["cached input","input","output","gpt-5"]),
    pricedPage("anthropic","Anthropic","https://platform.claude.com/docs/en/about-claude/pricing",["Base Input Tokens","Cache Hits & Refreshes","Claude Sonnet 4"],anthropicPrices),
    pricedPage("google","Google AI","https://ai.google.dev/gemini-api/docs/pricing",["Input price","Gemini 2.5 Flash","Context caching price"],googlePrices),
    deepseekPage(),
    qwenPage(),
    pricedPage("together","Together AI","https://docs.together.ai/docs/serverless/models",["DeepSeek-V4-Pro","DeepSeek-V4-Flash-0731","Cached input"],togetherPrices),
    pricedPage("fireworks","Fireworks AI","https://docs.fireworks.ai/serverless/pricing",["DeepSeek V4 Pro","DeepSeek V4 Flash","Cached input tokens"],fireworksPrices),
  ]);
  const results = adapters.map((r,i) => r.status === "fulfilled" ? r.value : { source: status(`adapter-${i}`,"未知来源","","error",String(r.reason)), updates: [] });
  const collectedAt = new Date().toISOString();
  const parsed = results.flatMap(r=>r.updates);
  let updates = parsed, rejected = 0, persistence = "ok", changes:PriceChange[] = [];
  try { const saved = await persist(parsed,results.map(r=>r.source),collectedAt); updates=saved.accepted; rejected=saved.rejected; changes=saved.changes; }
  catch (error) { persistence = error instanceof Error ? error.message : "snapshot storage failed"; }
  return Response.json({ collectedAt, sources: results.map(r=>r.source), updates, changes, rejected, persistence, policy: "public-pages-only; no authentication; no anti-bot bypass; >50% route changes quarantined" }, { headers: { "cache-control": "no-store" } });
}
