import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
    host: "https://modelscope-price-radar.cybercl19.chatgpt.site",
  };
}
