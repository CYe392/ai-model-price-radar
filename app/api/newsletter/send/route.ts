export const dynamic = "force-dynamic";

import { env } from "cloudflare:workers";
import { getD1Binding } from "../../../../db";
import {
  escapeHtml,
  sendNewsletterEmail,
} from "../../../../lib/newsletter";
import { getProductUpdate } from "../../../../lib/updates";

type Subscriber = {
  id: number;
  email: string;
  unsubscribe_token: string;
};

export async function POST(request: Request) {
  const bindings = env as unknown as Record<string, string | undefined>;
  const authorization = request.headers.get("authorization");
  if (
    !bindings.NEWSLETTER_ADMIN_TOKEN ||
    authorization !== `Bearer ${bindings.NEWSLETTER_ADMIN_TOKEN}`
  ) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { slug?: unknown } | null;
  const update = getProductUpdate(typeof body?.slug === "string" ? body.slug : "");
  if (!update) {
    return Response.json({ error: "Unknown publication slug" }, { status: 422 });
  }

  const db = getD1Binding();
  const subscribers = await db
    .prepare(
      "SELECT id, email, unsubscribe_token FROM newsletter_subscribers WHERE status = 'active' ORDER BY id LIMIT 25",
    )
    .all<Subscriber>();
  const origin = new URL(request.url).origin;
  let sent = 0;
  let queued = 0;
  let failed = 0;

  for (const subscriber of subscribers.results) {
    const duplicate = await db
      .prepare(
        "SELECT id FROM newsletter_deliveries WHERE subscriber_id = ? AND kind = 'publication' AND publication_slug = ? AND status = 'sent' LIMIT 1",
      )
      .bind(subscriber.id, update.slug)
      .first<{ id: number }>();
    if (duplicate) continue;

    const createdAt = new Date().toISOString();
    const delivery = await db
      .prepare(
        "INSERT INTO newsletter_deliveries (subscriber_id, kind, publication_slug, status, created_at) VALUES (?, 'publication', ?, 'pending', ?) RETURNING id",
      )
      .bind(subscriber.id, update.slug, createdAt)
      .first<{ id: number }>();
    const updateUrl = `${origin}/updates/${encodeURIComponent(update.slug)}`;
    const unsubscribeUrl = `${origin}/api/newsletter/unsubscribe?token=${encodeURIComponent(subscriber.unsubscribe_token)}`;
    const manageUrl = `${origin}/subscription#token=${encodeURIComponent(subscriber.unsubscribe_token)}`;

    try {
      const result = await sendNewsletterEmail({
        to: subscriber.email,
        subject: update.title,
        unsubscribeUrl,
        html: `<p>${escapeHtml(update.summary)}</p><p><a href="${escapeHtml(updateUrl)}">Read the full update</a></p><p><a href="${escapeHtml(manageUrl)}">Manage preferences or delete my data</a> · <a href="${escapeHtml(unsubscribeUrl)}">Unsubscribe</a></p>`,
      });
      if (!result.configured) {
        queued += 1;
        continue;
      }
      sent += 1;
      await db
        .prepare(
          "UPDATE newsletter_deliveries SET status = 'sent', provider_message_id = ?, sent_at = ?, attempt_count = attempt_count + 1 WHERE id = ?",
        )
        .bind(result.providerMessageId, new Date().toISOString(), delivery?.id)
        .run();
    } catch (error) {
      failed += 1;
      await db
        .prepare(
          "UPDATE newsletter_deliveries SET status = 'failed', error = ?, attempt_count = attempt_count + 1 WHERE id = ?",
        )
        .bind(error instanceof Error ? error.message.slice(0, 240) : "delivery failed", delivery?.id)
        .run();
    }
  }

  return Response.json(
    { publication: update.slug, sent, queued, failed, batchLimit: 25 },
    { headers: { "cache-control": "no-store" } },
  );
}
