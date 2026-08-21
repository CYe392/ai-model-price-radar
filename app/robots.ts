import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: ["Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User"], allow: "/", disallow: ["/subscription", "/api/newsletter/", "/api/analytics/", "/api/indexnow", "/api/prices"] },
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "*", allow: "/", disallow: ["/subscription", "/api/newsletter/", "/api/analytics/", "/api/indexnow", "/api/prices"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
