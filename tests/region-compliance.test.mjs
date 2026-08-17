import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

test("offers ten explicit market and residency views", () => {
  for (const region of [
    "United States",
    "Canada",
    "European Union",
    "United Kingdom",
    "Mainland China",
    "Hong Kong",
    "Singapore",
    "Japan",
    "Australia",
  ]) assert.match(page, new RegExp(region));
  assert.match(page, /Can register/);
  assert.match(page, /Can purchase/);
  assert.match(page, /Can deploy in-region/);
  assert.match(page, /Data resides in-region/);
});

test("models route-level compliance requirements", () => {
  for (const signal of [
    "GDPR support",
    "ZDR option",
    "Published SLA",
    "No API training",
    "Regional processing",
  ]) assert.match(page, new RegExp(signal));
  assert.match(page, /unavailableReason/);
  assert.match(page, /WHY ROUTES ARE HIDDEN/);
});

test("keeps Qwen China, international, and US routes distinct", () => {
  assert.match(page, /China \(Beijing\)/);
  assert.match(page, /Singapore \/ regional endpoints/);
  assert.match(page, /US \(Virginia\)/);
  assert.match(page, /qwen3\.7-plus-us/);
  assert.match(page, /model-studio\/model-pricing/);
});

test("converts price, recommendations, cost totals, and CSV currency", () => {
  assert.match(page, /currencyRates/);
  assert.match(page, /formatMoney\(p\.input, currency/);
  assert.match(page, /r\.total \* 12 \* currencyRates\[currency\]/);
  for (const currency of ["USD", "EUR", "GBP", "CNY", "JPY", "AUD"])
    assert.match(page, new RegExp(currency));
});
