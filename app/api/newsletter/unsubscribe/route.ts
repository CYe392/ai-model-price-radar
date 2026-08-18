export const dynamic = "force-dynamic";

import { getD1Binding } from "../../../../db";

async function unsubscribe(token: string) {
  if (token.length < 32 || token.length > 200) return false;
  const now = new Date().toISOString();
  const subscriber = await getD1Binding()
    .prepare(
      "UPDATE newsletter_subscribers SET status = 'unsubscribed', updated_at = ?, unsubscribed_at = ?, confirmation_token_hash = NULL WHERE unsubscribe_token = ? RETURNING id",
    )
    .bind(now, now, token)
    .first<{ id: number }>();
  return Boolean(subscriber);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const removed = await unsubscribe(url.searchParams.get("token") ?? "");
  return Response.redirect(
    new URL(removed ? "/updates?subscription=removed" : "/updates?subscription=invalid", url),
    303,
  );
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const removed = await unsubscribe(url.searchParams.get("token") ?? "");
  return Response.json(
    { unsubscribed: removed },
    { status: removed ? 200 : 404, headers: { "cache-control": "no-store" } },
  );
}
