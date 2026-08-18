import type { MetadataRoute } from "next";
import { PRODUCT_UPDATES } from "../lib/updates";

const base = "https://modelscope-price-radar.cybercl19.chatgpt.site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/start", "/plans", "/methodology", "/updates", "/about", "/privacy", "/terms", "/status", "/api-docs", ...PRODUCT_UPDATES.map((update) => `/updates/${update.slug}`)];
  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date("2026-08-18T00:00:00Z"),
    changeFrequency: path === "" || path === "/status" || path === "/updates" ? "daily" as const : "monthly" as const,
    priority: path === "" ? 1 : path === "/start" ? .9 : .6,
  }));
}
