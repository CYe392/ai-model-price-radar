export type PublicRoute = {
  id: string;
  model: string;
  company: string;
  provider: string;
  model_id: string;
  context_tokens: number;
  ability_score: number;
  latency_ms_estimate: number;
  prices: { input: number; cached_input: number | null; cache_write: number | null; output: number; currency: "USD"; unit: "1M tokens" };
  regions: string[];
  compliance: { gdpr: boolean; zdr_option: boolean; published_sla: boolean; no_api_training: boolean; regional_processing: boolean };
  source_url: string;
  verification: "reference" | "verified";
};

const route = (
  id: string,
  model: string,
  company: string,
  provider: string,
  modelId: string,
  context: number,
  ability: number,
  latency: number,
  input: number,
  cached: number | null,
  output: number,
  regions: string[],
  compliance: PublicRoute["compliance"],
  source: string,
  cacheWrite: number | null = null,
): PublicRoute => ({
  id, model, company, provider, model_id: modelId, context_tokens: context,
  ability_score: ability, latency_ms_estimate: latency,
  prices: { input, cached_input: cached, cache_write: cacheWrite, output, currency: "USD", unit: "1M tokens" },
  regions, compliance, source_url: source, verification: "reference",
});

const direct = { gdpr: true, zdr_option: true, published_sla: false, no_api_training: true, regional_processing: true };
const cloud = { gdpr: true, zdr_option: false, published_sla: true, no_api_training: true, regional_processing: true };
const router = { gdpr: true, zdr_option: true, published_sla: false, no_api_training: true, regional_processing: false };
const marketplace = { gdpr: true, zdr_option: false, published_sla: false, no_api_training: true, regional_processing: false };

export const PUBLIC_CATALOG: PublicRoute[] = [
  route("claude-4-sonnet-anthropic", "Claude 4 Sonnet", "Anthropic", "Anthropic Direct", "claude-4-sonnet", 200_000, 98, 820, 3, .3, 15, ["US", "CA", "EU", "UK", "SG", "JP", "AU"], direct, "https://www.anthropic.com/pricing", 3.75),
  route("claude-4-sonnet-bedrock", "Claude 4 Sonnet", "Anthropic", "AWS Bedrock", "anthropic.claude-4-sonnet", 200_000, 98, 960, 3, .3, 15, ["US", "CA", "EU", "UK", "SG", "JP", "AU"], cloud, "https://aws.amazon.com/bedrock/pricing/", 3.75),
  route("claude-4-sonnet-openrouter", "Claude 4 Sonnet", "Anthropic", "OpenRouter", "anthropic/claude-4-sonnet", 200_000, 98, 710, 3, .3, 15, ["US", "CA", "EU", "UK", "HK", "SG", "JP", "AU"], router, "https://openrouter.ai/models"),
  route("gpt-5-mini-openai", "GPT-5 mini", "OpenAI", "OpenAI Direct", "gpt-5-mini", 400_000, 91, 540, .25, .025, 2, ["US", "CA", "EU", "UK", "SG", "JP", "AU"], direct, "https://openai.com/api/pricing/"),
  route("gpt-5-mini-azure", "GPT-5 mini", "OpenAI", "Azure AI", "gpt-5-mini", 400_000, 91, 630, .28, .028, 2.1, ["US", "CA", "EU", "UK", "HK", "SG", "JP", "AU"], cloud, "https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/"),
  route("gpt-5-mini-openrouter", "GPT-5 mini", "OpenAI", "OpenRouter", "openai/gpt-5-mini", 400_000, 91, 580, .25, .025, 2, ["US", "CA", "EU", "UK", "HK", "SG", "JP", "AU"], router, "https://openrouter.ai/models"),
  route("deepseek-v4-flash-direct", "DeepSeek V4 Flash", "DeepSeek", "DeepSeek Direct", "deepseek-v4-flash", 1_000_000, 93, 690, .22, .007, .66, ["CN", "HK", "SG", "JP", "AU"], { ...marketplace, gdpr: false, no_api_training: false }, "https://api-docs.deepseek.com/quick_start/pricing/"),
  route("deepseek-v4-flash-opencode", "DeepSeek V4 Flash", "DeepSeek", "OpenCode Go", "deepseek-v4-flash", 1_000_000, 93, 650, .14, .0028, .28, ["US", "CA", "EU", "UK", "SG", "JP", "AU"], marketplace, "https://opencode.ai/"),
  route("deepseek-v4-flash-together", "DeepSeek V4 Flash", "DeepSeek", "Together AI", "deepseek-ai/DeepSeek-V4-Flash", 1_000_000, 93, 590, .14, .03, .28, ["US", "CA", "EU", "UK", "SG", "JP", "AU"], marketplace, "https://www.together.ai/pricing"),
  route("deepseek-v4-flash-fireworks", "DeepSeek V4 Flash", "DeepSeek", "Fireworks AI", "accounts/fireworks/models/deepseek-v4-flash", 1_000_000, 93, 490, .14, .028, .28, ["US", "CA", "EU", "UK", "SG", "JP", "AU"], marketplace, "https://fireworks.ai/pricing"),
  route("deepseek-v4-pro-direct", "DeepSeek V4 Pro", "DeepSeek", "DeepSeek Direct", "deepseek-v4-pro", 1_000_000, 98, 880, .66, .022, 1.98, ["CN", "HK", "SG", "JP", "AU"], { ...marketplace, gdpr: false, no_api_training: false }, "https://api-docs.deepseek.com/quick_start/pricing/"),
  route("deepseek-v4-pro-openrouter", "DeepSeek V4 Pro", "DeepSeek", "OpenRouter", "deepseek/deepseek-v4-pro", 1_000_000, 98, 720, .66, .02, 1.98, ["US", "CA", "EU", "UK", "HK", "SG", "JP", "AU"], router, "https://openrouter.ai/models"),
  route("qwen37-plus-china", "Qwen3.7 Plus", "Alibaba Cloud", "Alibaba Cloud Model Studio", "qwen3.7-plus", 1_000_000, 92, 520, .276, .055, 1.101, ["CN"], { ...cloud, zdr_option: false }, "https://www.alibabacloud.com/help/en/model-studio/model-pricing"),
  route("qwen37-plus-international", "Qwen3.7 Plus", "Alibaba Cloud", "Alibaba Cloud International", "qwen3.7-plus", 1_000_000, 92, 570, .4, .08, 1.6, ["HK", "SG", "EU", "JP"], { ...cloud, published_sla: false }, "https://www.alibabacloud.com/help/en/model-studio/model-pricing"),
  route("qwen37-plus-us", "Qwen3.7 Plus", "Alibaba Cloud", "Alibaba Cloud US", "qwen3.7-plus-us", 1_000_000, 92, 545, .4, .08, 1.6, ["US"], { ...cloud, published_sla: false }, "https://www.alibabacloud.com/help/en/model-studio/model-pricing"),
  route("qwen37-plus-openrouter", "Qwen3.7 Plus", "Alibaba Cloud", "OpenRouter", "qwen/qwen3.7-plus", 1_000_000, 92, 570, .42, .05, 1.68, ["US", "CA", "EU", "UK", "HK", "SG", "JP", "AU"], router, "https://openrouter.ai/models"),
  route("gemini-25-flash-google", "Gemini 2.5 Flash", "Google", "Google AI", "gemini-2.5-flash", 1_000_000, 88, 470, .3, .03, 2.5, ["US", "CA", "EU", "UK", "HK", "SG", "JP", "AU"], direct, "https://ai.google.dev/gemini-api/docs/pricing"),
  route("gemini-25-flash-openrouter", "Gemini 2.5 Flash", "Google", "OpenRouter", "google/gemini-2.5-flash", 1_000_000, 88, 520, .29, .029, 2.45, ["US", "CA", "EU", "UK", "HK", "SG", "JP", "AU"], router, "https://openrouter.ai/models"),
  route("kimi-k26-fireworks", "Kimi K2.6", "Moonshot AI", "Fireworks AI", "kimi-k2.6", 256_000, 94, 590, .95, .16, 4, ["US", "CA", "EU", "UK", "SG", "JP", "AU"], marketplace, "https://fireworks.ai/pricing"),
  route("glm-52-together", "GLM 5.2", "Z.ai", "Together AI", "zai-org/GLM-5.2", 512_000, 95, 780, 1.4, .26, 4.4, ["US", "CA", "EU", "UK", "SG", "JP", "AU"], marketplace, "https://www.together.ai/pricing"),
  route("minimax-m3-fireworks", "MiniMax M3", "MiniMax", "Fireworks AI", "minimax-m3", 512_000, 90, 560, .3, .06, 1.2, ["US", "CA", "EU", "UK", "SG", "JP", "AU"], marketplace, "https://fireworks.ai/pricing"),
];

export const REGION_CODES = ["US", "CA", "EU", "UK", "CN", "HK", "SG", "JP", "AU"] as const;
export const COMPLIANCE_KEYS = ["gdpr", "zdr_option", "published_sla", "no_api_training", "regional_processing"] as const;

export function filterCatalog(params: URLSearchParams) {
  const model = params.get("model")?.toLowerCase();
  const provider = params.get("provider")?.toLowerCase();
  const region = params.get("region")?.toUpperCase();
  const compliance = params.get("compliance") as keyof PublicRoute["compliance"] | null;
  return PUBLIC_CATALOG.filter((item) =>
    (!model || item.model.toLowerCase().includes(model)) &&
    (!provider || item.provider.toLowerCase().includes(provider)) &&
    (!region || item.regions.includes(region)) &&
    (!compliance || item.compliance[compliance] === true),
  );
}
