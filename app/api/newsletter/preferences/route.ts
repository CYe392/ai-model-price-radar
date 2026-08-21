export const dynamic = "force-dynamic";

import { getD1Binding } from "../../../../db";
import { isNewsletterRegion, maskEmail } from "../../../../lib/newsletter";

type PreferenceBody = {
  action?: unknown;
  token?: unknown;
  region?: unknown;
  locale?: unknown;
};

const noStore = { "cache-control": "no-store" };

function validToken(value: unknown): value is string {
  return typeof value === "string" && value.length >= 32 && value.length <= 200;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as PreferenceBody | null;
  if (!body || !validToken(body.token))
    return Response.json({ error: "Invalid subscription link." }, { status: 422, headers: noStore });

  const db = getD1Binding();
  const action = typeof body.action === "string" ? body.action : "read";
  if (action === "read") {
    const subscriber = await db
      .prepare("SELECT email, region, locale, status FROM newsletter_subscribers WHERE unsubscribe_token = ? LIMIT 1")
      .bind(body.token)
      .first<{ email: string; region: string; locale: string; status: string }>();
    if (!subscriber)
      return Response.json({ error: "Subscription not found." }, { status: 404, headers: noStore });
    return Response.json({ ...subscriber, email: maskEmail(subscriber.email) }, { headers: noStore });
  }

  if (action === "update") {
    const region = typeof body.region === "string" ? body.region : "";
    const locale = body.locale === "zh" ? "zh" : body.locale === "en" ? "en" : "";
    if (!isNewsletterRegion(region) || !locale)
      return Response.json({ error: "Choose a valid market and language." }, { status: 422, headers: noStore });
    const now = new Date().toISOString();
    const updated = await db
      .prepare("UPDATE newsletter_subscribers SET region = ?, locale = ?, updated_at = ? WHERE unsubscribe_token = ? RETURNING id, status")
      .bind(region, locale, now, body.token)
      .first<{ id: number; status: string }>();
    if (!updated)
      return Response.json({ error: "Subscription not found." }, { status: 404, headers: noStore });
    return Response.json({ updated: true, status: updated.status }, { headers: noStore });
  }

  if (action === "unsubscribe") {
    const now = new Date().toISOString();
    const updated = await db
      .prepare("UPDATE newsletter_subscribers SET status = 'unsubscribed', updated_at = ?, unsubscribed_at = ?, confirmation_token_hash = NULL WHERE unsubscribe_token = ? RETURNING id")
      .bind(now, now, body.token)
      .first<{ id: number }>();
    return Response.json({ unsubscribed: Boolean(updated) }, { status: updated ? 200 : 404, headers: noStore });
  }

  if (action === "delete") {
    const deleted = await db
      .prepare("DELETE FROM newsletter_subscribers WHERE unsubscribe_token = ? RETURNING id")
      .bind(body.token)
      .first<{ id: number }>();
    return Response.json({ deleted: Boolean(deleted) }, { status: deleted ? 200 : 404, headers: noStore });
  }

  return Response.json({ error: "Unknown action." }, { status: 422, headers: noStore });
}
