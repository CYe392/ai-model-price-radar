import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const [catalog, compare, recommend, health, api, docs, embed] = await Promise.all([
  read("../app/api/v1/catalog/route.ts"),
  read("../app/api/v1/compare/route.ts"),
  read("../app/api/v1/recommend/route.ts"),
  read("../app/api/v1/health/route.ts"),
  read("../lib/public-api.ts"),
  read("../app/api-docs/page.tsx"),
  read("../app/embed/page.tsx"),
]);

test("publishes stable read-only API surfaces", () => {
  assert.match(catalog, /filterCatalog/);
  assert.match(compare, /blended_price/);
  assert.match(recommend, /projected_monthly_usd/);
  assert.match(health, /last_collection/);
  for (const source of [catalog, compare, recommend, health]) {
    assert.match(source, /export async function GET|export function GET/);
    assert.doesNotMatch(source, /app\/api\/prices|fetch\("\/api\/prices/);
  }
});

test("adds CORS, caching, version, errors, and fair-use metadata", () => {
  assert.match(api, /access-control-allow-origin/);
  assert.match(api, /max-age=300/);
  assert.match(api, /x-modelscope-api-version/);
  assert.match(api, /x-ratelimit-policy/);
  assert.match(api, /apiError/);
});

test("ships developer docs and an embeddable price table", () => {
  assert.match(docs, /OpenAPI 3\.1/);
  assert.match(docs, /curl/);
  assert.match(docs, /JavaScript/);
  assert.match(docs, /Python/);
  assert.match(docs, /<iframe/);
  assert.match(embed, /No automatic refresh/);
});
