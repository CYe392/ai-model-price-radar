export const dynamic = "force-dynamic";

import { env } from "cloudflare:workers";
import { getD1Binding } from "../../../../db";
import { escapeHtml, sendNewsletterEmail } from "../../../../lib/newsletter";
import { getProductUpdate } from "../../../../lib/updates";

type RetryDelivery = {
  id: number;
  email: string;
  unsubscribe_token: string;
  publication_slug: string;
  attempt_count: number;
};

export async function POST(request: Request) {
  const bindings = env as unknown as Record<string, string | undefined>;
  if (!bindings.NEWSLETTER_ADMIN_TOKEN || request.headers.get("authorization") !== `Bearer ${bindings.NEWSLETTER_ADMIN_TOKEN}`)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const db = getD1Binding();
  const candidates = await db
    .prepare(
      `SELECT d.id, s.email, s.unsubscribe_token, d.publication_slug, d.attempt_count
       FROM newsletter_deliveries d
       JOIN newsletter_subscribers s ON s.id = d.subscriber_id
       WHERE d.kind = 'publication'
         AND d.status IN ('failed', 'delayed')
         AND d.attempt_count < 3
         AND s.status = 'active'
       ORDER BY d.created_at
       LIMIT 10`,
    )
    .all<RetryDelivery>();
  const origin = new URL(request.url).origin;
  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (const delivery of candidates.results) {
    const update = getProductUpdate(delivery.publication_slug);
    if (!update) {
      skipped += 1;
      continue;
    }
    const updateUrl = `${origin}/updates/${encodeURIComponent(update.slug)}`;
    const unsubscribeUrl = `${origin}/api/newsletter/unsubscribe?token=${encodeURIComponent(delivery.unsubscribe_token)}`;
    const manageUrl = `${origin}/subscription#token=${encodeURIComponent(delivery.unsubscribe_token)}`;
    try {
      const result = await sendNewsletterEmail({
        to: delivery.email,
        subject: update.title,
        unsubscribeUrl,
        html: `<p>${escapeHtml(update.summary)}</p><p><a href="${escapeHtml(updateUrl)}">Read the full update</a></p><p><a href="${escapeHtml(manageUrl)}">Manage preferences or delete my data</a> · <a href="${escapeHtml(unsubscribeUrl)}">Unsubscribe</a></p>`,
      });
      if (!result.configured) {
        skipped += 1;
        continue;
      }
      sent += 1;
      await db
        .prepare("UPDATE newsletter_deliveries SET status = 'sent', provider_message_id = ?, error = NULL, sent_at = ?, last_event_at = NULL, attempt_count = attempt_count + 1 WHERE id = ?")
        .bind(result.providerMessageId, new Date().toISOString(), delivery.id)
        .run();
    } catch (error) {
      failed += 1;
      await db
        .prepare("UPDATE newsletter_deliveries SET status = 'failed', error = ?, attempt_count = attempt_count + 1 WHERE id = ?")
        .bind(error instanceof Error ? error.message.slice(0, 240) : "retry failed", delivery.id)
        .run();
    }
  }

  return Response.json(
    { processed: candidates.results.length, sent, failed, skipped, batch_limit: 10, max_attempts: 3 },
    { headers: { "cache-control": "no-store" } },
  );
}
