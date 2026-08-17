import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

test("history supports range analysis and auditable export", () => {
  for (const range of ["7 days", "30 days", "90 days", "All history"])
    assert.match(page, new RegExp(range));
  assert.match(page, /LARGEST INCREASE/);
  assert.match(page, /LARGEST DECREASE/);
  assert.match(page, /modelscope-price-history-/);
  assert.match(page, /verification_status/);
});

test("price alerts persist locally and run only after manual refresh", () => {
  assert.match(page, /modelscope-alert-rules/);
  assert.match(page, /modelscope-alert-events/);
  assert.match(page, /latestChanges\.flatMap/);
  assert.match(page, /Math\.abs\(change\.percent\) >= rule\.threshold/);
  assert.match(page, /Refresh and evaluate alerts/);
  assert.doesNotMatch(page, /setInterval\(/);
});

test("market brief exposes category, materiality, scenarios, and sources", () => {
  assert.match(page, /Category/);
  assert.match(page, /Materiality/);
  assert.match(page, /High impact/);
  assert.match(page, /Selection impact/);
  assert.match(page, /Official source/);
  assert.match(page, /b\.scenarios\.map/);
});
