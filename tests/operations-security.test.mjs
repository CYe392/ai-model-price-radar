import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const [workerSource, apiSource, compareSource, recommendSource, statusSource, statusPage, errorPage, notFound, operations, security] = await Promise.all([
  read("../worker/index.ts"),
  read("../lib/public-api.ts"),
  read("../app/api/v1/compare/route.ts"),
  read("../app/api/v1/recommend/route.ts"),
  read("../app/api/v1/status/route.ts"),
  read("../app/status/page.tsx"),
  read("../app/error.tsx"),
  read("../app/not-found.tsx"),
  read("../docs/OPERATIONS.md"),
  read("../SECURITY.md"),
]);

async function request(path) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("ops", `${process.pid}-${Date.now()}-${Math.random()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("adds traceable security headers without disabling the public embed", async () => {
  const [home, embed] = await Promise.all([request("/"), request("/embed")]);
  assert.match(home.headers.get("x-request-id") ?? "", /^[0-9a-f-]{36}$/);
  assert.match(home.headers.get("server-timing") ?? "", /^app;dur=/);
  assert.equal(home.headers.get("x-content-type-options"), "nosniff");
  assert.equal(home.headers.get("x-frame-options"), "SAMEORIGIN");
  assert.match(home.headers.get("content-security-policy") ?? "", /frame-ancestors 'self'/);
  assert.equal(embed.headers.get("x-frame-options"), null);
  assert.match(embed.headers.get("content-security-policy") ?? "", /frame-ancestors \*/);
});

test("bounds and validates every public query parameter", async () => {
  assert.match(apiSource, /validateQuery/);
  assert.match(apiSource, /boundedNumber/);
  assert.match(compareSource, /invalid_cache_hit/);
  assert.match(recommendSource, /limit must be an integer from 1 to 10/);
  const response = await request("/api/v1/compare?cache_hit=not-a-number");
  assert.equal(response.status, 400);
  const payload = await response.json();
  assert.equal(payload.error.code, "invalid_cache_hit");
});

test("publishes readiness and human recovery surfaces", () => {
  assert.match(statusSource, /getServiceStatus/);
  assert.match(statusPage, /All core systems operational/);
  assert.match(statusPage, /Manual refresh by design/);
  assert.match(errorPage, /Try again/);
  assert.match(notFound, /PAGE NOT FOUND/);
});

test("keeps structured logs free of queries and documents incident response", () => {
  assert.match(workerSource, /event: "request_complete"/);
  assert.match(workerSource, /request_id: requestId/);
  assert.match(workerSource, /path: url\.pathname/);
  assert.doesNotMatch(workerSource, /url\.searchParams|request\.url,/);
  assert.match(operations, /Rollback/);
  assert.match(operations, /manual refresh/i);
  assert.match(security, /privately/i);
});
