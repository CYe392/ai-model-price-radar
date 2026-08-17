export const dynamic = "force-dynamic";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { collectionRuns, priceSnapshots } from "../../../db/schema";

type SourceStatus = { id: string; name: string; url: string; status: "ok" | "changed" | "blocked" | "error"; detail: string; checkedAt: string; records: number };
type PriceUpdate = { model: string; provider: string; input?: number; cached?: number; write?: number; output?: number; source: string };
type AdapterResult = { source: SourceStatus; updates: PriceUpdate[] };

const TARGETS = [
  { match: ["deepseek-v3.2", "deepseek/v3.2"], model: "DeepSeek V3.2" },
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

function textOnly(html: string) { return html.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/&nbsp;|&#160;/g," ").replace(/\s+/g," ").trim(); }

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

function maxChange(previous: { input:number|null; cached:number|null; cacheWrite:number|null; output:number|null } | undefined, next: PriceUpdate) {
  if (!previous) return 0;
  const pairs: Array<[number|null|undefined,number|undefined]> = [[previous.input,next.input],[previous.cached,next.cached],[previous.cacheWrite,next.write],[previous.output,next.output]];
  return pairs.reduce((max,[before,after]) => before && after != null ? Math.max(max,Math.abs((after-before)/before)*100) : max,0);
}

async function persist(updates: PriceUpdate[], sourceCount: number, okCount: number, collectedAt: string) {
  const db = getDb();
  const accepted: PriceUpdate[] = [];
  let rejected = 0;
  for (const update of updates) {
    const [previous] = await db.select({ input:priceSnapshots.input,cached:priceSnapshots.cached,cacheWrite:priceSnapshots.cacheWrite,output:priceSnapshots.output }).from(priceSnapshots).where(and(eq(priceSnapshots.model,update.model),eq(priceSnapshots.provider,update.provider),eq(priceSnapshots.accepted,true))).orderBy(desc(priceSnapshots.collectedAt)).limit(1);
    const change = maxChange(previous,update);
    const safe = !previous || change <= 50;
    await db.insert(priceSnapshots).values({ collectedAt,model:update.model,provider:update.provider,source:update.source,input:update.input,cached:update.cached,cacheWrite:update.write,output:update.output,accepted:safe,confidence:safe?"structured":"anomaly",changePercent:change });
    if (safe) accepted.push(update); else rejected++;
  }
  await db.insert(collectionRuns).values({ collectedAt,sourceCount,okCount,updateCount:accepted.length,rejectedCount:rejected });
  return { accepted,rejected };
}

export async function GET() {
  const adapters = await Promise.allSettled([
    jsonCatalog("openrouter","OpenRouter","https://openrouter.ai/api/v1/models","OpenRouter"),
    jsonCatalog("opencode-go","OpenCode Go","https://opencode.ai/zen/go/v1/models","OpenCode Go"),
    publicPage("openai","OpenAI","https://openai.com/api/pricing/",["cached input","input","output","gpt-5"]),
    publicPage("anthropic","Anthropic","https://docs.anthropic.com/en/docs/about-claude/pricing",["prompt caching","cache write","cache read","sonnet"]),
    publicPage("google","Google AI","https://ai.google.dev/gemini-api/docs/pricing",["cached input","gemini 2.5 flash","context caching"]),
    publicPage("deepseek","DeepSeek","https://api-docs.deepseek.com/quick_start/pricing",["cache hit","cache miss","deepseek-chat"]),
    publicPage("qwen","阿里云百炼","https://help.aliyun.com/zh/model-studio/model-pricing",["qwen","上下文缓存","输入单价","输出单价"]),
  ]);
  const results = adapters.map((r,i) => r.status === "fulfilled" ? r.value : { source: status(`adapter-${i}`,"未知来源","","error",String(r.reason)), updates: [] });
  const collectedAt = new Date().toISOString();
  const parsed = results.flatMap(r=>r.updates);
  let updates = parsed, rejected = 0, persistence = "ok";
  try { const saved = await persist(parsed,results.length,results.filter(r=>r.source.status==="ok").length,collectedAt); updates=saved.accepted; rejected=saved.rejected; }
  catch (error) { persistence = error instanceof Error ? error.message : "snapshot storage failed"; }
  return Response.json({ collectedAt, sources: results.map(r=>r.source), updates, rejected, persistence, policy: "public-pages-only; no authentication; no anti-bot bypass; >50% route changes quarantined" }, { headers: { "cache-control": "no-store" } });
}
