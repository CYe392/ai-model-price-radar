export const dynamic = "force-dynamic";

import { getD1Binding } from "../../../../db";

const EVENTS = new Set(["page_view", "newsletter_subscribe", "recommendation_start", "provider_outbound", "pricing_guide_view"]);
const SOURCES = new Set(["direct", "google", "bing", "chatgpt", "openai", "other"]);

export async function POST(request: Request) {
  if (request.headers.get("x-modelscope-consent") !== "analytics-v1") {
    return Response.json({ error: "Analytics consent signal required" }, { status: 403 });
  }
  const body = (await request.json().catch(() => null)) as { event?: unknown; path?: unknown; source?: unknown } | null;
  const event = typeof body?.event === "string" ? body.event : "";
  const path = typeof body?.path === "string" ? body.path : "";
  const source = typeof body?.source === "string" ? body.source : "direct";
  if (!EVENTS.has(event) || !SOURCES.has(source) || !/^\/[a-z0-9/_-]*$/.test(path) || path.length > 160 || path.startsWith("/api/")) {
    return Response.json({ error: "Invalid aggregate analytics event" }, { status: 422 });
  }

  const now = new Date();
  await getD1Binding()
    .prepare("INSERT INTO analytics_daily (day, event, path, source, count, last_seen_at) VALUES (?, ?, ?, ?, 1, ?) ON CONFLICT(day, event, path, source) DO UPDATE SET count = count + 1, last_seen_at = excluded.last_seen_at")
    .bind(now.toISOString().slice(0, 10), event, path, source, now.toISOString())
    .run();
  return new Response(null, { status: 204, headers: { "cache-control": "no-store" } });
}
