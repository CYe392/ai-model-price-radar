import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

test("offers scenario-first discovery for common workloads", () => {
  for (const scenario of [
    "Everyday chat & advice",
    "Light & medium development",
    "Intensive development",
    "OpenClaw & agent automation",
    "Customer support",
    "Long-context RAG",
  ]) assert.match(page, new RegExp(scenario.replace(/[&]/g, "&")));
});

test("uses workload, region, compliance, and risk as hard recommendation inputs", () => {
  assert.match(page, /scenarioInputM/);
  assert.match(page, /routeAvailable\(p, region, availabilityStage\)/);
  assert.match(page, /routeMatchesCompliance\(p, compliance\)/);
  assert.match(page, /riskProfile !== "enterprise" \|\| routePolicy\(p\)\.noTraining/);
  assert.match(page, /contextSize\(m\.context\) >= selectedScenario\.minContext/);
});

test("returns explainable scores, cost, confidence, and alternatives", () => {
  for (const component of ["capability", "cost", "latency", "cache", "trust"])
    assert.match(page, new RegExp(component));
  assert.match(page, /BEST FIT/);
  assert.match(page, /ALTERNATIVES/);
  assert.match(page, /Projected monthly API cost/);
  assert.match(page, /High|Medium|Directional/);
  assert.match(page, /recommendationExclusions/);
});
