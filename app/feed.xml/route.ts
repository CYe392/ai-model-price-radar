import { PRODUCT_UPDATES } from "../../lib/updates";
import { SITE_URL } from "../../lib/site";

const xml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

export function GET() {
  const items = PRODUCT_UPDATES.map((update) => `<item><title>${xml(update.title)}</title><link>${SITE_URL}/updates/${update.slug}</link><guid isPermaLink="true">${SITE_URL}/updates/${update.slug}</guid><pubDate>${new Date(`${update.publishedAt}T12:00:00Z`).toUTCString()}</pubDate><description>${xml(update.summary)}</description></item>`).join("");
  const body = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>ModelScope updates</title><link>${SITE_URL}/updates</link><description>AI API price intelligence, route, methodology, and product updates.</description><language>en-us</language>${items}</channel></rss>`;
  return new Response(body, { headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
