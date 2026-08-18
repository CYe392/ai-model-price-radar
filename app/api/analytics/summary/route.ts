export const dynamic = "force-dynamic";

import { env } from "cloudflare:workers";
import { getD1Binding } from "../../../../db";

export async function GET(request: Request) {
  const bindings = env as unknown as Record<string, string | undefined>;
  if (!bindings.GROWTH_ADMIN_TOKEN || request.headers.get("authorization") !== `Bearer ${bindings.GROWTH_ADMIN_TOKEN}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const since = new Date(Date.now() - 29 * 86_400_000).toISOString().slice(0, 10);
  const rows = await getD1Binding()
    .prepare("SELECT day, event, path, source, count FROM analytics_daily WHERE day >= ? ORDER BY day DESC, count DESC LIMIT 1000")
    .bind(since)
    .all<{ day: string; event: string; path: string; source: string; count: number }>();
  return Response.json({ period: { since, days: 30 }, rows: rows.results }, { headers: { "cache-control": "no-store" } });
}
