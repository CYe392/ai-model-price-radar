import type { MetadataRoute } from "next";

const base = "https://modelscope-price-radar.cybercl19.chatgpt.site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/start", "/plans", "/methodology", "/about", "/privacy", "/terms", "/status", "/api-docs"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date("2026-08-17T00:00:00Z"),
    changeFrequency: path === "" || path === "/status" ? "daily" as const : "monthly" as const,
    priority: path === "" ? 1 : path === "/start" ? .9 : .6,
  }));
}
