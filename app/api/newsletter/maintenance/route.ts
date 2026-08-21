export const dynamic = "force-dynamic";

import { env } from "cloudflare:workers";
import { getD1Binding } from "../../../../db";

export async function POST(request: Request) {
  const bindings = env as unknown as Record<string, string | undefined>;
  if (!bindings.NEWSLETTER_ADMIN_TOKEN || request.headers.get("authorization") !== `Bearer ${bindings.NEWSLETTER_ADMIN_TOKEN}`)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const now = Date.now();
  const pendingCutoff = new Date(now - 30 * 86400_000).toISOString();
  const inactiveCutoff = new Date(now - 90 * 86400_000).toISOString();
  const webhookCutoff = new Date(now - 90 * 86400_000).toISOString();
  const db = getD1Binding();
  const [pending, inactive, webhookEvents] = await db.batch([
    db.prepare("DELETE FROM newsletter_subscribers WHERE status = 'pending' AND created_at < ?").bind(pendingCutoff),
    db.prepare("DELETE FROM newsletter_subscribers WHERE status IN ('unsubscribed', 'suppressed') AND updated_at < ?").bind(inactiveCutoff),
    db.prepare("DELETE FROM newsletter_webhook_events WHERE processed_at < ?").bind(webhookCutoff),
  ]);
  return Response.json(
    {
      executed_at: new Date(now).toISOString(),
      policy: { pending_days: 30, unsubscribed_or_suppressed_days: 90, webhook_event_days: 90 },
      deleted: {
        pending_subscribers: pending.meta?.changes ?? 0,
        inactive_subscribers: inactive.meta?.changes ?? 0,
        webhook_events: webhookEvents.meta?.changes ?? 0,
      },
    },
    { headers: { "cache-control": "no-store" } },
  );
}
