export const dynamic = "force-dynamic";

import { env } from "cloudflare:workers";

export function GET() {
  const key = (env as unknown as Record<string, string | undefined>).INDEXNOW_KEY;
  if (!key || !/^[A-Za-z0-9-]{8,128}$/.test(key)) return new Response("Not configured", { status: 404 });
  return new Response(key, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=300" } });
}
