import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("manual collection is POST-only and protected by a D1 lease", async () => {
  const [page, route, schema, migration] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/prices/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
    readFile(new URL("../drizzle/0006_manual_refresh_guard.sql", import.meta.url), "utf8"),
  ]);

  assert.match(page, /method:\s*"POST"/);
  assert.match(page, /"x-modelscope-action":\s*"manual-price-refresh"/);
  assert.match(route, /status:\s*405/);
  assert.match(route, /origin\s*&&\s*origin\s*!==\s*requestUrl\.origin/);
  assert.match(route, /ON CONFLICT\(id\) DO UPDATE/);
  assert.match(route, /status:\s*429/);
  assert.match(route, /"retry-after"/);
  assert.match(schema, /refreshLease/);
  assert.match(migration, /CREATE TABLE `refresh_lease`/);
});
