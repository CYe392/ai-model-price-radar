import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const [schema, migration, event, summary, tracker, targets, targetApi, indexNow, key, growth, privacy, openSeo, operations] = await Promise.all([
  read("../db/schema.ts"),
  read("../drizzle/0005_growth_analytics.sql"),
  read("../app/api/analytics/event/route.ts"),
  read("../app/api/analytics/summary/route.ts"),
  read("../app/analytics-tracker.tsx"),
  read("../lib/growth-targets.ts"),
  read("../app/api/v1/growth/targets/route.ts"),
  read("../app/api/indexnow/route.ts"),
  read("../app/api/indexnow/key/route.ts"),
  read("../app/growth/page.tsx"),
  read("../app/privacy/page.tsx"),
  read("../docs/OPENSEO_PILOT.md"),
  read("../docs/GROWTH_OPERATIONS.md"),
]);

test("stores only consented daily aggregate dimensions", () => {
  assert.match(schema, /analyticsDaily/);
  assert.match(migration, /uq_analytics_daily_dimensions/);
  assert.match(event, /x-modelscope-consent/);
  assert.match(event, /count = count \+ 1/);
  assert.match(tracker, /consent\?\.analytics/);
  for (const forbidden of ["ip_address", "session_id", "fingerprint", "user_agent"]) assert.doesNotMatch(migration, new RegExp(forbidden));
});

test("protects aggregate reports and manual distribution", () => {
  assert.match(summary, /GROWTH_ADMIN_TOKEN/);
  assert.match(indexNow, /GROWTH_ADMIN_TOKEN/);
  assert.match(indexNow, /GROWTH_PATHS/);
  assert.match(indexNow, /unique\.length > 100/);
  assert.match(key, /INDEXNOW_KEY/);
  assert.match(operations, /never called by a page view/);
});

test("generates a read-only growth manifest from public collections", () => {
  assert.match(targets, /PUBLIC_MODELS/);
  assert.match(targets, /PUBLIC_PROVIDERS/);
  assert.match(targets, /PRODUCT_UPDATES/);
  assert.match(targetApi, /access-control-allow-origin/);
  assert.match(openSeo, /No direct repository, CMS, deployment/);
  assert.match(openSeo, /No automatic page generation/);
});

test("publishes an explicit measurement and privacy boundary", () => {
  assert.match(growth, /Measure useful discovery—not people/);
  assert.match(privacy, /does not store IP addresses/);
  assert.match(privacy, /Aggregate reports are restricted/);
});
