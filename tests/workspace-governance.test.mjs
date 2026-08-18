import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

test("workspace state is local, portable, and transparent about its limits", () => {
  assert.match(page, /modelscope-team-workspace/);
  assert.match(page, /Export JSON/);
  assert.match(page, /Import JSON/);
  assert.match(page, /No sign-in, cloud sync, email invitation, or hidden telemetry/);
  assert.match(page, /Roles document responsibility; they do not create remote accounts/);
});

test("governance presets synchronize region, compliance, currency, risk, and budget", () => {
  for (const preset of [
    "balanced",
    "us-enterprise",
    "eu-regulated",
    "cost-sandbox",
    "china-mainland",
  ]) assert.match(page, new RegExp(preset));
  assert.match(page, /setRegion\(settings\.region\)/);
  assert.match(page, /setCompliance\(settings\.compliance\)/);
  assert.match(page, /setCurrency\(settings\.currency\)/);
  assert.match(page, /setRiskProfile\(settings\.risk\)/);
});

test("hard budget guardrail runs before recommendation ranking", () => {
  assert.match(page, /!workspace\.enforceBudget \|\| candidate\.monthlyUsd <= workspace\.monthlyBudget/);
  assert.match(page, /Routes above budget are excluded before ranking/);
  assert.match(page, /Save decision to workspace/);
});

test("workspace records roles, decisions, and auditable governance actions", () => {
  for (const role of ["Owner", "Editor", "Viewer"])
    assert.match(page, new RegExp(`<option>${role}</option>`));
  assert.match(page, /DECISION RECORDS/);
  assert.match(page, /LOCAL AUDIT LOG/);
  assert.match(page, /Applied \$\{preset\} governance preset/);
  assert.match(page, /Saved \$\{record\.model\} via \$\{record\.provider\}/);
});
