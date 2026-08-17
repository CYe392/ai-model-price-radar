export const dynamic = "force-dynamic";

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
  return n < 0.01 ? n * 1_000_000 : n;
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
  return Response.json({ collectedAt: new Date().toISOString(), sources: results.map(r=>r.source), updates: results.flatMap(r=>r.updates), policy: "public-pages-only; no authentication; no anti-bot bypass" }, { headers: { "cache-control": "no-store" } });
}
