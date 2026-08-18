export const dynamic = "force-dynamic";

import { env } from "cloudflare:workers";
import { GROWTH_PATHS } from "../../../lib/growth-targets";
import { SITE_URL } from "../../../lib/site";

export async function POST(request: Request) {
  const bindings = env as unknown as Record<string, string | undefined>;
  if (!bindings.GROWTH_ADMIN_TOKEN || request.headers.get("authorization") !== `Bearer ${bindings.GROWTH_ADMIN_TOKEN}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!bindings.INDEXNOW_KEY || !/^[A-Za-z0-9-]{8,128}$/.test(bindings.INDEXNOW_KEY)) {
    return Response.json({ error: "IndexNow is not configured" }, { status: 503 });
  }
  const body = (await request.json().catch(() => null)) as { paths?: unknown } | null;
  const paths = Array.isArray(body?.paths) ? body.paths.filter((path): path is string => typeof path === "string") : [];
  const unique = [...new Set(paths)];
  if (!unique.length || unique.length > 100 || unique.some((path) => !GROWTH_PATHS.has(path))) {
    return Response.json({ error: "Submit 1-100 known public target paths" }, { status: 422 });
  }
  const host = new URL(SITE_URL).host;
  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key: bindings.INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/api/indexnow/key`,
      urlList: unique.map((path) => `${SITE_URL}${path}`),
    }),
  });
  if (!response.ok) return Response.json({ error: `IndexNow returned ${response.status}` }, { status: 502 });
  return Response.json({ accepted: unique.length, paths: unique }, { status: 202, headers: { "cache-control": "no-store" } });
}
