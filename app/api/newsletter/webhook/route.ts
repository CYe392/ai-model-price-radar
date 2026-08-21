export const dynamic = "force-dynamic";

import { env } from "cloudflare:workers";
import { getD1Binding } from "../../../../db";
import { verifyResendWebhook } from "../../../../lib/resend-webhook";

type ResendEvent = {
  type?: unknown;
  created_at?: unknown;
  data?: { email_id?: unknown };
};

const DELIVERY_STATES: Record<string, string> = {
  "email.sent": "sent",
  "email.delivered": "delivered",
  "email.delivery_delayed": "delayed",
  "email.failed": "failed",
  "email.bounced": "bounced",
  "email.complained": "complained",
  "email.suppressed": "suppressed",
};
const SUPPRESSION_EVENTS = new Set(["email.bounced", "email.complained", "email.suppressed"]);

export async function POST(request: Request) {
  const bindings = env as unknown as Record<string, string | undefined>;
  const secret = bindings.RESEND_WEBHOOK_SECRET;
  const id = request.headers.get("svix-id") ?? "";
  const timestamp = request.headers.get("svix-timestamp") ?? "";
  const signature = request.headers.get("svix-signature") ?? "";
  const payload = await request.text();
  if (!secret || !id || !timestamp || !signature || !(await verifyResendWebhook({ payload, id, timestamp, signature, secret })))
    return new Response("Invalid webhook", { status: 400 });

  let event: ResendEvent;
  try {
    event = JSON.parse(payload) as ResendEvent;
  } catch {
    return new Response("Invalid webhook payload", { status: 400 });
  }
  const type = typeof event.type === "string" ? event.type : "";
  const providerMessageId = typeof event.data?.email_id === "string" ? event.data.email_id : "";
  const eventCreatedAt = typeof event.created_at === "string" ? event.created_at : "";
  if (!DELIVERY_STATES[type] || !providerMessageId || !Number.isFinite(Date.parse(eventCreatedAt)))
    return Response.json({ accepted: false, ignored: true }, { status: 200 });

  const db = getD1Binding();
  const inserted = await db
    .prepare("INSERT OR IGNORE INTO newsletter_webhook_events (event_id, provider_message_id, event_type, event_created_at, processed_at) VALUES (?, ?, ?, ?, ?)")
    .bind(id, providerMessageId, type, eventCreatedAt, new Date().toISOString())
    .run();
  if ((inserted.meta?.changes ?? 0) === 0)
    return Response.json({ accepted: true, duplicate: true });

  await db
    .prepare("UPDATE newsletter_deliveries SET status = ?, last_event_at = ? WHERE provider_message_id = ? AND (last_event_at IS NULL OR last_event_at <= ?)")
    .bind(DELIVERY_STATES[type], eventCreatedAt, providerMessageId, eventCreatedAt)
    .run();
  if (SUPPRESSION_EVENTS.has(type))
    await db
      .prepare("UPDATE newsletter_subscribers SET status = 'suppressed', updated_at = ? WHERE id = (SELECT subscriber_id FROM newsletter_deliveries WHERE provider_message_id = ? LIMIT 1)")
      .bind(eventCreatedAt, providerMessageId)
      .run();

  return Response.json({ accepted: true });
}
