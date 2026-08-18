import { PUBLIC_MODELS, PUBLIC_PROVIDERS } from "./discovery";
import { PRODUCT_UPDATES } from "./updates";
import { absoluteUrl } from "./site";

export type GrowthTarget = {
  id: string;
  type: "core" | "model" | "provider" | "update";
  canonical: string;
  title: string;
  intent: string;
  priority: number;
  updatedAt: string;
};

const core: GrowthTarget[] = [
  { id: "home", type: "core", canonical: absoluteUrl("/"), title: "AI API price intelligence", intent: "compare AI model API prices and routes", priority: 1, updatedAt: "2026-08-18" },
  { id: "guide", type: "core", canonical: absoluteUrl("/guide"), title: "AI API pricing guide", intent: "understand token price caching regions and routers", priority: .95, updatedAt: "2026-08-18" },
  { id: "models", type: "core", canonical: absoluteUrl("/models"), title: "AI model API prices", intent: "browse AI model prices by provider route", priority: .9, updatedAt: "2026-08-18" },
  { id: "providers", type: "core", canonical: absoluteUrl("/providers"), title: "AI API providers and routers", intent: "compare AI API routers clouds and direct providers", priority: .9, updatedAt: "2026-08-18" },
];

export const GROWTH_TARGETS: GrowthTarget[] = [
  ...core,
  ...PUBLIC_MODELS.map((model) => ({ id: `model-${model.slug}`, type: "model" as const, canonical: absoluteUrl(`/models/${model.slug}`), title: `${model.name} API pricing`, intent: `${model.name} API price cache regions providers`, priority: .85, updatedAt: "2026-08-18" })),
  ...PUBLIC_PROVIDERS.map((provider) => ({ id: `provider-${provider.slug}`, type: "provider" as const, canonical: absoluteUrl(`/providers/${provider.slug}`), title: `${provider.name} model API pricing`, intent: `${provider.name} models price cache regions`, priority: .8, updatedAt: "2026-08-18" })),
  ...PRODUCT_UPDATES.map((update) => ({ id: `update-${update.slug}`, type: "update" as const, canonical: absoluteUrl(`/updates/${update.slug}`), title: update.title, intent: update.summary, priority: .65, updatedAt: update.publishedAt })),
];

export const GROWTH_PATHS = new Set(GROWTH_TARGETS.map((target) => new URL(target.canonical).pathname));
