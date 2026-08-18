import assert from "node:assert/strict";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("smoke", `${Date.now()}-${Math.random()}`);
const { default: worker } = await import(workerUrl.href);
const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };

async function hit(path, expectedStatus, text) {
  const response = await worker.fetch(new Request(`http://localhost${path}`), env, ctx);
  assert.equal(response.status, expectedStatus, `${path} returned ${response.status}`);
  assert.match(response.headers.get("x-request-id") ?? "", /^[0-9a-f-]{36}$/, `${path} is missing a request ID`);
  assert.match(response.headers.get("content-security-policy") ?? "", /default-src 'self'/, `${path} is missing CSP`);
  const body = await response.text();
  assert.match(body, text, `${path} did not contain its release marker`);
  return { path, status: response.status };
}

const results = [];
results.push(await hit("/", 200, /Compare AI APIs/));
results.push(await hit("/start", 200, /From workload to API shortlist/));
results.push(await hit("/plans", 200, /without a checkout fiction/));
results.push(await hit("/methodology", 200, /Every number should explain/));
results.push(await hit("/privacy", 200, /Collect less/));
results.push(await hit("/terms", 200, /planning intelligence/));
results.push(await hit("/status", 200, /Product version/));
results.push(await hit("/api-docs", 200, /PUBLIC READ API/));
results.push(await hit("/api/v1/catalog", 200, /"api_version"/));
results.push(await hit("/api/v1/status", 200, /"refresh_policy":"manual-only"/));
results.push(await hit("/embed", 200, /No automatic refresh/));
results.push(await hit("/robots.txt", 200, /Disallow: \//));
results.push(await hit("/sitemap.xml", 200, /<urlset/));
results.push(await hit("/manifest.webmanifest", 200, /ModelScope AI API Price Radar/));
results.push(await hit("/release-smoke-not-found", 404, /This route is not in the catalog/));

console.log(`Release smoke passed: ${results.length} routes`);
