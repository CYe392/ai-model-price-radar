/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps, no-irregular-whitespace, jsx-a11y/anchor-is-valid */
"use client";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
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
type Scenario = {
  id: string;
  icon: string;
  title: string;
  desc: string;
  monthlyInput: number;
  monthlyOutput: number;
  cacheHit: number;
  minAbility: number;
  minContext: number;
  emphasis: "chat" | "coding" | "reasoning" | "agentic" | "throughput" | "retrieval";
  weights: { capability: number; cost: number; latency: number; cache: number; trust: number };
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
type AlertRule = {
  id: string;
  model: string;
  provider: string;
  direction: "up" | "down" | "either";
  threshold: number;
  enabled: boolean;
  createdAt: string;
};
type AlertEvent = {
  id: string;
  ruleId: string;
  change: PriceChange;
  triggeredAt: string;
};
type TeamMember = { id: string; name: string; role: "Owner" | "Editor" | "Viewer" };
type DecisionRecord = {
  id: string;
  savedAt: string;
  scenario: string;
  model: string;
  provider: string;
  region: string;
  compliance: string;
  score: number;
  monthlyUsd: number;
  confidence: string;
};
type AuditEntry = { id: string; at: string; action: string };
type UiLanguage = "en" | "zh";
type UiTheme = "system" | "light" | "dark";
type UiDensity = "comfortable" | "compact";
type UiPreferences = {
  language: UiLanguage;
  theme: UiTheme;
  density: UiDensity;
  reducedMotion: boolean;
  highContrast: boolean;
};
type WorkspaceState = {
  name: string;
  organization: string;
  monthlyBudget: number;
  enforceBudget: boolean;
  preset: string;
  members: TeamMember[];
  decisions: DecisionRecord[];
  audit: AuditEntry[];
};
const DEFAULT_WORKSPACE: WorkspaceState = {
  name: "My AI API workspace",
  organization: "Private local workspace",
  monthlyBudget: 1000,
  enforceBudget: false,
  preset: "balanced",
  members: [{ id: "local-owner", name: "Workspace owner", role: "Owner" }],
  decisions: [],
  audit: [],
};
const DEFAULT_PREFERENCES: UiPreferences = {
  language: "en",
  theme: "system",
  density: "comfortable",
  reducedMotion: false,
  highContrast: false,
};
const UI_COPY = {
  en: {
    skip: "Skip to main content",
    nav: ["Price explorer", "Calculator", "History", "Data health", "Market brief", "Alerts", "Workspace", "Preferences", "API finder"],
    developers: "Developers ↗",
    online: "Public sources online",
    openHealth: "Open data health",
    heroLabel: "AI API MARKET INTELLIGENCE",
    heroLine1: "Compare AI APIs.",
    heroLine2: "Spend smarter.",
    heroBody1: "Official pricing, cache economics, regional availability, and practical recommendations.",
    heroBody2: "Shortlist the right route without opening an account with every provider.",
    coverage: "Public price coverage",
    coverageSub: "Provider pages & catalogs",
    providers: "Providers & routers",
    routes: "Models & routes",
    regions: "Regional views",
    tabs: ["Live pricing", "Cost calculator", "Price history", "Data health", "Market brief", "Price alerts", "Workspace", "Preferences", "Recommendations"],
    updatePrefix: "Public provider pricing · Updated:",
    checking: "Checking official sources",
    refresh: "Refresh prices",
    noAccounts: "No provider accounts required",
    sourceNote: "Every route shows whether its price was verified now, retained from a previous verification, or included as reference data. Official billing pages remain authoritative.",
    search: "Search models or providers...",
    region: "Region",
    availability: "Availability",
    compliance: "Compliance",
    sort: "Sort by",
    currency: "Currency",
    planningFx: "per 1M tokens · planning FX",
    footerTitle: "ModelScope · AI API market intelligence",
    footerNote: "Public prices may include promotions, tiers, and regional conditions. Provider billing pages remain authoritative.",
    toastTitle: "Public pricing refresh complete",
    toastBody: "Routes, regions, and market changes are up to date",
  },
  zh: {
    skip: "跳到主要内容",
    nav: ["价格查询", "成本计算", "价格历史", "数据健康", "最新动态", "价格提醒", "工作区", "界面偏好", "API 推荐"],
    developers: "开发者 ↗",
    online: "公开价格来源在线",
    openHealth: "打开数据健康页",
    heroLabel: "AI API 市场情报",
    heroLine1: "比较 AI API，",
    heroLine2: "更聪明地花钱。",
    heroBody1: "聚合官方价格、缓存经济性、地区可用性和实用推荐。",
    heroBody2: "无需注册每一家服务商，也能快速筛选合适路线。",
    coverage: "公开价格覆盖",
    coverageSub: "服务商价格页与公开目录",
    providers: "服务商与路由商",
    routes: "模型与路线",
    regions: "地区视图",
    tabs: ["实时价格", "成本计算", "价格历史", "数据健康", "最新动态", "价格提醒", "工作区", "界面偏好", "场景推荐"],
    updatePrefix: "公开服务商价格 · 更新时间：",
    checking: "正在检查官网",
    refresh: "手动刷新价格",
    noAccounts: "无需服务商账户",
    sourceNote: "每条路线都会标明价格是刚刚核验、来自此前核验，还是仅供参考。最终计费以服务商官网为准。",
    search: "搜索模型或服务商……",
    region: "用户地区",
    availability: "可用阶段",
    compliance: "合规要求",
    sort: "排序方式",
    currency: "显示货币",
    planningFx: "每百万 token · 规划汇率",
    footerTitle: "ModelScope · AI API 市场情报",
    footerNote: "公开价格可能包含促销、阶梯和地区条件；最终计费以服务商官网为准。",
    toastTitle: "公开价格刷新完成",
    toastBody: "路线、地区和市场变化已更新",
  },
} as const;
type UiCopy = (typeof UI_COPY)[UiLanguage];
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
    category: "routing",
    severity: "medium",
    region: "US / EU / Singapore",
    time: "Today · 11:40",
    title: "OpenCode Go subscription pricing added",
    text: "OpenCode Go combines a $10/month base subscription with dollar-denominated five-hour, weekly, and monthly usage allowances.",
    impact:
      "It can suit sustained open-model coding workloads. Low-volume users should still compare pay-as-you-go routes. Coverage focuses on the US, EU, and Singapore.",
    scenarios: ["Light development", "OpenClaw"],
    sourceUrl: "https://opencode.ai/",
  },
  {
    tag: "PRICING",
    category: "pricing",
    severity: "high",
    region: "Global",
    time: "Today · 10:24",
    title: "Cache pricing is now included in route cost",
    text: "Cached input can cost 5–100× less than standard input, while some providers charge separately for cache writes.",
    impact:
      "Long system prompts, stable RAG prefixes, and repository context benefit most. Compare input, output, expected hit rate, and write frequency together.",
    scenarios: ["Long-context RAG", "Intensive development"],
    sourceUrl: "https://platform.openai.com/docs/pricing",
  },
  {
    tag: "REGION",
    category: "availability",
    severity: "high",
    region: "China / International / US",
    time: "Today · 09:10",
    title: "Qwen pricing differs across global, China, and US routes",
    text: "Alibaba Cloud prices models by deployment region and context tier, with limited-time discounts on selected SKUs.",
    impact:
      "US deployments may use different model IDs and prices from China or international routes. This tool filters unavailable routes, but provider terms remain authoritative.",
    scenarios: ["Everyday chat", "Development", "OpenClaw"],
    sourceUrl: "https://www.alibabacloud.com/help/en/model-studio/model-pricing",
  },
];
const scenarios: Scenario[] = [
  {
    id: "daily-chat",
    icon: "◎",
    title: "Everyday chat & advice",
    desc: "General questions, drafting, planning, and personal productivity",
    monthlyInput: 20_000_000,
    monthlyOutput: 5_000_000,
    cacheHit: 20,
    minAbility: 80,
    minContext: 128_000,
    emphasis: "chat",
    weights: { capability: 30, cost: 35, latency: 20, cache: 5, trust: 10 },
  },
  {
    id: "light-development",
    icon: "⌘",
    title: "Light & medium development",
    desc: "Code completion, debugging, tests, reviews, and small features",
    monthlyInput: 80_000_000,
    monthlyOutput: 18_000_000,
    cacheHit: 45,
    minAbility: 88,
    minContext: 200_000,
    emphasis: "coding",
    weights: { capability: 42, cost: 25, latency: 13, cache: 10, trust: 10 },
  },
  {
    id: "intensive-development",
    icon: "◆",
    title: "Intensive development",
    desc: "Large repositories, migrations, architecture, and difficult debugging",
    monthlyInput: 350_000_000,
    monthlyOutput: 90_000_000,
    cacheHit: 60,
    minAbility: 93,
    minContext: 200_000,
    emphasis: "reasoning",
    weights: { capability: 55, cost: 15, latency: 8, cache: 10, trust: 12 },
  },
  {
    id: "openclaw-agents",
    icon: "◈",
    title: "OpenClaw & agent automation",
    desc: "Long-running tool use, browser work, orchestration, and recovery",
    monthlyInput: 500_000_000,
    monthlyOutput: 120_000_000,
    cacheHit: 65,
    minAbility: 92,
    minContext: 200_000,
    emphasis: "agentic",
    weights: { capability: 48, cost: 16, latency: 8, cache: 12, trust: 16 },
  },
  {
    id: "customer-support",
    icon: "⌁",
    title: "Customer support",
    desc: "High throughput, multilingual consistency, and predictable spend",
    monthlyInput: 1_000_000_000,
    monthlyOutput: 160_000_000,
    cacheHit: 55,
    minAbility: 84,
    minContext: 128_000,
    emphasis: "throughput",
    weights: { capability: 25, cost: 40, latency: 18, cache: 10, trust: 7 },
  },
  {
    id: "long-context-rag",
    icon: "▤",
    title: "Long-context RAG",
    desc: "Repository search, knowledge assistants, and repeated document context",
    monthlyInput: 800_000_000,
    monthlyOutput: 100_000_000,
    cacheHit: 75,
    minAbility: 88,
    minContext: 400_000,
    emphasis: "retrieval",
    weights: { capability: 30, cost: 22, latency: 8, cache: 28, trust: 12 },
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
function contextSize(context: string) {
  const value = Number.parseFloat(context);
  return context.toUpperCase().includes("M") ? value * 1_000_000 : value * 1_000;
}
function modelStrength(m: M, emphasis: Scenario["emphasis"]) {
  const name = `${m.name} ${m.company}`.toLowerCase();
  const boosts: Record<Scenario["emphasis"], number> = {
    chat: name.includes("gpt") || name.includes("claude") || name.includes("gemini") ? 5 : 1,
    coding: name.includes("claude") || name.includes("deepseek") || name.includes("gpt") ? 7 : 1,
    reasoning: name.includes("claude") || name.includes("deepseek") || name.includes("glm") ? 7 : 1,
    agentic: name.includes("claude") || name.includes("gpt") || name.includes("qwen") ? 7 : 1,
    throughput: name.includes("flash") || name.includes("mini") || name.includes("qwen") ? 6 : 1,
    retrieval: contextSize(m.context) >= 1_000_000 ? 8 : contextSize(m.context) >= 400_000 ? 4 : 0,
  };
  return Math.min(100, m.ability + boosts[emphasis]);
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
    [scenarioId, setScenarioId] = useState("daily-chat"),
    [workloadScale, setWorkloadScale] = useState("standard"),
    [riskProfile, setRiskProfile] = useState("balanced"),
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
  const [alerts, setAlerts] = useState<AlertRule[]>([]),
    [alertEvents, setAlertEvents] = useState<AlertEvent[]>([]),
    [alertsLoaded, setAlertsLoaded] = useState(false),
    [briefCategory, setBriefCategory] = useState("all"),
    [briefSeverity, setBriefSeverity] = useState("all");
  const [workspace, setWorkspace] = useState<WorkspaceState>(DEFAULT_WORKSPACE),
    [workspaceLoaded, setWorkspaceLoaded] = useState(false),
    [preferences, setPreferences] = useState<UiPreferences>(DEFAULT_PREFERENCES),
    [preferencesLoaded, setPreferencesLoaded] = useState(false);
  useEffect(() => {
    try {
      setAlerts(JSON.parse(localStorage.getItem("modelscope-alert-rules") || "[]"));
      setAlertEvents(JSON.parse(localStorage.getItem("modelscope-alert-events") || "[]"));
    } catch {
      setAlerts([]);
      setAlertEvents([]);
    } finally {
      setAlertsLoaded(true);
    }
  }, []);
  useEffect(() => {
    if (!alertsLoaded) return;
    localStorage.setItem("modelscope-alert-rules", JSON.stringify(alerts));
    localStorage.setItem("modelscope-alert-events", JSON.stringify(alertEvents));
  }, [alerts, alertEvents, alertsLoaded]);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("modelscope-team-workspace");
      if (saved) setWorkspace({ ...DEFAULT_WORKSPACE, ...JSON.parse(saved) });
    } catch {
      setWorkspace(DEFAULT_WORKSPACE);
    } finally {
      setWorkspaceLoaded(true);
    }
  }, []);
  useEffect(() => {
    if (workspaceLoaded)
      localStorage.setItem("modelscope-team-workspace", JSON.stringify(workspace));
  }, [workspace, workspaceLoaded]);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("modelscope-ui-preferences");
      if (saved) setPreferences({ ...DEFAULT_PREFERENCES, ...JSON.parse(saved) });
    } catch {
      setPreferences(DEFAULT_PREFERENCES);
    } finally {
      setPreferencesLoaded(true);
    }
  }, []);
  useEffect(() => {
    if (preferencesLoaded)
      localStorage.setItem("modelscope-ui-preferences", JSON.stringify(preferences));
    const root = document.documentElement;
    const colorQuery = globalThis.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const resolved = preferences.theme === "system"
        ? colorQuery.matches ? "dark" : "light"
        : preferences.theme;
      root.dataset.theme = resolved;
      root.style.colorScheme = resolved;
    };
    root.lang = preferences.language === "zh" ? "zh-CN" : "en";
    root.dataset.density = preferences.density;
    root.dataset.motion = preferences.reducedMotion ? "reduced" : "full";
    root.dataset.contrast = preferences.highContrast ? "high" : "standard";
    applyTheme();
    colorQuery.addEventListener("change", applyTheme);
    return () => colorQuery.removeEventListener("change", applyTheme);
  }, [preferences, preferencesLoaded]);
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
          category: "pricing",
          severity: Math.abs(c.percent) >= 25 ? "high" : Math.abs(c.percent) >= 10 ? "medium" : "low",
          region: "All documented routes",
          time: "Latest refresh",
          title: `${providerLabel(c.provider)} · ${c.model} ${fieldName(c.field)} ${c.direction === "up" ? "rose" : "fell"} ${Math.abs(c.percent)}%`,
          text: `Per-million-token price moved from $${c.before} to $${c.after}.`,
          impact:
            c.direction === "up"
              ? "This route is now more expensive and will rank lower for cost-focused recommendations. Review alternatives."
              : "This route is now cheaper and may rank higher in cost-focused recommendations.",
          scenarios: c.field === "cached"
            ? ["Long-context RAG", "OpenClaw"]
            : ["Everyday chat", "Development", "Customer support"],
          sourceUrl: "",
        }))
    : briefs;
  const filteredBriefs = liveBriefs.filter(
    (brief) =>
      (briefCategory === "all" || brief.category === briefCategory) &&
      (briefSeverity === "all" || brief.severity === briefSeverity),
  );
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
      const latestChanges = data.changes || [];
      setChanges(latestChanges);
      const triggered = latestChanges.flatMap((change) =>
        alerts
          .filter(
            (rule) =>
              rule.enabled &&
              (rule.model === "all" || rule.model === change.model) &&
              (rule.provider === "all" || rule.provider === change.provider) &&
              (rule.direction === "either" || rule.direction === change.direction) &&
              Math.abs(change.percent) >= rule.threshold,
          )
          .map((rule) => ({
            id: `${rule.id}-${data.collectedAt}-${change.field}`,
            ruleId: rule.id,
            change,
            triggeredAt: data.collectedAt,
          })),
      );
      if (triggered.length)
        setAlertEvents((current) => [...triggered, ...current].slice(0, 50));
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
  function addAlert(rule: Omit<AlertRule, "id" | "createdAt" | "enabled">) {
    setAlerts((current) => [
      ...current,
      {
        ...rule,
        id: globalThis.crypto?.randomUUID?.() ?? `alert-${Date.now()}`,
        createdAt: new Date().toISOString(),
        enabled: true,
      },
    ]);
  }
  function toggleAlert(id: string) {
    setAlerts((current) =>
      current.map((rule) =>
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule,
      ),
    );
  }
  function removeAlert(id: string) {
    setAlerts((current) => current.filter((rule) => rule.id !== id));
    setAlertEvents((current) => current.filter((event) => event.ruleId !== id));
  }
  const selectedScenario = scenarios.find((s) => s.id === scenarioId) ?? scenarios[0];
  const scaleMultiplier = { pilot: 0.25, standard: 1, production: 5 }[workloadScale] ?? 1;
  const scenarioInputM = (selectedScenario.monthlyInput * scaleMultiplier) / 1e6;
  const scenarioOutputM = (selectedScenario.monthlyOutput * scaleMultiplier) / 1e6;
  const scenarioHit = selectedScenario.cacheHit / 100;
  const rankedRecommendations = liveModels
    .flatMap((m) =>
      m.providers
        .filter(available)
        .filter(
          (p) =>
            m.ability >= selectedScenario.minAbility &&
            contextSize(m.context) >= selectedScenario.minContext &&
            (riskProfile !== "enterprise" || routePolicy(p).noTraining),
        )
        .map((p) => {
          const policy = routePolicy(p);
          const monthlyUsd =
            scenarioInputM * (1 - scenarioHit) * p.input +
            scenarioInputM * scenarioHit * (p.cached ?? p.input) +
            scenarioOutputM * p.output +
            Number(p.plan?.match(/\$([0-9.]+)/)?.[1] ?? 0);
          const capability = modelStrength(m, selectedScenario.emphasis);
          const workloadAnchor = Math.max(
            1,
            ((selectedScenario.monthlyInput + selectedScenario.monthlyOutput) / 1e6) *
              scaleMultiplier *
              0.5,
          );
          const cost = Math.max(0, Math.min(100, 100 / (1 + monthlyUsd / workloadAnchor)));
          const latency = Math.max(0, Math.min(100, 110 - p.latency / 8));
          const cache = p.cached == null
            ? 25
            : Math.max(0, Math.min(100, 100 - (p.cached / Math.max(p.input, 0.0001)) * 100));
          const trustBase =
            p.verificationStatus === "verified"
              ? 100
              : p.verificationStatus === "previously_verified"
                ? 82
                : p.sourceUrl
                  ? 72
                  : 55;
          const trust = Math.min(
            100,
            trustBase +
              (policy.source ? 6 : 0) +
              (policy.noTraining ? 5 : 0) +
              (policy.sla ? 5 : 0) +
              (riskProfile === "enterprise" && policy.regionalProcessing ? 5 : 0),
          );
          const weights = { ...selectedScenario.weights };
          if (priority === "price") {
            weights.cost += 24;
            weights.capability = Math.max(10, weights.capability - 14);
          } else if (priority === "ability") {
            weights.capability += 24;
            weights.cost = Math.max(8, weights.cost - 14);
          }
          if (riskProfile === "enterprise") weights.trust += 18;
          if (riskProfile === "experimental") weights.trust = Math.max(3, weights.trust - 6);
          const totalWeight = Object.values(weights).reduce((sum, value) => sum + value, 0);
          const score =
            (capability * weights.capability +
              cost * weights.cost +
              latency * weights.latency +
              cache * weights.cache +
              trust * weights.trust) /
            totalWeight;
          const confidence =
            trust >= 85 && Math.abs(m.ability - selectedScenario.minAbility) >= 5
              ? "High"
              : trust >= 65
                ? "Medium"
                : "Directional";
          return {
            m,
            p,
            policy,
            score,
            monthlyUsd,
            confidence,
            breakdown: { capability, cost, latency, cache, trust },
          };
        }),
    )
    .filter(
      (candidate) =>
        !workspace.enforceBudget || candidate.monthlyUsd <= workspace.monthlyBudget,
    )
    .sort((a, b) => b.score - a.score);
  const recommendationExclusions = Math.max(0, allRouteCount - rankedRecommendations.length);
  function applyGovernancePreset(preset: string) {
    const settings = {
      balanced: { region: "全球" as Region, compliance: "all" as ComplianceFilter, currency: "USD" as Currency, risk: "balanced", budget: 1000, enforce: false },
      "us-enterprise": { region: "美国" as Region, compliance: "no_training" as ComplianceFilter, currency: "USD" as Currency, risk: "enterprise", budget: 5000, enforce: true },
      "eu-regulated": { region: "欧盟" as Region, compliance: "gdpr" as ComplianceFilter, currency: "EUR" as Currency, risk: "enterprise", budget: 5000, enforce: true },
      "cost-sandbox": { region: "全球" as Region, compliance: "all" as ComplianceFilter, currency: "USD" as Currency, risk: "experimental", budget: 250, enforce: true },
      "china-mainland": { region: "中国大陆" as Region, compliance: "all" as ComplianceFilter, currency: "CNY" as Currency, risk: "balanced", budget: 3000, enforce: true },
    }[preset];
    if (!settings) return;
    setRegion(settings.region);
    setCompliance(settings.compliance);
    setCurrency(settings.currency);
    setRiskProfile(settings.risk);
    setWorkspace((current) => ({
      ...current,
      preset,
      monthlyBudget: settings.budget,
      enforceBudget: settings.enforce,
      audit: [{ id: `audit-${Date.now()}`, at: new Date().toISOString(), action: `Applied ${preset} governance preset` }, ...current.audit].slice(0, 100),
    }));
  }
  function saveTopRecommendation() {
    const candidate = rankedRecommendations[0];
    if (!candidate) return;
    const record: DecisionRecord = {
      id: globalThis.crypto.randomUUID(),
      savedAt: new Date().toISOString(),
      scenario: selectedScenario.title,
      model: candidate.m.name,
      provider: providerLabel(candidate.p.name),
      region: regionLabel(region),
      compliance: complianceLabel(compliance),
      score: candidate.score,
      monthlyUsd: candidate.monthlyUsd,
      confidence: candidate.confidence,
    };
    setWorkspace((current) => ({
      ...current,
      decisions: [record, ...current.decisions],
      audit: [{ id: `audit-${Date.now()}`, at: record.savedAt, action: `Saved ${record.model} via ${record.provider} for ${record.scenario}` }, ...current.audit].slice(0, 100),
    }));
    setTab("workspace");
  }
  const copy = UI_COPY[preferences.language];
  return (
    <main aria-busy={busy}>
      <a className="skipLink" href="#main-content">{copy.skip}</a>
      <Header tab={tab} setTab={setTab} copy={copy} />
      <Hero models={liveModels} copy={copy} />
      <section className="panel wrap" id="main-content" role="tabpanel" aria-labelledby={`tab-${tab}`} tabIndex={-1}>
        <div className="panelTop">
          <div className="tabs" role="tablist" aria-label={preferences.language === "zh" ? "主要工具" : "Primary tools"}>
            {[
              ["prices", "◫", copy.tabs[0]],
              ["calculator", "$", copy.tabs[1]],
              ["history", "↗", copy.tabs[2]],
              ["health", "●", copy.tabs[3]],
              ["brief", "≡", copy.tabs[4]],
              ["alerts", "!", copy.tabs[5]],
              ["workspace", "▦", copy.tabs[6]],
              ["preferences", "◐", copy.tabs[7]],
              ["recommend", "◇", copy.tabs[8]],
            ].map((x) => (
              <button
                key={x[0]}
                id={`tab-${x[0]}`}
                role="tab"
                aria-selected={tab === x[0]}
                aria-controls="main-content"
                className={tab === x[0] ? "on" : ""}
                onClick={() => setTab(x[0])}
              >
                <span>{x[1]}</span>
                {x[2]}
                {x[0] === "brief" && <i>3</i>}
                {x[0] === "alerts" && alertEvents.length > 0 && <i>{alertEvents.length}</i>}
                {x[0] === "workspace" && workspace.decisions.length > 0 && <i>{workspace.decisions.length}</i>}
              </button>
            ))}
          </div>
          <div className="refresh">
            <small aria-live="polite">{copy.updatePrefix} {updated}</small>
            <button onClick={refresh} disabled={busy} aria-label={busy ? copy.checking : copy.refresh}>
              <b className={busy ? "spin" : ""}>↻</b>
              {busy ? copy.checking : copy.refresh}
            </button>
          </div>
        </div>
        {tab === "prices" && (
          <>
            <div className="sourceNote">
              <b>{copy.noAccounts}</b> {copy.sourceNote}
            </div>
            <div className="filters">
              <label>
                ⌕
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  aria-label={copy.search}
                  placeholder={copy.search}
                />
              </label>
              <Filter
                label={copy.region}
                value={region}
                set={(v) => setRegion(v as Region)}
                options={regionOptions.map((r) => `${r}|${preferences.language === "zh" ? r : regionLabel(r)}`)}
              />
              <Filter
                label={copy.availability}
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
                label={copy.compliance}
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
                label={copy.sort}
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
                label={copy.currency}
                value={currency}
                set={(v) => setCurrency(v as Currency)}
                options={["USD", "EUR", "GBP", "CNY", "JPY", "AUD"]}
              />
              <small>{currency} {copy.planningFx}</small>
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
              <div className="briefFilters">
                <Filter
                  label="Category"
                  value={briefCategory}
                  set={setBriefCategory}
                  options={[
                    "all|All changes",
                    "pricing|Pricing",
                    "availability|Availability",
                    "routing|Routing",
                  ]}
                />
                <Filter
                  label="Materiality"
                  value={briefSeverity}
                  set={setBriefSeverity}
                  options={[
                    "all|All levels",
                    "high|High impact",
                    "medium|Medium impact",
                    "low|Low impact",
                  ]}
                />
              </div>
              {filteredBriefs.map((b, i) => (
                <article
                  key={b.title}
                  className={openBrief === i ? "expanded" : ""}
                >
                  <small>
                    {b.time}　<b>{b.tag}</b>
                    <em className={b.severity}>{b.severity} impact</em>
                    <span>{b.region}</span>
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
                      <div>
                        {b.scenarios.map((scenario) => <span key={scenario}>{scenario}</span>)}
                        {b.sourceUrl && <a href={b.sourceUrl} target="_blank" rel="noreferrer">Official source ↗</a>}
                      </div>
                    </div>
                  )}
                </article>
              ))}
              {!filteredBriefs.length && <div className="empty">No market changes match these filters.</div>}
            </div>
            <aside>
              <h3>At a glance</h3>
              <strong>{filteredBriefs.length}</strong>
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
              title="Start with the work you need to do"
              sub="Choose a scenario, region, operating scale, and risk posture. The engine explains its score, projected bill, and alternatives."
            />
            <div className="useCasePicker">
              {scenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  className={scenarioId === scenario.id ? "selected" : ""}
                  onClick={() => setScenarioId(scenario.id)}
                >
                  <i>{scenario.icon}</i>
                  <span>
                    <b>{scenario.title}</b>
                    <small>{scenario.desc}</small>
                  </span>
                </button>
              ))}
            </div>
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
                label="Workload"
                value={workloadScale}
                set={setWorkloadScale}
                options={[
                  "pilot|Pilot · 0.25×",
                  "standard|Standard · 1×",
                  "production|Production · 5×",
                ]}
              />
              <Filter
                label="Risk posture"
                value={riskProfile}
                set={setRiskProfile}
                options={[
                  "experimental|Experimental",
                  "balanced|Balanced",
                  "enterprise|Enterprise controls",
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
                {rankedRecommendations.length} eligible · {recommendationExclusions} excluded
              </span>
            </div>
            <div className="scenarioBrief">
              <div>
                <small>WORKLOAD PROFILE</small>
                <strong>{formatTokens(selectedScenario.monthlyInput * scaleMultiplier)} input</strong>
                <span>{formatTokens(selectedScenario.monthlyOutput * scaleMultiplier)} output / month</span>
              </div>
              <div>
                <small>EXPECTED CACHE HIT</small>
                <strong>{selectedScenario.cacheHit}%</strong>
                <span>{selectedScenario.emphasis} emphasis</span>
              </div>
              <div>
                <small>MINIMUM FIT</small>
                <strong>{selectedScenario.minAbility} ability</strong>
                <span>{formatTokens(selectedScenario.minContext)} context</span>
              </div>
              <p>{selectedScenario.desc}. Workspace guardrail: {workspace.enforceBudget ? `hard cap of ${formatMoney(workspace.monthlyBudget, currency, 2)} / month` : `${formatMoney(workspace.monthlyBudget, currency, 2)} advisory budget`}. Run an eval before production.</p>
            </div>
            {rankedRecommendations.length ? (
              <div className="recommendationEngine">
                <article className="bestRecommendation">
                  <div className="recommendationTopline">
                    <span>BEST FIT · {rankedRecommendations[0].confidence.toUpperCase()} CONFIDENCE</span>
                    <strong>{rankedRecommendations[0].score.toFixed(1)}</strong>
                  </div>
                  <h2>{rankedRecommendations[0].m.name}</h2>
                  <h3>{providerLabel(rankedRecommendations[0].p.name)}</h3>
                  <div className="recommendationCost">
                    <span>Projected monthly API cost</span>
                    <strong>{formatMoney(rankedRecommendations[0].monthlyUsd, currency, 2)}</strong>
                    <small>{formatMoney(rankedRecommendations[0].monthlyUsd * 12, currency, 2)} / year</small>
                  </div>
                  <div className="scoreBreakdown">
                    {Object.entries(rankedRecommendations[0].breakdown).map(([label, value]) => (
                      <div key={label}>
                        <span><b>{label}</b><em>{value.toFixed(0)}</em></span>
                        <i><b style={{ width: `${value}%` }} /></i>
                      </div>
                    ))}
                  </div>
                  <div className="recommendationWhy">
                    <b>Why it leads</b>
                    <p>
                      It clears the scenario&apos;s {selectedScenario.minAbility} ability and {formatTokens(selectedScenario.minContext)} context thresholds, while its projected cost and cache economics remain competitive for this workload.
                    </p>
                    <span>{rankedRecommendations[0].policy.trainingLabel}</span>
                    <span>{rankedRecommendations[0].policy.retentionLabel}</span>
                  </div>
                  <div className="recommendActions">
                    <button onClick={() => setTab("calculator")}>Open full cost model →</button>
                    <button onClick={saveTopRecommendation}>Save decision to workspace</button>
                  </div>
                </article>
                <div className="alternativeRoutes">
                  <div>
                    <b>ALTERNATIVES</b>
                    <span>Different trade-offs, same hard filters</span>
                  </div>
                  {rankedRecommendations.slice(1, 4).map((candidate, index) => (
                    <article key={`${candidate.m.name}-${candidate.p.name}`}>
                      <em>#{index + 2}</em>
                      <div>
                        <strong>{candidate.m.name}</strong>
                        <span>{providerLabel(candidate.p.name)} · {candidate.confidence} confidence</span>
                      </div>
                      <b>{candidate.score.toFixed(1)}</b>
                      <small>{formatMoney(candidate.monthlyUsd, currency, 2)} / mo</small>
                      <p>
                        Capability {candidate.breakdown.capability.toFixed(0)} · cost {candidate.breakdown.cost.toFixed(0)} · trust {candidate.breakdown.trust.toFixed(0)}
                      </p>
                    </article>
                  ))}
                  <div className="recommendationGuardrail">
                    <b>{recommendationExclusions} routes excluded</b>
                    <span>Region, compliance, account access, ability, context, and enterprise policy requirements are applied before scoring.</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty">No route clears every hard requirement. Relax the region, compliance, risk, workspace budget, ability, or context constraints.</div>
            )}
            <div className="method">
              <b>Transparent scoring</b>
              Base weights: capability {selectedScenario.weights.capability}% · cost {selectedScenario.weights.cost}% · latency {selectedScenario.weights.latency}% · cache {selectedScenario.weights.cache}% · trust {selectedScenario.weights.trust}%. Priority and risk choices adjust these weights before normalization. Capability and latency are editorial planning inputs, not live benchmarks.
            </div>
          </>
        )}
        {tab === "alerts" && (
          <AlertCenter
            models={liveModels}
            rules={alerts}
            events={alertEvents}
            onAdd={addAlert}
            onToggle={toggleAlert}
            onRemove={removeAlert}
            onClearEvents={() => setAlertEvents([])}
            onRefresh={refresh}
            busy={busy}
          />
        )}
        {tab === "workspace" && (
          <WorkspaceCenter
            workspace={workspace}
            setWorkspace={setWorkspace}
            onApplyPreset={applyGovernancePreset}
          />
        )}
        {tab === "preferences" && (
          <PreferencesCenter
            preferences={preferences}
            setPreferences={setPreferences}
            region={region}
            setRegion={setRegion}
            currency={currency}
            setCurrency={setCurrency}
          />
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
        <span>{copy.footerTitle}</span>
        <span>{copy.footerNote}</span>
      </footer>
      {toast && (
        <div className="toast" role="status" aria-live="assertive">
          <i>✓</i>
          <span>
            <b>{copy.toastTitle}</b>
            <small>{copy.toastBody}</small>
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
function Header({ tab, setTab, copy }: { tab: string; setTab: (v: string) => void; copy: UiCopy }) {
  return (
    <header>
      <a className="brand" href="#">
        <i>M</i>ModelScope
      </a>
      <nav>
        {[
          ["prices", copy.nav[0]],
          ["calculator", copy.nav[1]],
          ["history", copy.nav[2]],
          ["health", copy.nav[3]],
          ["brief", copy.nav[4]],
          ["alerts", copy.nav[5]],
          ["workspace", copy.nav[6]],
          ["preferences", copy.nav[7]],
          ["recommend", copy.nav[8]],
        ].map((x) => (
          <button
            key={x[0]}
            className={tab === x[0] ? "on" : ""}
            onClick={() => setTab(x[0])}
            aria-current={tab === x[0] ? "page" : undefined}
          >
            {x[1]}
          </button>
        ))}
        <a className="navExternal" href="/api-docs">{copy.developers}</a>
      </nav>
      <div className="health">
        <i /> {copy.online}{" "}
        <button
          aria-label={copy.openHealth}
          title={copy.nav[3]}
          onClick={() => setTab("health")}
        >
          ●
        </button>
      </div>
    </header>
  );
}
function Hero({ models, copy }: { models: M[]; copy: UiCopy }) {
  const providers = new Set(
      models.flatMap((m) => m.providers.map((p) => p.name)),
    ).size,
    routes = models.reduce((n, m) => n + m.providers.length, 0);
  return (
    <section className="hero wrap">
      <div>
        <b>{copy.heroLabel}</b>
        <h1>
          {copy.heroLine1}
          <br />
          <em>{copy.heroLine2}</em>
        </h1>
        <p>
          {copy.heroBody1}
          <br />
          {copy.heroBody2}
        </p>
      </div>
      <div className="heroCard">
        <div className="chartTitle">
          <span>{copy.coverage}</span>
          <small>{copy.coverageSub}</small>
        </div>
        <div className="bars">
          {[55, 68, 46, 82, 64, 91, 74, 58, 70, 49, 62, 44].map((h, i) => (
            <i key={i} style={{ height: h + "%" }} />
          ))}
        </div>
        <div className="stats">
          <div>
            <strong>{providers}</strong>
            <small>{copy.providers}</small>
          </div>
          <div>
            <strong>{routes}</strong>
            <small>{copy.routes}</small>
          </div>
          <div>
            <strong>{regionOptions.length}</strong>
            <small>{copy.regions}</small>
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
function PreferencesCenter({
  preferences,
  setPreferences,
  region,
  setRegion,
  currency,
  setCurrency,
}: {
  preferences: UiPreferences;
  setPreferences: Dispatch<SetStateAction<UiPreferences>>;
  region: Region;
  setRegion: (region: Region) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}) {
  const zh = preferences.language === "zh";
  const text = zh
    ? {
        label: "界面与无障碍",
        title: "按你的工作方式调整工具",
        sub: "语言、主题、密度和辅助功能会立即生效，并且只保存在当前浏览器。",
        language: "界面语言",
        appearance: "外观主题",
        system: "跟随系统",
        light: "浅色",
        dark: "深色",
        density: "信息密度",
        comfortable: "舒适",
        compact: "紧凑",
        defaults: "区域默认值",
        region: "用户地区",
        currency: "显示货币",
        accessibility: "辅助功能",
        motion: "减少界面动画",
        motionSub: "关闭旋转、浮动和过渡动画",
        contrast: "高对比度",
        contrastSub: "加强边框、焦点与文本对比",
        privacy: "这些偏好不会上传，也不会触发价格刷新。手动刷新规则保持不变。",
        reset: "恢复默认显示",
        preview: "当前配置",
      }
    : {
        label: "INTERFACE & ACCESSIBILITY",
        title: "Make the tool work your way",
        sub: "Language, theme, density, and assistive settings apply instantly and stay only in this browser.",
        language: "Interface language",
        appearance: "Appearance theme",
        system: "Use system",
        light: "Light",
        dark: "Dark",
        density: "Information density",
        comfortable: "Comfortable",
        compact: "Compact",
        defaults: "Regional defaults",
        region: "User region",
        currency: "Display currency",
        accessibility: "Accessibility",
        motion: "Reduce interface motion",
        motionSub: "Disables spinning, lifting, and transition effects",
        contrast: "High contrast",
        contrastSub: "Strengthens borders, focus indicators, and text contrast",
        privacy: "These preferences are never uploaded and never trigger a price refresh. Manual refresh behavior is unchanged.",
        reset: "Reset display defaults",
        preview: "Current setup",
      };
  const themes: [UiTheme, string, string][] = [
    ["system", text.system, "◐"],
    ["light", text.light, "☀"],
    ["dark", text.dark, "●"],
  ];
  const densities: [UiDensity, string][] = [
    ["comfortable", text.comfortable],
    ["compact", text.compact],
  ];
  return (
    <div className="preferencesCenter">
      <Title label={text.label} title={text.title} sub={text.sub} />
      <div className="preferencePrivacy" role="note"><b>LOCAL</b><span>{text.privacy}</span></div>
      <div className="preferenceGrid">
        <section>
          <div className="preferenceTitle"><b>{text.language}</b><span>EN / 中文</span></div>
          <div className="segmented" role="group" aria-label={text.language}>
            <button aria-pressed={preferences.language === "en"} className={preferences.language === "en" ? "selected" : ""} onClick={() => setPreferences((current) => ({ ...current, language: "en" }))}>English</button>
            <button aria-pressed={preferences.language === "zh"} className={preferences.language === "zh" ? "selected" : ""} onClick={() => setPreferences((current) => ({ ...current, language: "zh" }))}>中文</button>
          </div>
        </section>
        <section>
          <div className="preferenceTitle"><b>{text.appearance}</b><span>{preferences.theme}</span></div>
          <div className="themeChoices">
            {themes.map(([theme, label, icon]) => <button key={theme} aria-pressed={preferences.theme === theme} className={preferences.theme === theme ? "selected" : ""} onClick={() => setPreferences((current) => ({ ...current, theme }))}><i>{icon}</i><span>{label}</span></button>)}
          </div>
        </section>
        <section>
          <div className="preferenceTitle"><b>{text.density}</b><span>{preferences.density}</span></div>
          <div className="densityChoices">
            {densities.map(([density, label]) => <button key={density} aria-pressed={preferences.density === density} className={preferences.density === density ? "selected" : ""} onClick={() => setPreferences((current) => ({ ...current, density }))}><i>{density === "compact" ? "≡" : "☷"}</i><span>{label}</span></button>)}
          </div>
        </section>
        <section>
          <div className="preferenceTitle"><b>{text.defaults}</b><span>{regionLabel(region)} · {currency}</span></div>
          <label>{text.region}<select value={region} onChange={(event) => setRegion(event.target.value as Region)}>{regionOptions.map((item) => <option key={item} value={item}>{zh ? item : regionLabel(item)}</option>)}</select></label>
          <label>{text.currency}<select value={currency} onChange={(event) => setCurrency(event.target.value as Currency)}>{["USD", "EUR", "GBP", "CNY", "JPY", "AUD"].map((item) => <option key={item}>{item}</option>)}</select></label>
        </section>
      </div>
      <section className="accessibilitySettings">
        <div className="preferenceTitle"><b>{text.accessibility}</b><span>WCAG-oriented controls</span></div>
        <label htmlFor="reduced-motion"><input id="reduced-motion" aria-label={text.motion} type="checkbox" checked={preferences.reducedMotion} onChange={(event) => setPreferences((current) => ({ ...current, reducedMotion: event.target.checked }))} /><span><b>{text.motion}</b><small>{text.motionSub}</small></span></label>
        <label htmlFor="high-contrast"><input id="high-contrast" aria-label={text.contrast} type="checkbox" checked={preferences.highContrast} onChange={(event) => setPreferences((current) => ({ ...current, highContrast: event.target.checked }))} /><span><b>{text.contrast}</b><small>{text.contrastSub}</small></span></label>
        <div className="preferenceSummary"><b>{text.preview}</b><span>{preferences.language.toUpperCase()} · {preferences.theme} · {preferences.density} · {regionLabel(region)} · {currency}</span><button onClick={() => { setPreferences(DEFAULT_PREFERENCES); setRegion("全球"); setCurrency("USD"); }}>{text.reset}</button></div>
      </section>
    </div>
  );
}
function WorkspaceCenter({
  workspace,
  setWorkspace,
  onApplyPreset,
}: {
  workspace: WorkspaceState;
  setWorkspace: Dispatch<SetStateAction<WorkspaceState>>;
  onApplyPreset: (preset: string) => void;
}) {
  const [name, setName] = useState(workspace.name),
    [organization, setOrganization] = useState(workspace.organization),
    [budget, setBudget] = useState(workspace.monthlyBudget),
    [enforce, setEnforce] = useState(workspace.enforceBudget),
    [memberName, setMemberName] = useState(""),
    [memberRole, setMemberRole] = useState<TeamMember["role"]>("Viewer"),
    [importError, setImportError] = useState("");
  const audit = (action: string): AuditEntry => ({
    id: globalThis.crypto.randomUUID(),
    at: new Date().toISOString(),
    action,
  });
  function saveSettings() {
    setWorkspace((current) => ({
      ...current,
      name: name.trim() || DEFAULT_WORKSPACE.name,
      organization: organization.trim() || DEFAULT_WORKSPACE.organization,
      monthlyBudget: Math.max(0, budget),
      enforceBudget: enforce,
      audit: [audit("Updated workspace settings and budget guardrail"), ...current.audit].slice(0, 100),
    }));
  }
  function addMember() {
    if (!memberName.trim()) return;
    const member: TeamMember = {
      id: globalThis.crypto.randomUUID(),
      name: memberName.trim(),
      role: memberRole,
    };
    setWorkspace((current) => ({
      ...current,
      members: [...current.members, member],
      audit: [audit(`Added local ${member.role.toLowerCase()} role: ${member.name}`), ...current.audit].slice(0, 100),
    }));
    setMemberName("");
  }
  function removeMember(id: string) {
    setWorkspace((current) => {
      const member = current.members.find((item) => item.id === id);
      return {
        ...current,
        members: current.members.filter((item) => item.id !== id),
        audit: [audit(`Removed local role: ${member?.name ?? "member"}`), ...current.audit].slice(0, 100),
      };
    });
  }
  function removeDecision(id: string) {
    setWorkspace((current) => ({
      ...current,
      decisions: current.decisions.filter((item) => item.id !== id),
      audit: [audit("Removed a saved decision record"), ...current.audit].slice(0, 100),
    }));
  }
  function exportWorkspace() {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([JSON.stringify(workspace, null, 2)], { type: "application/json" }));
    link.download = "modelscope-workspace.json";
    link.click();
    URL.revokeObjectURL(link.href);
  }
  async function importWorkspace(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as WorkspaceState;
      if (!parsed.name || !Array.isArray(parsed.members) || !Array.isArray(parsed.decisions))
        throw new Error("Invalid workspace structure");
      setWorkspace({ ...DEFAULT_WORKSPACE, ...parsed, audit: [audit("Imported portable workspace file"), ...(parsed.audit ?? [])].slice(0, 100) });
      setName(parsed.name);
      setOrganization(parsed.organization);
      setBudget(parsed.monthlyBudget);
      setEnforce(parsed.enforceBudget);
      setImportError("");
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Import failed");
    } finally {
      event.target.value = "";
    }
  }
  const presets = [
    ["balanced", "Balanced", "Advisory budget · global discovery"],
    ["us-enterprise", "US enterprise", "No-training routes · hard USD cap"],
    ["eu-regulated", "EU regulated", "GDPR routes · EUR · hard cap"],
    ["cost-sandbox", "Cost sandbox", "$250 hard cap · experimental"],
    ["china-mainland", "China mainland", "Mainland routes · CNY · local scope"],
  ];
  return (
    <div className="workspaceCenter">
      <Title
        label="PRIVATE TEAM WORKSPACE"
        title="Turn comparisons into governed decisions"
        sub="This release stores workspace data only in this browser. Export a portable JSON file to hand it to another person; no member details are sent to an external identity provider."
      />
      <div className="workspacePrivacy"><b>LOCAL-ONLY PRIVACY</b><span>No sign-in, cloud sync, email invitation, or hidden telemetry. Roles document responsibility; they do not create remote accounts.</span></div>
      <div className="workspaceLayout">
        <section className="workspaceSettings">
          <div className="workspaceTitle"><b>WORKSPACE SETTINGS</b><button onClick={saveSettings}>Save settings</button></div>
          <label>Name<input value={name} onChange={(event) => setName(event.target.value)} /></label>
          <label>Organization<input value={organization} onChange={(event) => setOrganization(event.target.value)} /></label>
          <label>Monthly API budget (USD)<input type="number" min="0" value={budget} onChange={(event) => setBudget(+event.target.value)} /></label>
          <label className="budgetToggle" htmlFor="workspace-budget-enforcement"><input id="workspace-budget-enforcement" aria-label="Enforce monthly budget as a hard recommendation cap" type="checkbox" checked={enforce} onChange={(event) => setEnforce(event.target.checked)} /><span><b>Enforce as hard recommendation cap</b><small>Routes above budget are excluded before ranking</small></span></label>
          <div className="portableWorkspace">
            <button onClick={exportWorkspace}>Export JSON</button>
            <label>Import JSON<input type="file" accept="application/json" onChange={importWorkspace} /></label>
            {importError && <small>{importError}</small>}
          </div>
        </section>
        <section className="governancePresets">
          <div className="workspaceTitle"><b>GOVERNANCE PRESETS</b><span>Applies filters immediately</span></div>
          {presets.map(([id, title, desc]) => (
            <button className={workspace.preset === id ? "selected" : ""} key={id} onClick={() => onApplyPreset(id)}>
              <i>{workspace.preset === id ? "✓" : ""}</i><span><b>{title}</b><small>{desc}</small></span>
            </button>
          ))}
        </section>
      </div>
      <div className="workspaceLayout lower">
        <section className="teamRoles">
          <div className="workspaceTitle"><b>RESPONSIBILITY ROLES</b><span>{workspace.members.length} local records</span></div>
          <div className="memberBuilder"><input placeholder="Name or team label" value={memberName} onChange={(event) => setMemberName(event.target.value)} /><select value={memberRole} onChange={(event) => setMemberRole(event.target.value as TeamMember["role"])}><option>Owner</option><option>Editor</option><option>Viewer</option></select><button onClick={addMember}>Add</button></div>
          {workspace.members.map((member) => <article key={member.id}><i>{member.name.slice(0, 1).toUpperCase()}</i><span><b>{member.name}</b><small>{member.role}</small></span>{member.id !== "local-owner" && <button onClick={() => removeMember(member.id)}>Remove</button>}</article>)}
        </section>
        <section className="decisionRecords">
          <div className="workspaceTitle"><b>DECISION RECORDS</b><span>{workspace.decisions.length} saved</span></div>
          {workspace.decisions.map((decision) => <article key={decision.id}><div><b>{decision.model}</b><span>{decision.provider} · {decision.scenario}</span></div><strong>${decision.monthlyUsd.toFixed(2)}/mo</strong><small>{decision.region} · {decision.compliance} · score {decision.score.toFixed(1)}</small><button onClick={() => removeDecision(decision.id)}>Remove</button></article>)}
          {!workspace.decisions.length && <div className="workspaceEmpty">Save a recommendation to create a decision record.</div>}
        </section>
      </div>
      <section className="auditLog">
        <div className="workspaceTitle"><b>LOCAL AUDIT LOG</b><span>{workspace.audit.length} actions</span></div>
        {workspace.audit.slice(0, 12).map((entry) => <article key={entry.id}><time>{new Date(entry.at).toLocaleString("en-US")}</time><span>{entry.action}</span></article>)}
        {!workspace.audit.length && <div className="workspaceEmpty">Governance and decision actions will appear here.</div>}
      </section>
    </div>
  );
}
function AlertCenter({
  models,
  rules,
  events,
  onAdd,
  onToggle,
  onRemove,
  onClearEvents,
  onRefresh,
  busy,
}: {
  models: M[];
  rules: AlertRule[];
  events: AlertEvent[];
  onAdd: (rule: Omit<AlertRule, "id" | "createdAt" | "enabled">) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onClearEvents: () => void;
  onRefresh: () => void;
  busy: boolean;
}) {
  const [model, setModel] = useState("all"),
    [provider, setProvider] = useState("all"),
    [direction, setDirection] = useState<AlertRule["direction"]>("either"),
    [threshold, setThreshold] = useState(10);
  const providers = [
    ...new Set(
      models
        .filter((item) => model === "all" || item.name === model)
        .flatMap((item) => item.providers.map((route) => route.name)),
    ),
  ];
  function createRule() {
    onAdd({ model, provider, direction, threshold: Math.max(0.1, threshold) });
  }
  return (
    <div className="alertCenter">
      <Title
        label="MANUAL PRICE WATCH"
        title="Get alerted when a refresh finds a material change"
        sub="Rules are stored in this browser. They are evaluated only when you press Refresh prices; there is no automatic polling."
      />
      <div className="alertManual">
        <div>
          <small>REFRESH POLICY</small>
          <strong>Manual only</strong>
          <span>No background jobs, provider accounts, or API keys</span>
        </div>
        <button onClick={onRefresh} disabled={busy}>{busy ? "Checking sources…" : "↻ Refresh and evaluate alerts"}</button>
      </div>
      <div className="alertBuilder">
        <Filter label="Model" value={model} set={(value) => { setModel(value); setProvider("all"); }} options={["all|Any model", ...models.map((item) => item.name)]} />
        <Filter label="Provider" value={provider} set={setProvider} options={["all|Any provider", ...providers.map((item) => `${item}|${providerLabel(item)}`)]} />
        <Filter label="Direction" value={direction} set={(value) => setDirection(value as AlertRule["direction"])} options={["either|Up or down", "up|Price increase", "down|Price decrease"]} />
        <label>
          Change threshold
          <input type="number" min="0.1" step="0.5" value={threshold} onChange={(event) => setThreshold(+event.target.value)} />
          <b>%</b>
        </label>
        <button onClick={createRule}>Add alert rule</button>
      </div>
      <div className="alertColumns">
        <section>
          <div className="alertSectionTitle"><b>ACTIVE RULES</b><span>{rules.filter((rule) => rule.enabled).length} enabled</span></div>
          {rules.map((rule) => (
            <article className={!rule.enabled ? "disabled" : ""} key={rule.id}>
              <button className="alertToggle" onClick={() => onToggle(rule.id)} aria-label={`${rule.enabled ? "Disable" : "Enable"} alert`}><i /></button>
              <div>
                <strong>{rule.model === "all" ? "Any model" : rule.model}</strong>
                <span>{rule.provider === "all" ? "Any provider" : providerLabel(rule.provider)}</span>
              </div>
              <b>{rule.direction === "either" ? "±" : rule.direction === "up" ? "↑" : "↓"}{rule.threshold}%</b>
              <small>Created {new Date(rule.createdAt).toLocaleDateString("en-US")}</small>
              <button className="alertRemove" onClick={() => onRemove(rule.id)}>Remove</button>
            </article>
          ))}
          {!rules.length && <div className="alertEmpty">No rules yet. Create one above.</div>}
        </section>
        <section>
          <div className="alertSectionTitle"><b>TRIGGERED EVENTS</b>{events.length > 0 && <button onClick={onClearEvents}>Clear</button>}</div>
          {events.map((event) => (
            <article className="event" key={event.id}>
              <em className={event.change.direction}>{event.change.direction === "up" ? "↑" : "↓"}</em>
              <div>
                <strong>{event.change.model}</strong>
                <span>{providerLabel(event.change.provider)} · {fieldName(event.change.field)}</span>
              </div>
              <b>{event.change.percent > 0 ? "+" : ""}{event.change.percent.toFixed(1)}%</b>
              <small>{new Date(event.triggeredAt).toLocaleString("en-US")}</small>
            </article>
          ))}
          {!events.length && <div className="alertEmpty">No rule has triggered on a manual refresh.</div>}
        </section>
      </div>
    </div>
  );
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
    [field, setField] = useState<"input" | "cached" | "output">("input"),
    [range, setRange] = useState("30"),
    [asOf] = useState(() => Date.now());
  const cutoff = range === "all" ? 0 : asOf - Number(range) * 86_400_000;
  const visible = snapshots.filter(
    (s) =>
      (model === "all" || s.model === model) &&
      new Date(s.collectedAt).getTime() >= cutoff,
  );
  const routes = [
    ...new Set(visible.map((s) => `${s.model}|||${s.provider}`)),
  ].slice(0, 8);
  const movements = visible.filter((snapshot) => snapshot.changePercent != null);
  const largestUp = movements.reduce<HistorySnapshot | null>(
    (best, item) => !best || (item.changePercent ?? 0) > (best.changePercent ?? 0) ? item : best,
    null,
  );
  const largestDown = movements.reduce<HistorySnapshot | null>(
    (best, item) => !best || (item.changePercent ?? 0) < (best.changePercent ?? 0) ? item : best,
    null,
  );
  function exportHistory() {
    const header = "collected_at,model,provider,input,cache_read,output,currency,pricing_region,tier,change_percent,verification_status";
    const rows = visible.map((snapshot) => [
      snapshot.collectedAt,
      snapshot.model,
      providerLabel(snapshot.provider),
      snapshot.input ?? "",
      snapshot.cached ?? "",
      snapshot.output ?? "",
      snapshot.currency ?? "USD",
      snapshot.pricingRegion ?? "",
      snapshot.tier ?? "",
      snapshot.changePercent ?? "",
      snapshot.verificationStatus ?? "",
    ].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","));
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([[header, ...rows].join("\n")], { type: "text/csv" }));
    link.download = `modelscope-price-history-${range}d.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
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
            <Filter
              label="Range"
              value={range}
              set={setRange}
              options={["7|7 days", "30|30 days", "90|90 days", "all|All history"]}
            />
            <span>
              {visible.length} accepted snapshots · {runs.length} recent
              collection runs
            </span>
            <button onClick={exportHistory} disabled={!visible.length}>Export CSV</button>
          </div>
          <div className="historySummary">
            <div><small>ROUTES TRACKED</small><strong>{routes.length}</strong><span>in the selected view</span></div>
            <div><small>LARGEST INCREASE</small><strong>{largestUp?.changePercent != null ? `+${largestUp.changePercent.toFixed(1)}%` : "—"}</strong><span>{largestUp ? `${largestUp.model} · ${providerLabel(largestUp.provider)}` : "No movement"}</span></div>
            <div><small>LARGEST DECREASE</small><strong>{largestDown?.changePercent != null && largestDown.changePercent < 0 ? `${largestDown.changePercent.toFixed(1)}%` : "—"}</strong><span>{largestDown && (largestDown.changePercent ?? 0) < 0 ? `${largestDown.model} · ${providerLabel(largestDown.provider)}` : "No decrease"}</span></div>
            <p>Accepted snapshots only. The view excludes quarantined anomalies and uses the first and latest recorded values for each displayed trend.</p>
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
