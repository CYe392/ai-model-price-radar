export const dynamic = "force-dynamic";

import { getD1Binding } from "../../../../db";
import {
  createToken,
  escapeHtml,
  hashToken,
  isNewsletterRegion,
  isValidEmail,
  normalizeEmail,
  sendNewsletterEmail,
} from "../../../../lib/newsletter";

type SubscribeBody = {
  email?: unknown;
  region?: unknown;
  locale?: unknown;
  consent?: unknown;
};

const noStore = { "cache-control": "no-store" };

export async function POST(request: Request) {
  let body: SubscribeBody;
  try {
    body = (await request.json()) as SubscribeBody;
  } catch {
    return Response.json(
      { error: "A valid JSON body is required." },
      { status: 400, headers: noStore },
    );
  }

  const email = normalizeEmail(typeof body.email === "string" ? body.email : "");
  const region = typeof body.region === "string" ? body.region : "global";
  const locale = body.locale === "zh" ? "zh" : "en";
  if (!isValidEmail(email) || !isNewsletterRegion(region) || body.consent !== true) {
    return Response.json(
      { error: "A valid email, region, and explicit consent are required." },
      { status: 422, headers: noStore },
    );
  }

  const db = getD1Binding();
  const existing = await db
    .prepare(
      "SELECT id, status FROM newsletter_subscribers WHERE email_normalized = ? LIMIT 1",
    )
    .bind(email)
    .first<{ id: number; status: string }>();

  if (existing?.status === "active") {
    return Response.json(
      {
        accepted: true,
        message: "If this address can receive updates, its subscription is ready.",
      },
      { status: 202, headers: noStore },
    );
  }

  const confirmationToken = createToken();
  const unsubscribeToken = createToken();
  const confirmationTokenHash = await hashToken(confirmationToken);
  const now = new Date().toISOString();
  let subscriberId: number;

  if (existing) {
    await db
      .prepare(
        "UPDATE newsletter_subscribers SET email = ?, locale = ?, region = ?, status = 'pending', confirmation_token_hash = ?, unsubscribe_token = ?, consent_source = 'updates-page', updated_at = ?, unsubscribed_at = NULL WHERE id = ?",
      )
      .bind(
        email,
        locale,
        region,
        confirmationTokenHash,
        unsubscribeToken,
        now,
        existing.id,
      )
      .run();
    subscriberId = existing.id;
  } else {
    const inserted = await db
      .prepare(
        "INSERT INTO newsletter_subscribers (email, email_normalized, locale, region, status, confirmation_token_hash, unsubscribe_token, consent_source, created_at, updated_at) VALUES (?, ?, ?, ?, 'pending', ?, ?, 'updates-page', ?, ?) RETURNING id",
      )
      .bind(
        email,
        email,
        locale,
        region,
        confirmationTokenHash,
        unsubscribeToken,
        now,
        now,
      )
      .first<{ id: number }>();
    if (!inserted) throw new Error("Subscriber record was not created.");
    subscriberId = inserted.id;
  }

  const delivery = await db
    .prepare(
      "INSERT INTO newsletter_deliveries (subscriber_id, kind, status, created_at) VALUES (?, 'confirmation', 'pending', ?) RETURNING id",
    )
    .bind(subscriberId, now)
    .first<{ id: number }>();

  const origin = new URL(request.url).origin;
  const confirmUrl = `${origin}/api/newsletter/confirm?token=${encodeURIComponent(confirmationToken)}`;
  const unsubscribeUrl = `${origin}/api/newsletter/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;
  let deliveryState = "queued";

  try {
    const sent = await sendNewsletterEmail({
      to: email,
      subject: "Confirm your ModelScope updates",
      unsubscribeUrl,
      html: `<p>Confirm your ModelScope email updates subscription.</p><p><a href="${escapeHtml(confirmUrl)}">Confirm subscription</a></p><p>If you did not request this, you can ignore this message.</p>`,
    });
    if (sent.configured) {
      deliveryState = "sent";
      await db
        .prepare(
          "UPDATE newsletter_deliveries SET status = 'sent', provider_message_id = ?, sent_at = ? WHERE id = ?",
        )
        .bind(sent.providerMessageId, new Date().toISOString(), delivery?.id)
        .run();
    }
  } catch (error) {
    deliveryState = "retry_pending";
    await db
      .prepare(
        "UPDATE newsletter_deliveries SET status = 'failed', error = ? WHERE id = ?",
      )
      .bind(error instanceof Error ? error.message.slice(0, 240) : "delivery failed", delivery?.id)
      .run();
  }

  return Response.json(
    {
      accepted: true,
      delivery: deliveryState,
      message: "Check your inbox to confirm the subscription.",
    },
    { status: 202, headers: noStore },
  );
}
