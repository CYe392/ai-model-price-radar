/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps, no-irregular-whitespace, jsx-a11y/anchor-is-valid */
"use client";
import { useEffect, useMemo, useState } from "react";
type Region =
  | "全球"
  | "美国"
  | "加拿大"
  | "欧盟"
  | "英国"
  | "中国大陆"
  | "香港"
  | "新加坡"
  | "日本"
  | "澳大利亚";
type LegacyRegion = "北美" | "欧洲" | "亚太";
type Currency = "USD" | "EUR" | "GBP" | "CNY" | "JPY" | "AUD";
type AvailabilityStage = "register" | "purchase" | "deploy" | "residency";
type ComplianceFilter =
  | "all"
  | "gdpr"
  | "zdr"
  | "sla"
  | "no_training"
  | "regional_processing";
type P = {
  name: string;
  input: number;
  cached?: number;
  write?: number;
  output: number;
  latency: number;
  regions: (Region | LegacyRegion)[];
  tag?: string;
  color: string;
  plan?: string;
  tier?: string;
  currency?: string;
  nativeInput?: number;
  nativeOutput?: number;
  listInput?: number;
  listOutput?: number;
  discountPercent?: number;
  pricingRegion?: string;
  fxRate?: number;
  fxAsOf?: string;
  source?: string;
  verifiedAt?: string;
  sourceUrl?: string;
  parserVersion?: string;
  verificationStatus?: VerificationStatus;
  modelId?: string;
  registrationRegions?: Region[];
  purchaseRegions?: Region[];
  deploymentRegions?: Region[];
  dataResidencyRegions?: Region[];
  complianceSource?: string;
  availabilityNote?: string;
  zdr?: boolean;
  gdpr?: boolean;
  sla?: boolean;
  noTraining?: boolean;
  regionalProcessing?: boolean;
};
type RoutePolicy = {
  registration: Region[];
  purchase: Region[];
  deploy: Region[];
  residency: Region[];
  modelId: string;
  residencyLabel: string;
  retentionLabel: string;
  trainingLabel: string;
  zdr: boolean;
  gdpr: boolean;
  sla: boolean;
  noTraining: boolean;
  regionalProcessing: boolean;
  note: string;
  source?: string;
};
type VerificationStatus =
  | "verified"
  | "previously_verified"
  | "reference"
  | "quarantined";
type M = {
  name: string;
  company: string;
  icon: string;
  context: string;
  ability: number;
  providers: P[];
};
type FetchSource = {
  id: string;
  name: string;
  url: string;
  status: "ok" | "changed" | "blocked" | "error";
  detail: string;
  records: number;
};
type PriceUpdate = {
  model: string;
  provider: string;
  input?: number;
  cached?: number;
  write?: number;
  output?: number;
  source: string;
  tier?: string;
  currency?: string;
  nativeInput?: number;
  nativeOutput?: number;
  listInput?: number;
  listOutput?: number;
  discountPercent?: number;
  pricingRegion?: string;
  fxRate?: number;
  fxAsOf?: string;
  sourceUrl?: string;
  parserVersion?: string;
  verificationStatus?: VerificationStatus;
  verifiedAt?: string;
};
type PriceChange = {
  model: string;
  provider: string;
  field: string;
  before: number;
  after: number;
  percent: number;
  direction: "up" | "down";
};
type HistorySnapshot = {
  id: number;
  collectedAt: string;
  model: string;
  provider: string;
  source: string;
  input: number | null;
  cached: number | null;
  cacheWrite: number | null;
  output: number | null;
  currency: string | null;
  pricingRegion: string | null;
  tier: string | null;
  changePercent: number | null;
  sourceUrl?: string | null;
  parserVersion?: string | null;
  verificationStatus?: VerificationStatus | null;
  accepted?: boolean;
};
type CollectionRun = {
  id: number;
  collectedAt: string;
  sourceCount: number;
  okCount: number;
  updateCount: number;
  rejectedCount: number;
};
type SourceCheck = {
  id: number;
  checkedAt: string;
  sourceId: string;
  sourceName: string;
  url: string;
  status: "ok" | "changed" | "blocked" | "error";
  detail: string;
  records: number;
};
const models: M[] = [
  {
    name: "Claude 4 Sonnet",
    company: "Anthropic",
    icon: "A",
    context: "200K",
    ability: 98,
    providers: [
      {
        name: "Anthropic 官方",
        input: 3,
        cached: 0.3,
        write: 3.75,
        output: 15,
        latency: 820,
        regions: ["全球", "北美", "欧洲", "亚太"],
        color: "orange",
      },
      {
        name: "AWS Bedrock",
        input: 3,
        cached: 0.3,
        write: 3.75,
        output: 15,
        latency: 960,
        regions: ["全球", "北美", "欧洲", "亚太"],
        color: "yellow",
      },
      {
        name: "OpenRouter",
        input: 3,
        cached: 0.3,
        output: 15,
        latency: 710,
        regions: ["全球", "北美", "欧洲", "亚太"],
        color: "purple",
      },
    ],
  },
  {
    name: "GPT-5 mini",
    company: "OpenAI",
    icon: "◎",
    context: "400K",
    ability: 91,
    providers: [
      {
        name: "OpenAI 官方",
        input: 0.25,
        cached: 0.025,
        output: 2,
        latency: 540,
        regions: ["全球", "北美", "欧洲", "亚太"],
        color: "green",
      },
      {
        name: "Azure AI",
        input: 0.28,
        cached: 0.028,
        output: 2.1,
        latency: 630,
        regions: ["全球", "北美", "欧洲", "亚太"],
        tag: "企业 SLA",
        color: "blue",
      },
      {
        name: "OpenRouter",
        input: 0.25,
        cached: 0.025,
        output: 2,
        latency: 580,
        regions: ["全球", "北美", "欧洲", "亚太"],
        color: "purple",
      },
    ],
  },
  {
    name: "DeepSeek V4 Flash",
    company: "DeepSeek",
    icon: "D",
    context: "1M",
    ability: 93,
    providers: [
      {
        name: "DeepSeek 官方",
        input: 0.22,
        cached: 0.007,
        output: 0.66,
        latency: 690,
        regions: ["全球", "中国大陆", "亚太"],
        tag: "峰谷计价",
        color: "orange",
      },
      {
        name: "SiliconFlow",
        input: 0.23,
        cached: 0.023,
        output: 0.37,
        latency: 610,
        regions: ["中国大陆", "亚太"],
        tag: "待官网刷新",
        color: "blue",
      },
      {
        name: "OpenRouter",
        input: 0.26,
        cached: 0.026,
        output: 0.4,
        latency: 570,
        regions: ["全球", "北美", "欧洲", "亚太"],
        color: "purple",
      },
      {
        name: "OpenCode Go",
        input: 0.14,
        cached: 0.0028,
        output: 0.28,
        latency: 650,
        regions: ["北美", "欧洲", "亚太"],
        tag: "订阅额度",
        plan: "$10/mo · usage allowance",
        color: "teal",
      },
      {
        name: "Together AI",
        input: 0.14,
        cached: 0.03,
        output: 0.28,
        latency: 590,
        regions: ["全球", "北美", "欧洲", "亚太"],
        color: "pink",
      },
      {
        name: "Fireworks AI",
        input: 0.14,
        cached: 0.028,
        output: 0.28,
        latency: 490,
        regions: ["全球", "北美", "欧洲", "亚太"],
        color: "pink",
      },
    ],
  },
  {
    name: "DeepSeek V4 Pro",
    company: "DeepSeek",
    icon: "D+",
    context: "1M",
    ability: 98,
    providers: [
      {
        name: "DeepSeek 官方",
        input: 0.66,
        cached: 0.022,
        output: 1.98,
        latency: 880,
        regions: ["全球", "中国大陆", "亚太"],
        tag: "峰谷计价",
        color: "orange",
      },
      {
        name: "Together AI",
        input: 1.74,
        cached: 0.2,
        output: 3.48,
        latency: 760,
        regions: ["全球", "北美", "欧洲", "亚太"],
        color: "pink",
      },
      {
        name: "Fireworks AI",
        input: 1.74,
        cached: 0.145,
        output: 3.48,
        latency: 690,
        regions: ["全球", "北美", "欧洲", "亚太"],
        color: "pink",
      },
      {
        name: "OpenRouter",
        input: 0.66,
        cached: 0.02,
        output: 1.98,
        latency: 720,
        regions: ["全球", "北美", "欧洲", "亚太"],
        color: "purple",
      },
    ],
  },
  {
    name: "Qwen3.7 Plus",
    company: "Alibaba Cloud",
    icon: "Q",
    context: "1M",
    ability: 92,
    providers: [
      {
        name: "阿里云百炼",
        input: 0.276,
        cached: 0.055,
        output: 1.101,
        latency: 520,
        regions: ["中国大陆"],
        registrationRegions: ["中国大陆"],
        purchaseRegions: ["中国大陆"],
        deploymentRegions: ["中国大陆"],
        dataResidencyRegions: ["中国大陆"],
        modelId: "qwen3.7-plus",
        pricingRegion: "China (Beijing)",
        sourceUrl: "https://www.alibabacloud.com/help/en/model-studio/model-pricing",
        complianceSource: "https://www.alibabacloud.com/help/en/model-studio/models",
        availabilityNote: "Chinese-mainland service scope; Beijing endpoint and API key.",
        noTraining: true,
        regionalProcessing: true,
        tag: "中国区价格",
        color: "orange",
      },
      {
        name: "Alibaba Cloud · International",
        input: 0.4,
        cached: 0.08,
        output: 1.6,
        latency: 570,
        regions: ["香港", "新加坡", "欧盟", "英国", "日本", "澳大利亚"],
        registrationRegions: ["香港", "新加坡", "欧盟", "英国", "日本", "澳大利亚", "加拿大"],
        purchaseRegions: ["香港", "新加坡", "欧盟", "英国", "日本", "澳大利亚", "加拿大"],
        deploymentRegions: ["香港", "新加坡", "欧盟", "日本"],
        dataResidencyRegions: ["香港", "新加坡", "欧盟", "日本"],
        modelId: "qwen3.7-plus",
        pricingRegion: "Singapore / regional endpoints",
        sourceUrl: "https://www.alibabacloud.com/help/en/model-studio/model-pricing",
        complianceSource: "https://www.alibabacloud.com/help/en/model-studio/models",
        availabilityNote: "Regional endpoints, API keys, supported models, and prices are not interchangeable.",
        gdpr: true,
        noTraining: true,
        regionalProcessing: true,
        tag: "国际区价格",
        color: "orange",
      },
      {
        name: "Alibaba Cloud · US",
        input: 0.4,
        cached: 0.08,
        output: 1.6,
        latency: 545,
        regions: ["美国", "加拿大"],
        registrationRegions: ["美国", "加拿大"],
        purchaseRegions: ["美国", "加拿大"],
        deploymentRegions: ["美国"],
        dataResidencyRegions: ["美国"],
        modelId: "qwen3.7-plus-us",
        pricingRegion: "US (Virginia)",
        sourceUrl: "https://www.alibabacloud.com/help/en/model-studio/model-pricing",
        complianceSource: "https://www.alibabacloud.com/help/en/model-studio/models",
        availabilityNote: "US service scope uses a US model ID and Virginia endpoint.",
        noTraining: true,
        regionalProcessing: true,
        tag: "美国区价格",
        color: "orange",
      },
      {
        name: "OpenCode Go",
        input: 0.4,
        cached: 0.04,
        write: 0.5,
        output: 1.6,
        latency: 610,
        regions: ["北美", "欧洲", "亚太"],
        tag: "订阅额度",
        plan: "$10/mo · usage allowance",
        color: "teal",
      },
      {
        name: "OpenRouter",
        input: 0.42,
        cached: 0.05,
        output: 1.68,
        latency: 570,
        regions: ["全球", "北美", "欧洲", "亚太"],
        color: "purple",
      },
      {
        name: "Together AI",
        input: 0.32,
        output: 1.28,
        latency: 620,
        regions: ["全球", "北美", "欧洲", "亚太"],
        color: "pink",
      },
      {
        name: "Fireworks AI",
        input: 0.4,
        cached: 0.08,
        output: 1.6,
        latency: 510,
        regions: ["全球", "北美", "欧洲", "亚太"],
        color: "pink",
      },
    ],
  },
  {
    name: "Gemini 2.5 Flash",
    company: "Google",
    icon: "✦",
    context: "1M",
    ability: 88,
    providers: [
      {
        name: "Google AI",
        input: 0.3,
        cached: 0.03,
        output: 2.5,
        latency: 470,
        regions: ["全球", "北美", "欧洲", "亚太"],
        color: "blue",
      },
      {
        name: "OpenRouter",
        input: 0.29,
        cached: 0.029,
        output: 2.45,
        latency: 520,
        regions: ["全球", "北美", "欧洲", "亚太"],
        tag: "省 2%",
        color: "purple",
      },
    ],
  },
  {
    name: "Kimi K2.6",
    company: "Moonshot AI",
    icon: "K",
    context: "256K",
    ability: 94,
    providers: [
      {
        name: "Together AI",
        input: 1.2,
        cached: 0.2,
        output: 4.5,
        latency: 720,
        regions: ["全球", "北美", "欧洲", "亚太"],
        color: "pink",
      },
      {
        name: "Fireworks AI",
        input: 0.95,
        cached: 0.16,
        output: 4,
        latency: 590,
        regions: ["全球", "北美", "欧洲", "亚太"],
        color: "pink",
      },
    ],
  },
  {
    name: "GLM 5.2",
    company: "Z.ai",
    icon: "G",
    context: "512K",
    ability: 95,
    providers: [
      {
        name: "Together AI",
        input: 1.4,
        cached: 0.26,
        output: 4.4,
        latency: 780,
        regions: ["全球", "北美", "欧洲", "亚太"],
        color: "pink",
      },
      {
        name: "Fireworks AI",
        input: 1.4,
        cached: 0.14,
        output: 4.4,
        latency: 650,
        regions: ["全球", "北美", "欧洲", "亚太"],
        color: "pink",
      },
    ],
  },
  {
    name: "MiniMax M3",
    company: "MiniMax",
    icon: "M",
    context: "512K",
    ability: 90,
    providers: [
      {
        name: "Fireworks AI",
        input: 0.3,
        cached: 0.06,
        output: 1.2,
        latency: 560,
        regions: ["全球", "北美", "欧洲", "亚太"],
        color: "pink",
      },
    ],
  },
];
const briefs = [
  {
    tag: "ROUTER",
    time: "Today · 11:40",
    title: "OpenCode Go subscription pricing added",
    text: "OpenCode Go combines a $10/month base subscription with dollar-denominated five-hour, weekly, and monthly usage allowances.",
    impact:
      "It can suit sustained open-model coding workloads. Low-volume users should still compare pay-as-you-go routes. Coverage focuses on the US, EU, and Singapore.",
  },
  {
    tag: "PRICING",
    time: "Today · 10:24",
    title: "Cache pricing is now included in route cost",
    text: "Cached input can cost 5–100× less than standard input, while some providers charge separately for cache writes.",
    impact:
      "Long system prompts, stable RAG prefixes, and repository context benefit most. Compare input, output, expected hit rate, and write frequency together.",
  },
  {
    tag: "REGION",
    time: "Today · 09:10",
    title: "Qwen pricing differs across global, China, and US routes",
    text: "Alibaba Cloud prices models by deployment region and context tier, with limited-time discounts on selected SKUs.",
    impact:
      "US deployments may use different model IDs and prices from China or international routes. This tool filters unavailable routes, but provider terms remain authoritative.",
  },
];
const scenarios = [
  {
    icon: "⌁",
    title: "Customer support",
    desc: "High throughput, predictable cost, multilingual quality",
  },
  {
    icon: "⌘",
    title: "Coding assistant",
    desc: "Strong reasoning, long context, and tool use",
  },
  {
    icon: "✦",
    title: "Content pipelines",
    desc: "High-volume summarization, classification, and extraction",
  },
];
const regionOptions: Region[] = [
  "全球",
  "美国",
  "加拿大",
  "欧盟",
  "英国",
  "中国大陆",
  "香港",
  "新加坡",
  "日本",
  "澳大利亚",
];
const marketRegions = regionOptions.filter((r) => r !== "全球");
const currencyRates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CNY: 7.18,
  JPY: 147,
  AUD: 1.54,
};
function uniqueRegions(regions: Region[]) {
  return [...new Set(regions)];
}
function expandRegions(regions: (Region | LegacyRegion)[]) {
  const expanded: Region[] = [];
  for (const region of regions) {
    if (region === "全球")
      expanded.push("美国", "加拿大", "欧盟", "英国", "香港", "新加坡", "日本", "澳大利亚");
    else if (region === "北美") expanded.push("美国", "加拿大");
    else if (region === "欧洲") expanded.push("欧盟", "英国");
    else if (region === "亚太") expanded.push("香港", "新加坡", "日本", "澳大利亚");
    else expanded.push(region);
  }
  return uniqueRegions(expanded);
}
function routePolicy(p: P): RoutePolicy {
  const provider = p.name;
  const base = expandRegions(p.regions);
  let registration = p.registrationRegions ?? base;
  let purchase = p.purchaseRegions ?? registration;
  let deploy = p.deploymentRegions ?? base;
  let residency = p.dataResidencyRegions ?? [];
  let zdr = p.zdr ?? false;
  let gdpr = p.gdpr ?? false;
  let sla = p.sla ?? p.tag === "企业 SLA";
  let noTraining = p.noTraining ?? false;
  let regionalProcessing = p.regionalProcessing ?? false;
  let retentionLabel = "Verify retention in provider terms";
  let trainingLabel = noTraining ? "API data not used for training" : "Verify training policy";
  let note = p.availabilityNote ?? "Availability can depend on account, model access, and provider terms.";
  let source = p.complianceSource ?? p.sourceUrl;

  if (provider === "OpenAI 官方") {
    registration = marketRegions.filter((r) => r !== "中国大陆");
    purchase = registration;
    deploy = ["美国", "欧盟"];
    residency = ["美国", "加拿大", "欧盟", "英国", "新加坡", "日本", "澳大利亚"];
    zdr = true;
    gdpr = true;
    noTraining = true;
    regionalProcessing = true;
    retentionLabel = "ZDR is approval- and endpoint-dependent";
    trainingLabel = "API data not used for training by default";
    note = "Non-US residency requires eligible controls; only documented regions support regional processing.";
    source = "https://platform.openai.com/docs/models/default-usage-policies-by-endpoint";
  } else if (provider === "AWS Bedrock") {
    registration = marketRegions.filter((r) => r !== "中国大陆");
    purchase = registration;
    deploy = ["美国", "加拿大", "欧盟", "英国", "新加坡", "日本", "澳大利亚"];
    residency = deploy;
    gdpr = true;
    sla = true;
    noTraining = true;
    regionalProcessing = true;
    retentionLabel = "In-Region, geographic, and global routing differ";
    trainingLabel = "Bedrock service data protection applies";
    note = "Choose In-Region for a single region or geographic routing to stay within a documented geography.";
    source = "https://docs.aws.amazon.com/bedrock/latest/userguide/models-region-compatibility.html";
  } else if (provider === "Azure AI") {
    registration = marketRegions.filter((r) => r !== "中国大陆");
    purchase = registration;
    deploy = ["美国", "加拿大", "欧盟", "英国", "香港", "新加坡", "日本", "澳大利亚"];
    residency = deploy;
    gdpr = true;
    sla = true;
    noTraining = true;
    regionalProcessing = true;
    retentionLabel = "Deployment and abuse-monitoring controls vary by service";
    trainingLabel = "Customer prompts are not used to train base models";
    note = "Select a regional deployment and confirm the specific Azure model/SKU is offered there.";
  } else if (provider === "OpenRouter") {
    registration = marketRegions.filter((r) => r !== "中国大陆");
    purchase = registration;
    deploy = registration;
    residency = [];
    zdr = true;
    gdpr = true;
    noTraining = true;
    retentionLabel = "ZDR depends on the selected upstream route";
    trainingLabel = "Route-level data policy must be checked";
    note = "Router access does not guarantee upstream data residency; enable a compatible ZDR route when required.";
  } else if (["Together AI", "Fireworks AI", "OpenCode Go"].includes(provider)) {
    registration = marketRegions.filter((r) => r !== "中国大陆");
    purchase = registration;
    deploy = registration;
    gdpr = true;
    noTraining = true;
    retentionLabel = "Retention depends on product tier and route";
    trainingLabel = "Provider API policy applies";
  } else if (provider.includes("Alibaba Cloud") || provider === "阿里云百炼") {
    retentionLabel = "Regional endpoint and workspace controls apply";
    trainingLabel = noTraining ? "Provider API policy applies" : trainingLabel;
    source = p.complianceSource ?? "https://www.alibabacloud.com/help/en/model-studio/models";
  } else if (provider === "DeepSeek 官方" || provider === "SiliconFlow") {
    registration = uniqueRegions([...base, "中国大陆"]);
    purchase = registration;
    deploy = registration;
    residency = base.includes("中国大陆") ? ["中国大陆"] : [];
    noTraining = p.noTraining ?? false;
    retentionLabel = "Confirm retention and cross-border processing in provider terms";
  }

  return {
    registration: uniqueRegions(registration),
    purchase: uniqueRegions(purchase),
    deploy: uniqueRegions(deploy),
    residency: uniqueRegions(residency),
    modelId: p.modelId ?? provider.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    residencyLabel: residency.length ? residency.map(regionLabel).join(" / ") : "Provider-controlled / not documented",
    retentionLabel,
    trainingLabel,
    zdr,
    gdpr,
    sla,
    noTraining,
    regionalProcessing,
    note,
    source,
  };
}
function routeAvailable(p: P, region: Region, stage: AvailabilityStage) {
  if (region === "全球") return true;
  return routePolicy(p)[stage].includes(region);
}
function routeMatchesCompliance(p: P, filter: ComplianceFilter) {
  if (filter === "all") return true;
  const policy = routePolicy(p);
  if (filter === "no_training") return policy.noTraining;
  if (filter === "regional_processing") return policy.regionalProcessing;
  return policy[filter];
}
function unavailableReason(p: P, region: Region, stage: AvailabilityStage) {
  if (region === "全球" || routeAvailable(p, region, stage)) return "";
  const labels: Record<AvailabilityStage, string> = {
    register: "Account registration is not documented",
    purchase: "Purchase access is not documented",
    deploy: "No documented deployment in this region",
    residency: "No documented in-region data residency",
  };
  return `${labels[stage]} for ${regionLabel(region)}.`;
}
function formatMoney(value: number, currency: Currency, digits = 3) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "JPY" ? 0 : 2,
    maximumFractionDigits: currency === "JPY" ? 2 : digits,
  }).format(value * currencyRates[currency]);
}
export default function Home() {
  const [tab, setTab] = useState("prices"),
    [q, setQ] = useState(""),
    [sort, setSort] = useState("input"),
    [region, setRegion] = useState<Region>("全球"),
    [priority, setPriority] = useState("balanced"),
    [availabilityStage, setAvailabilityStage] = useState<AvailabilityStage>("purchase"),
    [compliance, setCompliance] = useState<ComplianceFilter>("all"),
    [currency, setCurrency] = useState<Currency>("USD"),
    [busy, setBusy] = useState(false),
    [updated, setUpdated] = useState("Not refreshed yet"),
    [toast, setToast] = useState(false),
    [openBrief, setOpenBrief] = useState<number | null>(null),
    [updates, setUpdates] = useState<PriceUpdate[]>([]),
    [sources, setSources] = useState<FetchSource[]>([]),
    [changes, setChanges] = useState<PriceChange[]>([]),
    [fetchError, setFetchError] = useState("");
  const [history, setHistory] = useState<HistorySnapshot[]>([]),
    [quarantined, setQuarantined] = useState<HistorySnapshot[]>([]),
    [runs, setRuns] = useState<CollectionRun[]>([]),
    [checks, setChecks] = useState<SourceCheck[]>([]),
    [historyLoaded, setHistoryLoaded] = useState(false),
    [historyBusy, setHistoryBusy] = useState(false),
    [historyError, setHistoryError] = useState("");
  useEffect(() => {
    if (!["history", "health"].includes(tab) || historyLoaded) return;
    setHistoryBusy(true);
    fetch("/api/history", { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(`Server returned ${r.status}`);
        return r.json();
      })
      .then(
        (data: {
          snapshots: HistorySnapshot[];
          quarantined: HistorySnapshot[];
          runs: CollectionRun[];
          checks: SourceCheck[];
        }) => {
          setHistory(data.snapshots || []);
          setQuarantined(data.quarantined || []);
          setRuns(data.runs || []);
          setChecks(data.checks || []);
          setHistoryLoaded(true);
        },
      )
      .catch((e) =>
        setHistoryError(e instanceof Error ? e.message : "History unavailable"),
      )
      .finally(() => setHistoryBusy(false));
  }, [tab, historyLoaded]);
  const available = (p: P) =>
    routeAvailable(p, region, availabilityStage) &&
    routeMatchesCompliance(p, compliance);
  const liveModels = useMemo(
    () =>
      models.map((m) => ({
        ...m,
        providers: m.providers.map((p) => {
          const u = updates.find(
            (x) => x.model === m.name && x.provider === p.name,
          );
          return u
            ? {
                ...p,
                ...Object.fromEntries(
                  Object.entries(u).filter(
                    ([k, v]) => !["model", "provider"].includes(k) && v != null,
                  ),
                ),
                verifiedAt: u.verifiedAt,
              }
            : p;
        }),
      })),
    [updates, updated],
  );
  const shown = useMemo(
    () =>
      liveModels
        .map((m) => ({ ...m, providers: m.providers.filter(available) }))
        .filter(
          (m) =>
            m.providers.length &&
            (m.name + m.company + m.providers.map((p) => p.name))
              .toLowerCase()
              .includes(q.toLowerCase()),
        )
        .sort((a, b) =>
          sort === "name"
            ? a.name.localeCompare(b.name)
            : Math.min(
                ...a.providers.map((p) =>
                  sort === "cached"
                    ? (p.cached ?? p.input)
                    : sort === "output"
                      ? p.output
                      : p.input,
                ),
              ) -
              Math.min(
                ...b.providers.map((p) =>
                  sort === "cached"
                    ? (p.cached ?? p.input)
                    : sort === "output"
                      ? p.output
                      : p.input,
                ),
              ),
        ),
    [q, sort, region, availabilityStage, compliance, liveModels],
  );
  const allRouteCount = liveModels.reduce((sum, m) => sum + m.providers.length, 0);
  const availableRouteCount = liveModels.reduce(
    (sum, m) => sum + m.providers.filter(available).length,
    0,
  );
  const exclusionReasons = liveModels
    .flatMap((m) => m.providers)
    .filter((p) => !available(p))
    .reduce<Record<string, number>>((counts, p) => {
      const reason =
        unavailableReason(p, region, availabilityStage) ||
        `Does not satisfy the ${complianceLabel(compliance)} requirement.`;
      counts[reason] = (counts[reason] ?? 0) + 1;
      return counts;
    }, {});
  const liveBriefs = changes.length
    ? changes
        .slice(0, 8)
        .map((c) => ({
          tag: c.direction === "up" ? "PRICE UP" : "PRICE DOWN",
          time: "Latest refresh",
          title: `${providerLabel(c.provider)} · ${c.model} ${fieldName(c.field)} ${c.direction === "up" ? "rose" : "fell"} ${Math.abs(c.percent)}%`,
          text: `Per-million-token price moved from $${c.before} to $${c.after}.`,
          impact:
            c.direction === "up"
              ? "This route is now more expensive and will rank lower for cost-focused recommendations. Review alternatives."
              : "This route is now cheaper and may rank higher in cost-focused recommendations.",
        }))
    : briefs;
  async function refresh() {
    if (busy) return;
    setBusy(true);
    setFetchError("");
    try {
      const response = await fetch("/api/prices", { cache: "no-store" });
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const data = (await response.json()) as {
        collectedAt: string;
        sources: FetchSource[];
        updates: PriceUpdate[];
        changes: PriceChange[];
      };
      setSources(data.sources);
      setUpdates(data.updates);
      setChanges(data.changes || []);
      setUpdated(
        new Date(data.collectedAt).toLocaleString("en-US", { hour12: false }),
      );
      setToast(true);
      setTimeout(() => setToast(false), 2800);
    } catch (error) {
      setFetchError(error instanceof Error ? error.message : "Refresh failed");
    } finally {
      setBusy(false);
    }
  }
  function recommendation(i: number) {
    const candidates = liveModels
      .flatMap((m) =>
        m.providers
          .filter(available)
          .map((p) => ({
            m,
            p,
            score:
              priority === "price"
                ? 100 - (p.input + p.output) * 8
                : priority === "ability"
                  ? m.ability - p.latency / 1000
                  : m.ability * 0.55 -
                    (p.input + p.output) * 3 -
                    (p.latency / 100) * 0.7 +
                    (i === 0 && m.company.includes("Alibaba") ? 5 : 0),
          })),
      )
      .sort((a, b) => b.score - a.score);
    return candidates[i === 2 ? Math.min(1, candidates.length - 1) : 0];
  }
  return (
    <main>
      <Header tab={tab} setTab={setTab} />
      <Hero models={liveModels} />
      <section className="panel wrap">
        <div className="panelTop">
          <div className="tabs">
            {[
              ["prices", "◫", "Live pricing"],
              ["calculator", "$", "Cost calculator"],
              ["history", "↗", "Price history"],
              ["health", "●", "Data health"],
              ["brief", "≡", "Market brief"],
              ["recommend", "◇", "Recommendations"],
            ].map((x) => (
              <button
                key={x[0]}
                className={tab === x[0] ? "on" : ""}
                onClick={() => setTab(x[0])}
              >
                <span>{x[1]}</span>
                {x[2]}
                {x[0] === "brief" && <i>3</i>}
              </button>
            ))}
          </div>
          <div className="refresh">
            <small>Public provider pricing · Updated: {updated}</small>
            <button onClick={refresh} disabled={busy}>
              <b className={busy ? "spin" : ""}>↻</b>
              {busy ? "Checking official sources" : "Refresh prices"}
            </button>
          </div>
        </div>
        {tab === "prices" && (
          <>
            <div className="sourceNote">
              <b>No provider accounts required</b> Every route shows whether its
              price was verified now, retained from a previous verification, or
              included as reference data. Official billing pages remain
              authoritative.
            </div>
            <div className="filters">
              <label>
                ⌕
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search models or providers..."
                />
              </label>
              <Filter
                label="Region"
                value={region}
                set={(v) => setRegion(v as Region)}
                options={regionOptions.map((r) => `${r}|${regionLabel(r)}`)}
              />
              <Filter
                label="Availability"
                value={availabilityStage}
                set={(v) => setAvailabilityStage(v as AvailabilityStage)}
                options={[
                  "register|Can register",
                  "purchase|Can purchase",
                  "deploy|Can deploy in-region",
                  "residency|Data resides in-region",
                ]}
              />
              <Filter
                label="Compliance"
                value={compliance}
                set={(v) => setCompliance(v as ComplianceFilter)}
                options={[
                  "all|All routes",
                  "gdpr|GDPR support",
                  "zdr|ZDR option",
                  "sla|Published SLA",
                  "no_training|No API training",
                  "regional_processing|Regional processing",
                ]}
              />
              <Filter
                label="Sort by"
                value={sort}
                set={setSort}
                options={[
                  "input|Standard input",
                  "cached|Cached input",
                  "output|Output price",
                  "name|Model name",
                ]}
              />
              <Filter
                label="Currency"
                value={currency}
                set={(v) => setCurrency(v as Currency)}
                options={["USD", "EUR", "GBP", "CNY", "JPY", "AUD"]}
              />
              <small>{currency} per 1M tokens · planning FX</small>
            </div>
            <div className="regionIntel">
              <div>
                <small>REGION VIEW</small>
                <strong>{regionLabel(region)}</strong>
                <span>{availabilityLabel(availabilityStage)}</span>
              </div>
              <div>
                <small>ELIGIBLE ROUTES</small>
                <strong>{availableRouteCount} / {allRouteCount}</strong>
                <span>{complianceLabel(compliance)}</span>
              </div>
              <div className="exclusionSummary">
                <small>WHY ROUTES ARE HIDDEN</small>
                {Object.keys(exclusionReasons).length ? (
                  Object.entries(exclusionReasons).slice(0, 3).map(([reason, count]) => (
                    <span key={reason}><b>{count}</b> {reason}</span>
                  ))
                ) : (
                  <span>All routes satisfy this view.</span>
                )}
              </div>
            </div>
            <div className="grid">
              {shown.map((m) => (
                <article className="model" key={m.name}>
                  <div className="modelTitle">
                    <i>{m.icon}</i>
                    <div>
                      <h2>{m.name}</h2>
                      <p>
                        {m.company} · {m.context} context
                      </p>
                    </div>
                    <small>{m.providers.length} available routes</small>
                  </div>
                  <div className="thead five">
                    <span>Provider</span>
                    <span>Input</span>
                    <span>Cache read</span>
                    <span>Output</span>
                    <span>Latency*</span>
                  </div>
                  {m.providers.map((p, i) => {
                    const policy = routePolicy(p);
                    return <div className="row five" key={p.name}>
                      <div>
                        <b className={p.color}>{providerLabel(p.name)}</b>
                        {i ===
                          m.providers.findIndex(
                            (v) =>
                              v.input ===
                              Math.min(...m.providers.map((x) => x.input)),
                          ) && <em>LOWEST INPUT</em>}
                        <em
                          className={`trust ${p.verificationStatus ?? "reference"}`}
                        >
                          {verificationLabel(
                            p.verificationStatus ?? "reference",
                          )}
                        </em>
                      </div>
                      <strong>{formatMoney(p.input, currency, 4)}</strong>
                      <strong className="cache">
                        {p.cached != null ? formatMoney(p.cached, currency, 4) : "—"}
                      </strong>
                      <strong>{formatMoney(p.output, currency, 4)}</strong>
                      <span className="latency">
                        <i /> {p.latency}ms
                      </span>
                      <small>
                        {p.sourceUrl ? (
                          <a href={p.sourceUrl} target="_blank" rel="noreferrer">
                            {providerLabel(p.source ?? p.name)} source ↗
                          </a>
                        ) : (
                          p.plan || p.regions.map(regionLabel).join(" / ")
                        )}
                        {p.verifiedAt && (
                          <b className={freshness(p.verifiedAt).toLowerCase()}>
                            {freshness(p.verifiedAt)} · {ageLabel(p.verifiedAt)}
                          </b>
                        )}
                        {p.write != null && <b>Write {formatMoney(p.write, currency, 4)}</b>}
                        {p.tag && <b>{tagLabel(p.tag)}</b>}
                      </small>
                      <div className="policyBadges">
                        <code>{policy.modelId}</code>
                        <span>Residency: {policy.residencyLabel}</span>
                        {policy.gdpr && <b>GDPR</b>}
                        {policy.zdr && <b>ZDR option</b>}
                        {policy.sla && <b>SLA</b>}
                        {policy.noTraining && <b>No API training</b>}
                        {policy.regionalProcessing && <b>Regional processing</b>}
                        {policy.source && <a href={policy.source} target="_blank" rel="noreferrer">Policy source ↗</a>}
                        <i>{policy.note}</i>
                      </div>
                    </div>
                  })}
                </article>
              ))}
            </div>
            <div className="dataLegend">
              * Latency is an editorial planning estimate, not a live benchmark.
              Reference routes are excluded from claims of live verification.
            </div>
            {!shown.length && (
              <div className="empty">
                No routes satisfy {availabilityLabel(availabilityStage).toLowerCase()} in {regionLabel(region)} with {complianceLabel(compliance).toLowerCase()}.
              </div>
            )}
          </>
        )}
        {tab === "brief" && (
          <div className="brief">
            <div>
              <Title
                label="MARKET BRIEF"
                title="What changed across AI providers"
                sub="Pricing, regional availability, quotas, and service changes in one concise view."
              />
              {liveBriefs.map((b, i) => (
                <article
                  key={b.title}
                  className={openBrief === i ? "expanded" : ""}
                >
                  <small>
                    {b.time}　<b>{b.tag}</b>
                  </small>
                  <h3>{b.title}</h3>
                  <p>{b.text}</p>
                  <button
                    onClick={() => setOpenBrief(openBrief === i ? null : i)}
                  >
                    {openBrief === i
                      ? "Hide analysis ↑"
                      : "View impact analysis →"}
                  </button>
                  {openBrief === i && (
                    <div className="impact">
                      <b>Selection impact</b>
                      <p>{b.impact}</p>
                    </div>
                  )}
                </article>
              ))}
            </div>
            <aside>
              <h3>At a glance</h3>
              <strong>{changes.length || 3}</strong>
              <span>
                {changes.length
                  ? "live price changes"
                  : "changes worth watching"}
              </span>
              <hr />
              <small>Data basis</small>
              <b className="lime">Snapshot diffs · official public pricing</b>
              <small>Parsed this refresh</small>
              <b>{updates.length} live prices</b>
              <small>Safety check</small>
              <b className="warn">Changes over 50% are quarantined</b>
            </aside>
          </div>
        )}
        {tab === "recommend" && (
          <>
            <Title
              label="USE-CASE MATCHING"
              title="Choose an API for the job"
              sub="Recommendations update with your region and priorities. Validate production workloads with a small-scale test."
            />
            <div className="recommendFilters">
              <Filter
                label="Region"
                value={region}
                set={(v) => setRegion(v as Region)}
                options={regionOptions.map((r) => `${r}|${regionLabel(r)}`)}
              />
              <Filter
                label="Optimize for"
                value={priority}
                set={setPriority}
                options={[
                  "price|Lowest cost",
                  "balanced|Cost / capability balance",
                  "ability|Best capability",
                ]}
              />
              <Filter
                label="Availability"
                value={availabilityStage}
                set={(v) => setAvailabilityStage(v as AvailabilityStage)}
                options={[
                  "register|Can register",
                  "purchase|Can purchase",
                  "deploy|Can deploy in-region",
                  "residency|Data resides in-region",
                ]}
              />
              <Filter
                label="Compliance"
                value={compliance}
                set={(v) => setCompliance(v as ComplianceFilter)}
                options={[
                  "all|All routes",
                  "gdpr|GDPR support",
                  "zdr|ZDR option",
                  "sla|Published SLA",
                  "no_training|No API training",
                  "regional_processing|Regional processing",
                ]}
              />
              <Filter
                label="Currency"
                value={currency}
                set={(v) => setCurrency(v as Currency)}
                options={["USD", "EUR", "GBP", "CNY", "JPY", "AUD"]}
              />
              <span>
                Ranking applies region, access stage, and compliance together
              </span>
            </div>
            <div className="caseGrid">
              {scenarios.map((c, i) => {
                const r = recommendation(i);
                return (
                  <article key={c.title}>
                    <i>{c.icon}</i>
                    <h3>{c.title}</h3>
                    <p>{c.desc}</p>
                    <div className="pick">
                      <small>
                        BEST FIT ·{" "}
                        {priority === "price"
                          ? "COST FIRST"
                          : priority === "ability"
                            ? "CAPABILITY FIRST"
                            : "BALANCED"}
                      </small>
                      <strong>{r?.m.name}</strong>
                      <span>{providerLabel(r?.p.name || "")}</span>
                    </div>
                    <div className="price">
                      <span>Input / cache read / output</span>
                      <b>
                        {r ? `${formatMoney(r.p.input, currency, 4)} / ${r.p.cached != null ? formatMoney(r.p.cached, currency, 4) : "—"} / ${formatMoney(r.p.output, currency, 4)}` : "No eligible route"}
                      </b>
                    </div>
                    <p>
                      {availabilityLabel(availabilityStage)} in {regionLabel(region)}; {complianceLabel(compliance).toLowerCase()}. Ranked by model quality, route cost, cache pricing, and latency.
                    </p>
                    <button onClick={() => setTab("prices")}>
                      Compare all available routes →
                    </button>
                  </article>
                );
              })}
            </div>
            <div className="method">
              <b>Dynamic weights</b>
              {priority === "price"
                ? "Cost 65% · capability 20% · latency 15%"
                : priority === "ability"
                  ? "Capability 70% · cost 15% · latency 15%"
                  : "Capability 45% · cost 35% · latency 20%"}
            </div>
          </>
        )}
        {tab === "calculator" && (
          <CostCalculator
            models={liveModels}
            region={region}
            setRegion={setRegion}
            availabilityStage={availabilityStage}
            setAvailabilityStage={setAvailabilityStage}
            compliance={compliance}
            setCompliance={setCompliance}
            currency={currency}
            setCurrency={setCurrency}
          />
        )}
        {tab === "history" && (
          <HistoryView
            snapshots={history}
            runs={runs}
            busy={historyBusy}
            error={historyError}
          />
        )}
        {tab === "health" && (
          <HealthView
            checks={checks}
            runs={runs}
            quarantined={quarantined}
            busy={historyBusy}
            error={historyError}
          />
        )}
        {tab === "prices" && (sources.length > 0 || fetchError) && (
          <SourceResults
            sources={sources}
            updates={updates}
            error={fetchError}
          />
        )}
      </section>
      <footer className="wrap">
        <span>ModelScope · AI API market intelligence</span>
        <span>
          Public prices may include promotions, tiers, and regional conditions.
          Provider billing pages remain authoritative.
        </span>
      </footer>
      {toast && (
        <div className="toast">
          <i>✓</i>
          <span>
            <b>Public pricing refresh complete</b>
            <small>Routes, regions, and market changes are up to date</small>
          </span>
        </div>
      )}
    </main>
  );
}
function Filter({
  label,
  value,
  set,
  options,
}: {
  label: string;
  value: string;
  set: (v: string) => void;
  options: string[];
}) {
  return (
    <span>
      {label}{" "}
      <select value={value} onChange={(e) => set(e.target.value)}>
        {options.map((o) => {
          const [v, l] = o.includes("|") ? o.split("|") : [o, o];
          return (
            <option value={v} key={v}>
              {l}
            </option>
          );
        })}
      </select>
    </span>
  );
}
function Header({ tab, setTab }: { tab: string; setTab: (v: string) => void }) {
  return (
    <header>
      <a className="brand" href="#">
        <i>M</i>ModelScope
      </a>
      <nav>
        {[
          ["prices", "Price explorer"],
          ["calculator", "Calculator"],
          ["history", "History"],
          ["health", "Data health"],
          ["brief", "Market brief"],
          ["recommend", "API finder"],
        ].map((x) => (
          <button
            key={x[0]}
            className={tab === x[0] ? "on" : ""}
            onClick={() => setTab(x[0])}
          >
            {x[1]}
          </button>
        ))}
      </nav>
      <div className="health">
        <i /> Public sources online{" "}
        <button
          aria-label="Open data health"
          title="Data health"
          onClick={() => setTab("health")}
        >
          ●
        </button>
      </div>
    </header>
  );
}
function Hero({ models }: { models: M[] }) {
  const providers = new Set(
      models.flatMap((m) => m.providers.map((p) => p.name)),
    ).size,
    routes = models.reduce((n, m) => n + m.providers.length, 0);
  return (
    <section className="hero wrap">
      <div>
        <b>AI API MARKET INTELLIGENCE</b>
        <h1>
          Compare AI APIs.
          <br />
          <em>Spend smarter.</em>
        </h1>
        <p>
          Official pricing, cache economics, regional availability, and
          practical recommendations.
          <br />
          Shortlist the right route without opening an account with every
          provider.
        </p>
      </div>
      <div className="heroCard">
        <div className="chartTitle">
          <span>Public price coverage</span>
          <small>Provider pages & catalogs</small>
        </div>
        <div className="bars">
          {[55, 68, 46, 82, 64, 91, 74, 58, 70, 49, 62, 44].map((h, i) => (
            <i key={i} style={{ height: h + "%" }} />
          ))}
        </div>
        <div className="stats">
          <div>
            <strong>{providers}</strong>
            <small>Providers & routers</small>
          </div>
          <div>
            <strong>{routes}</strong>
            <small>Models & routes</small>
          </div>
          <div>
            <strong>{regionOptions.length}</strong>
            <small>Regional views</small>
          </div>
        </div>
      </div>
    </section>
  );
}
function Title({
  label,
  title,
  sub,
}: {
  label: string;
  title: string;
  sub: string;
}) {
  return (
    <div className="title">
      <b>{label}</b>
      <h2>{title}</h2>
      <p>{sub}</p>
    </div>
  );
}
function HealthView({
  checks,
  runs,
  quarantined,
  busy,
  error,
}: {
  checks: SourceCheck[];
  runs: CollectionRun[];
  quarantined: HistorySnapshot[];
  busy: boolean;
  error: string;
}) {
  const ids = [...new Set(checks.map((c) => c.sourceId))];
  const cards = ids.map((id) => {
    const all = checks.filter((c) => c.sourceId === id),
      latest = all[0],
      lastOk = all.find((c) => c.status === "ok"),
      failures = all.findIndex((c) => c.status === "ok");
    return { latest, lastOk, failures: failures < 0 ? all.length : failures };
  });
  const healthy = cards.filter((c) => c.latest.status === "ok").length,
    lastRun = runs[0];
  return (
    <div className="healthView">
      <Title
        label="COLLECTION HEALTH"
        title="Know how fresh each source really is"
        sub="Every manual refresh records source availability, parser health, and successful price extraction."
      />
      {busy && <div className="historyState">Loading collection health…</div>}
      {error && <div className="historyState error">{error}</div>}
      {!busy && !error && (
        <>
          <div className="healthSummary">
            <div>
              <small>SOURCES HEALTHY</small>
              <strong>
                {healthy}/{cards.length || 12}
              </strong>
              <span>on the latest recorded run</span>
            </div>
            <div>
              <small>LAST COLLECTION</small>
              <strong>
                {lastRun ? ageLabel(lastRun.collectedAt) : "No run"}
              </strong>
              <span>
                {lastRun
                  ? `${lastRun.updateCount} accepted · ${lastRun.rejectedCount} quarantined`
                  : "Run a manual refresh"}
              </span>
            </div>
            <p>
              <b>Fresh</b> means the source parsed successfully during its most
              recent recorded check. A reachable page can still fail if its
              pricing structure changes.
            </p>
          </div>
          <div className="healthGrid">
            {cards.map((c) => (
              <a
                href={c.latest.url}
                target="_blank"
                rel="noreferrer"
                className={c.latest.status}
                key={c.latest.sourceId}
              >
                <div>
                  <i />
                  <b>{providerLabel(c.latest.sourceName)}</b>
                  <em>{healthLabel(c.latest.status)}</em>
                </div>
                <dl>
                  <dt>Last checked</dt>
                  <dd>{ageLabel(c.latest.checkedAt)}</dd>
                  <dt>Last successful</dt>
                  <dd>
                    {c.lastOk
                      ? ageLabel(c.lastOk.checkedAt)
                      : "No successful check"}
                  </dd>
                  <dt>Consecutive issues</dt>
                  <dd>{c.failures}</dd>
                  <dt>Prices extracted</dt>
                  <dd>{c.latest.records}</dd>
                </dl>
                <small>Open official source ↗</small>
              </a>
            ))}
          </div>
          <section className="quarantinePanel">
            <div>
              <b>ANOMALY REVIEW</b>
              <h3>Quarantined price changes</h3>
              <p>
                Changes above 50% are stored for review but never applied to
                comparisons or recommendations.
              </p>
            </div>
            {quarantined.length ? (
              <div className="quarantineTable">
                {quarantined.slice(0, 8).map((item) => (
                  <article key={item.id}>
                    <span>
                      <strong>{item.model}</strong>
                      <small>{providerLabel(item.provider)}</small>
                    </span>
                    <code>{money(item.input, 3)} → {money(item.output, 3)}</code>
                    <em>{item.changePercent?.toFixed(1) ?? "—"}% change</em>
                    <time>{ageLabel(item.collectedAt)}</time>
                  </article>
                ))}
              </div>
            ) : (
              <div className="quarantineEmpty">No quarantined changes.</div>
            )}
          </section>
          {!checks.length && (
            <div className="historyState">
              No source-health records yet. Run a manual price refresh, then
              return here.
            </div>
          )}
        </>
      )}
    </div>
  );
}
function healthLabel(status: SourceCheck["status"]) {
  return {
    ok: "Healthy",
    changed: "Parser review",
    blocked: "Restricted",
    error: "Failed",
  }[status];
}
function ageLabel(iso: string) {
  const ms = Date.now() - new Date(iso).getTime(),
    minutes = Math.max(0, Math.floor(ms / 60000));
  return minutes < 1
    ? "just now"
    : minutes < 60
      ? `${minutes}m ago`
      : minutes < 1440
        ? `${Math.floor(minutes / 60)}h ago`
        : `${Math.floor(minutes / 1440)}d ago`;
}
function freshness(iso: string) {
  const hours = Math.max(0, Date.now() - new Date(iso).getTime()) / 3_600_000;
  return hours <= 24 ? "Fresh" : hours <= 168 ? "Aging" : "Stale";
}
function verificationLabel(status: VerificationStatus) {
  return {
    verified: "VERIFIED NOW",
    previously_verified: "PREVIOUSLY VERIFIED",
    reference: "REFERENCE",
    quarantined: "QUARANTINED",
  }[status];
}
function CostCalculator({
  models,
  region,
  setRegion,
  availabilityStage,
  setAvailabilityStage,
  compliance,
  setCompliance,
  currency,
  setCurrency,
}: {
  models: M[];
  region: Region;
  setRegion: (r: Region) => void;
  availabilityStage: AvailabilityStage;
  setAvailabilityStage: (stage: AvailabilityStage) => void;
  compliance: ComplianceFilter;
  setCompliance: (filter: ComplianceFilter) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}) {
  const [inputTokens, setInputTokens] = useState(100_000_000),
    [outputTokens, setOutputTokens] = useState(20_000_000),
    [hitRate, setHitRate] = useState(40),
    [writeRate, setWriteRate] = useState(5),
    [pricingMode, setPricingMode] = useState("standard"),
    [taxRate, setTaxRate] = useState(0),
    [freeCredits, setFreeCredits] = useState(0),
    [extraMonthlyFee, setExtraMonthlyFee] = useState(0);
  const available = (p: P) =>
    routeAvailable(p, region, availabilityStage) &&
    routeMatchesCompliance(p, compliance);
  const inputM = Math.max(0, inputTokens) / 1e6,
    outputM = Math.max(0, outputTokens) / 1e6,
    hit = Math.min(100, Math.max(0, hitRate)) / 100,
    write = Math.min(100, Math.max(0, writeRate)) / 100,
    modeMultiplier =
      pricingMode === "batch"
        ? 0.5
        : pricingMode === "priority"
          ? 1.5
          : pricingMode === "flex"
            ? 0.5
            : 1;
  const ranked = models
    .flatMap((m) =>
      m.providers.filter(available).map((p) => {
        const standard = inputM * (1 - hit) * p.input * modeMultiplier,
          cached = inputM * hit * (p.cached ?? p.input) * modeMultiplier,
          cacheWrite = inputM * write * (p.write ?? 0) * modeMultiplier,
          output = outputM * p.output * modeMultiplier,
          planFee = Number(p.plan?.match(/\$([0-9.]+)/)?.[1] ?? 0),
          subtotal = standard + cached + cacheWrite + output + planFee + Math.max(0, extraMonthlyFee),
          afterCredits = Math.max(0, subtotal - Math.max(0, freeCredits)),
          tax = afterCredits * (Math.max(0, taxRate) / 100),
          total = afterCredits + tax;
        return {
          m,
          p,
          standard,
          cached,
          cacheWrite,
          output,
          planFee,
          subtotal,
          tax,
          total,
        };
      }),
    )
    .sort((a, b) => a.total - b.total);
  const best = ranked[0]?.total || 0;
  const sensitivity = [0, 25, 50, 75, 90].map((rate) => {
    const route = ranked[0];
    if (!route) return { rate, total: 0 };
    const ratio = rate / 100;
    const tokenCost =
      inputM * (1 - ratio) * route.p.input * modeMultiplier +
      inputM * ratio * (route.p.cached ?? route.p.input) * modeMultiplier +
      inputM * write * (route.p.write ?? 0) * modeMultiplier +
      outputM * route.p.output * modeMultiplier;
    const subtotal = tokenCost + route.planFee + Math.max(0, extraMonthlyFee);
    const afterCredits = Math.max(0, subtotal - Math.max(0, freeCredits));
    return { rate, total: afterCredits * (1 + Math.max(0, taxRate) / 100) };
  });
  function exportEstimate() {
    const header = "model,provider,region,availability,compliance,currency,standard_input,cache_read,cache_write,output,fixed_fees,tax,monthly_total,annual_total";
    const rows = ranked.map((r) =>
      [r.m.name, providerLabel(r.p.name), regionLabel(region), availabilityLabel(availabilityStage), complianceLabel(compliance), currency, r.standard * currencyRates[currency], r.cached * currencyRates[currency], r.cacheWrite * currencyRates[currency], r.output * currencyRates[currency], (r.planFee + Math.max(0, extraMonthlyFee)) * currencyRates[currency], r.tax * currencyRates[currency], r.total * currencyRates[currency], r.total * 12 * currencyRates[currency]]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(","),
    );
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([[header, ...rows].join("\n")], { type: "text/csv" }));
    link.download = "modelscope-cost-estimate.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }
  return (
    <div className="calculator">
      <Title
        label="USAGE COST CALCULATOR"
        title="Estimate your monthly AI API bill"
        sub="Model standard input, cache reads, cache writes, and output separately using public per-token prices."
      />
      <div className="calcInputs">
        <label>
          Monthly input tokens
          <input
            type="number"
            min="0"
            step="1000000"
            value={inputTokens}
            onChange={(e) => setInputTokens(+e.target.value)}
          />
        </label>
        <label>
          Monthly output tokens
          <input
            type="number"
            min="0"
            step="1000000"
            value={outputTokens}
            onChange={(e) => setOutputTokens(+e.target.value)}
          />
        </label>
        <label>
          Expected cache hit
          <input
            type="range"
            min="0"
            max="100"
            value={hitRate}
            onChange={(e) => setHitRate(+e.target.value)}
          />
          <b>{hitRate}%</b>
        </label>
        <label>
          Cache write volume
          <input
            type="range"
            min="0"
            max="100"
            value={writeRate}
            onChange={(e) => setWriteRate(+e.target.value)}
          />
          <b>{writeRate}%</b>
        </label>
        <Filter
          label="Region"
          value={region}
          set={(v) => setRegion(v as Region)}
          options={regionOptions.map((r) => `${r}|${regionLabel(r)}`)}
        />
        <Filter
          label="Availability"
          value={availabilityStage}
          set={(v) => setAvailabilityStage(v as AvailabilityStage)}
          options={[
            "register|Can register",
            "purchase|Can purchase",
            "deploy|Can deploy in-region",
            "residency|Data resides in-region",
          ]}
        />
      </div>
      <div className="calcInputs advanced">
        <label>
          Pricing mode
          <select value={pricingMode} onChange={(e) => setPricingMode(e.target.value)}>
            <option value="standard">Standard · published price</option>
            <option value="batch">Batch · assume 50% discount</option>
            <option value="flex">Flex · assume 50% discount</option>
            <option value="priority">Priority · assume 50% premium</option>
          </select>
        </label>
        <label>
          Free monthly credits (USD)
          <input type="number" min="0" step="1" value={freeCredits} onChange={(e) => setFreeCredits(+e.target.value)} />
        </label>
        <label>
          Additional fixed fees (USD)
          <input type="number" min="0" step="1" value={extraMonthlyFee} onChange={(e) => setExtraMonthlyFee(+e.target.value)} />
        </label>
        <label>
          Estimated tax
          <input type="number" min="0" max="100" step="0.1" value={taxRate} onChange={(e) => setTaxRate(+e.target.value)} />
          <b>{taxRate}%</b>
        </label>
        <Filter
          label="Compliance"
          value={compliance}
          set={(v) => setCompliance(v as ComplianceFilter)}
          options={[
            "all|All routes",
            "gdpr|GDPR support",
            "zdr|ZDR option",
            "sla|Published SLA",
            "no_training|No API training",
            "regional_processing|Regional processing",
          ]}
        />
        <Filter
          label="Currency"
          value={currency}
          set={(v) => setCurrency(v as Currency)}
          options={["USD", "EUR", "GBP", "CNY", "JPY", "AUD"]}
        />
        <button className="exportCost" onClick={exportEstimate}>Export CSV</button>
      </div>
      <div className="calcSummary">
        <div>
          <small>WORKLOAD</small>
          <strong>{formatTokens(inputTokens + outputTokens)}</strong>
          <span>tokens / month</span>
        </div>
        <div>
          <small>LOWEST ESTIMATE</small>
          <strong>{formatMoney(best, currency, 2)}</strong>
          <span>
            {ranked[0]
              ? `${ranked[0].m.name} · ${providerLabel(ranked[0].p.name)} · ${formatMoney(best * 12, currency, 2)}/year`
              : "No route"}
          </span>
        </div>
        <p>
          Includes published token rates, cache economics, detected subscription
          fees, credits, optional fixed fees, and estimated tax. Data transfer,
          minimum commitments, storage, and provider rounding remain excluded.
        </p>
      </div>
      <div className="costSensitivity">
        <div>
          <b>CACHE SENSITIVITY</b>
          <h3>How cache hits change the best route</h3>
          <p>Monthly total for {ranked[0]?.m.name ?? "the selected route"}, with every other assumption held constant.</p>
        </div>
        {sensitivity.map((point) => (
          <span key={point.rate}>
            <small>{point.rate}% hit</small>
            <strong>{formatMoney(point.total, currency, 2)}</strong>
            <i style={{ height: `${Math.max(8, best ? (point.total / Math.max(...sensitivity.map((x) => x.total), 1)) * 58 : 8)}px` }} />
          </span>
        ))}
      </div>
      <div className="calcTable">
        <div className="calcHead">
          <span>Model / provider</span>
          <span>Standard input</span>
          <span>Cache read</span>
          <span>Cache write</span>
          <span>Output</span>
          <span>Est. monthly</span>
        </div>
        {ranked.slice(0, 15).map((r, i) => (
          <div className="calcRow" key={`${r.m.name}-${r.p.name}`}>
            <span>
              <b>{r.m.name}</b>
              <small>
                {providerLabel(r.p.name)} · {regionLabel(region)}
                {r.planFee > 0 && ` · ${formatMoney(r.planFee, currency, 2)}/mo plan`}
              </small>
            </span>
            <code>{formatMoney(r.standard, currency, 2)}</code>
            <code>{formatMoney(r.cached, currency, 2)}</code>
            <code>{formatMoney(r.cacheWrite, currency, 2)}</code>
            <code>{formatMoney(r.output, currency, 2)}</code>
            <strong>
              {formatMoney(r.total, currency, 2)}
              {i === 0 && <em>BEST</em>}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}
function formatTokens(value: number) {
  return value >= 1e9
    ? `${(value / 1e9).toFixed(1)}B`
    : value >= 1e6
      ? `${(value / 1e6).toFixed(1)}M`
      : Math.round(value).toLocaleString("en-US");
}
function HistoryView({
  snapshots,
  runs,
  busy,
  error,
}: {
  snapshots: HistorySnapshot[];
  runs: CollectionRun[];
  busy: boolean;
  error: string;
}) {
  const models = [...new Set(snapshots.map((s) => s.model))];
  const [model, setModel] = useState("all"),
    [field, setField] = useState<"input" | "cached" | "output">("input");
  const visible = snapshots.filter((s) => model === "all" || s.model === model);
  const routes = [
    ...new Set(visible.map((s) => `${s.model}|||${s.provider}`)),
  ].slice(0, 8);
  return (
    <div className="historyView">
      <Title
        label="PRICE HISTORY"
        title="Track pricing over time"
        sub="Accepted snapshots only. Large anomalies are quarantined before they appear here."
      />
      {busy && <div className="historyState">Loading saved snapshots…</div>}
      {error && <div className="historyState error">{error}</div>}
      {!busy && !error && (
        <>
          <div className="historyFilters">
            <Filter
              label="Model"
              value={model}
              set={setModel}
              options={["all|All models", ...models]}
            />
            <Filter
              label="Metric"
              value={field}
              set={(v) => setField(v as "input" | "cached" | "output")}
              options={[
                "input|Standard input",
                "cached|Cache read",
                "output|Output",
              ]}
            />
            <span>
              {snapshots.length} accepted snapshots · {runs.length} recent
              collection runs
            </span>
          </div>
          <div className="trendGrid">
            {routes.map((key) => {
              const [m, p] = key.split("|||");
              const points = visible
                .filter(
                  (s) => s.model === m && s.provider === p && s[field] != null,
                )
                .slice(0, 12)
                .reverse();
              const values = points.map((x) => Number(x[field]));
              const max = Math.max(...values, 1e-9),
                latest = values.at(-1);
              return (
                <article key={key}>
                  <div>
                    <b>{m}</b>
                    <span>{providerLabel(p)}</span>
                  </div>
                  <strong>
                    {latest == null
                      ? "—"
                      : `$${latest.toFixed(field === "cached" ? 4 : 3)}`}
                  </strong>
                  <div
                    className="miniBars"
                    aria-label={`${fieldName(field)} trend`}
                  >
                    {values.map((v, i) => (
                      <i
                        key={i}
                        style={{ height: `${Math.max(8, (v / max) * 100)}%` }}
                        title={`${new Date(points[i].collectedAt).toLocaleString("en-US")}: $${v}`}
                      />
                    ))}
                  </div>
                  <small>{points.length} observations · USD / 1M tokens</small>
                </article>
              );
            })}
          </div>
          <div className="historyTable">
            <div className="historyHead">
              <span>Collected</span>
              <span>Model / provider</span>
              <span>Input</span>
              <span>Cache read</span>
              <span>Output</span>
              <span>Max change</span>
            </div>
            {visible.slice(0, 30).map((s) => (
              <div className="historyRow" key={s.id}>
                <time>
                  {new Date(s.collectedAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </time>
                <span>
                  <b>{s.model}</b>
                  <small>{providerLabel(s.provider)}</small>
                </span>
                <code>{money(s.input, 3)}</code>
                <code>{money(s.cached, 4)}</code>
                <code>{money(s.output, 3)}</code>
                <em className={(s.changePercent || 0) > 0 ? "moved" : "flat"}>
                  {s.changePercent
                    ? `${s.changePercent.toFixed(1)}%`
                    : "No change"}
                </em>
              </div>
            ))}
          </div>
          {!snapshots.length && (
            <div className="historyState">
              No snapshots yet. Run a manual price refresh to start history.
            </div>
          )}
        </>
      )}
    </div>
  );
}
function money(value: number | null, digits: number) {
  return value == null ? "—" : `$${value.toFixed(digits)}`;
}
function SourceResults({
  sources,
  updates,
  error,
}: {
  sources: FetchSource[];
  updates: PriceUpdate[];
  error: string;
}) {
  const evidence = updates.filter(
    (u) => u.tier || u.currency || u.pricingRegion,
  );
  const verified = updates.filter(
    (u) => u.verificationStatus === "verified",
  ).length;
  const retained = updates.filter(
    (u) => u.verificationStatus === "previously_verified",
  ).length;
  return (
    <div className="sourceResults">
      {error ? (
        <div className="fetchFailure">Refresh failed: {error}</div>
      ) : (
        <>
          <div className="sourceSummary">
            <b>
              {sources.filter((s) => s.status === "ok").length}/{sources.length}
            </b>{" "}
            sources healthy
            <span>
              · {verified} verified now · {retained} retained from history
            </span>
          </div>
          <div className="sourceChips">
            {sources.map((s) => (
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                title={s.detail}
                className={s.status}
                key={s.id}
              >
                <i />
                {providerLabel(s.name)}
                <small>
                  {s.status === "ok"
                    ? s.records
                      ? `${s.records} updates`
                      : "Verified"
                    : s.status === "blocked"
                      ? "Restricted"
                      : s.status === "changed"
                        ? "Parser review"
                        : "Failed"}
                </small>
              </a>
            ))}
          </div>
          {evidence.length > 0 && (
            <div className="evidence">
              <h4>PRICE BASIS FOR THIS REFRESH</h4>
              {evidence.map((u) => (
                <article key={`${u.model}-${u.provider}`}>
                  <div>
                    <b>{u.model}</b>
                    <span>{providerLabel(u.provider)}</span>
                  </div>
                  <p>
                    {u.pricingRegion && <em>{regionText(u.pricingRegion)}</em>}
                    {u.tier && <em>{tierText(u.tier)}</em>}
                    {u.discountPercent != null && u.discountPercent > 0 && (
                      <em>{u.discountPercent}% discount</em>
                    )}
                  </p>
                  {u.currency && u.currency !== "USD" && (
                    <small>
                      Native price: input {u.nativeInput} / output{" "}
                      {u.nativeOutput} {u.currency} · USD conversion rate{" "}
                      {u.fxRate?.toFixed(4)}
                      {u.fxAsOf && ` (${u.fxAsOf})`}
                    </small>
                  )}
                  {u.currency === "USD" && u.listInput != null && (
                    <small>
                      Current input / output: ${u.input} / ${u.output}; peak
                      benchmark: ${u.listInput} / ${u.listOutput}
                    </small>
                  )}
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
function fieldName(field: string) {
  return (
    (
      {
        input: "input price",
        cached: "cache-read price",
        write: "cache-write price",
        output: "output price",
      } as Record<string, string>
    )[field] || field
  );
}
function providerLabel(name: string) {
  return (
    (
      {
        "Anthropic 官方": "Anthropic Direct",
        "OpenAI 官方": "OpenAI Direct",
        "DeepSeek 官方": "DeepSeek Direct",
        阿里云百炼: "Alibaba Cloud Model Studio",
        "Alibaba Cloud · International": "Alibaba Cloud · International",
        "Alibaba Cloud · US": "Alibaba Cloud · US",
      } as Record<string, string>
    )[name] || name
  );
}
function regionLabel(region: string) {
  return (
    (
      {
        全球: "Global",
        美国: "United States",
        加拿大: "Canada",
        欧盟: "European Union",
        英国: "United Kingdom",
        中国大陆: "Mainland China",
        香港: "Hong Kong",
        新加坡: "Singapore",
        日本: "Japan",
        澳大利亚: "Australia",
        北美: "North America",
        欧洲: "Europe",
        亚太: "Asia Pacific",
      } as Record<string, string>
    )[region] || region
  );
}
function tagLabel(tag: string) {
  return (
    (
      {
        "企业 SLA": "Enterprise SLA",
        峰谷计价: "Time-of-day pricing",
        待官网刷新: "Awaiting official refresh",
        订阅额度: "Subscription allowance",
        地区阶梯价: "Regional tiers",
        中国区价格: "China pricing",
        国际区价格: "International pricing",
        美国区价格: "US pricing",
        "省 2%": "Save 2%",
      } as Record<string, string>
    )[tag] || tag
  );
}
function availabilityLabel(stage: AvailabilityStage) {
  return {
    register: "Registration available",
    purchase: "Purchase available",
    deploy: "In-region deployment",
    residency: "In-region data residency",
  }[stage];
}
function complianceLabel(filter: ComplianceFilter) {
  return {
    all: "All compliance profiles",
    gdpr: "GDPR support",
    zdr: "Zero Data Retention option",
    sla: "Published SLA",
    no_training: "No API training",
    regional_processing: "Regional processing",
  }[filter];
}
function regionText(text: string) {
  return text.replace("中国大陆 · 华北2（北京）", "Mainland China · Beijing");
}
function tierText(text: string) {
  return text.replace("峰值时段外", "outside peak hours");
}
