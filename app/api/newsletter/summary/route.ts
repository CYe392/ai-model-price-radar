export const dynamic = "force-dynamic";

import { env } from "cloudflare:workers";
import { getD1Binding } from "../../../../db";

export async function GET(request: Request) {
  const bindings = env as unknown as Record<string, string | undefined>;
  if (!bindings.NEWSLETTER_ADMIN_TOKEN || request.headers.get("authorization") !== `Bearer ${bindings.NEWSLETTER_ADMIN_TOKEN}`)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const db = getD1Binding();
  const [subscriptions, deliveries] = await Promise.all([
    db.prepare("SELECT status, region, locale, COUNT(*) AS count FROM newsletter_subscribers GROUP BY status, region, locale ORDER BY status, region, locale").all(),
    db.prepare("SELECT kind, status, COUNT(*) AS count FROM newsletter_deliveries GROUP BY kind, status ORDER BY kind, status").all(),
  ]);
  return Response.json(
    {
      generated_at: new Date().toISOString(),
      privacy: "aggregate-only; no email addresses or subscriber tokens",
      subscriptions: subscriptions.results,
      deliveries: deliveries.results,
    },
    { headers: { "cache-control": "no-store" } },
  );
}
