import type { MetadataRoute } from "next";
import { PRODUCT_UPDATES } from "../lib/updates";
import { PUBLIC_MODELS, PUBLIC_PROVIDERS } from "../lib/discovery";
import { SITE_URL } from "../lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/start", "/guide", "/models", "/providers", "/plans", "/methodology", "/growth", "/updates", "/advertising", "/about", "/privacy", "/terms", "/status", "/api-docs", ...PUBLIC_MODELS.map((model) => `/models/${model.slug}`), ...PUBLIC_PROVIDERS.map((provider) => `/providers/${provider.slug}`), ...PRODUCT_UPDATES.map((update) => `/updates/${update.slug}`)];
  return paths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date("2026-08-18T00:00:00Z"),
    changeFrequency: path === "" || path === "/status" || path === "/updates" ? "daily" as const : "monthly" as const,
    priority: path === "" ? 1 : path === "/start" ? .9 : .6,
  }));
}
