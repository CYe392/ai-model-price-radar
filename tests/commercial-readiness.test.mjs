import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const [consent, slot, policy, privacy, readiness, layout] = await Promise.all([
  read("../app/consent-manager.tsx"),
  read("../app/ad-slot.tsx"),
  read("../app/advertising/page.tsx"),
  read("../app/privacy/page.tsx"),
  read("../docs/ADVERTISING_READINESS.md"),
  read("../app/layout.tsx"),
]);

test("defaults optional consent categories to off", () => {
  assert.match(consent, /saveConsent\(false, false\)/);
  assert.match(consent, /Reject optional/);
  assert.match(consent, /Necessary/);
  assert.match(layout, /ConsentManager/);
});

test("keeps current ad placements first party and visibly labeled", () => {
  assert.match(slot, /aria-label="Advertisement"/);
  assert.match(slot, /Reserved placement/);
  assert.doesNotMatch(slot, /googlesyndication|doubleclick|adservice/);
  assert.match(policy, /does not ship a third-party ad-network script/);
});

test("publishes commercial and privacy boundaries before activation", () => {
  assert.match(policy, /Advertisers cannot pay to improve/);
  assert.match(privacy, /Optional categories default to off/);
  assert.match(readiness, /Google-certified CMP/);
  assert.match(readiness, /does not load a network/);
});
