export const dynamic = "force-dynamic";

import { getD1Binding } from "../../../../db";
import { hashToken } from "../../../../lib/newsletter";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? "";
  if (token.length < 32 || token.length > 200) {
    return Response.redirect(new URL("/updates?subscription=invalid", url), 303);
  }

  const hash = await hashToken(token);
  const now = new Date().toISOString();
  const subscriber = await getD1Binding()
    .prepare(
      "UPDATE newsletter_subscribers SET status = 'active', confirmation_token_hash = NULL, confirmed_at = ?, updated_at = ?, unsubscribed_at = NULL WHERE confirmation_token_hash = ? AND status = 'pending' RETURNING id",
    )
    .bind(now, now, hash)
    .first<{ id: number }>();

  return Response.redirect(
    new URL(
      subscriber ? "/updates?subscription=confirmed" : "/updates?subscription=invalid",
      url,
    ),
    303,
  );
}
