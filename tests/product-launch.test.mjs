import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const [home, shell, start, plans, methodology, privacy, terms, layout, robots, sitemap, manifest, smoke, workflow, contributing, launch] = await Promise.all([
  read("../app/page.tsx"),
  read("../app/product-shell.tsx"),
  read("../app/start/page.tsx"),
  read("../app/plans/page.tsx"),
  read("../app/methodology/page.tsx"),
  read("../app/privacy/page.tsx"),
  read("../app/terms/page.tsx"),
  read("../app/layout.tsx"),
  read("../app/robots.ts"),
  read("../app/sitemap.ts"),
  read("../app/manifest.ts"),
  read("../scripts/smoke.mjs"),
  read("../.github/workflows/quality.yml"),
  read("../CONTRIBUTING.md"),
  read("../docs/LAUNCH_CHECKLIST.md"),
]);

test("ships an honest end-to-end product journey", () => {
  assert.match(home, /Find my API/);
  assert.match(home, /new URLSearchParams\(globalThis\.location\.search\)/);
  assert.match(start, /From workload to API shortlist/);
  assert.match(start, /Manual by design/);
  assert.match(plans, /No payment method is collected/);
  assert.match(plans, /NOT YET OFFERED/);
  assert.match(methodology, /Hard filters, then explainable ranking/);
});

test("publishes consistent product, privacy, and terms navigation", () => {
  for (const path of ["/start", "/methodology", "/plans", "/status", "/about", "/privacy", "/terms"])
    assert.match(shell, new RegExp(path.replace("/", "\\/")));
  assert.match(privacy, /Browser-local product data/);
  assert.match(privacy, /does not add query values/);
  assert.match(terms, /No purchase or provider relationship/);
});

test("adds metadata while keeping the private deployment out of search indexes", () => {
  assert.match(layout, /metadataBase/);
  assert.match(layout, /openGraph/);
  assert.match(layout, /index: false/);
  assert.match(robots, /disallow: "\/"/);
  assert.match(sitemap, /\/methodology/);
  assert.match(manifest, /display: "standalone"/);
});

test("automates quality and a fifteen-route launch smoke gate", () => {
  assert.match(smoke, /Release smoke passed/);
  assert.equal((smoke.match(/results\.push\(await hit/g) ?? []).length, 15);
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm test/);
  assert.match(workflow, /node scripts\/smoke\.mjs/);
  assert.match(contributing, /Manual refresh remains the only collection trigger/);
  assert.match(launch, /Previous saved Sites version remains available for rollback/);
});
