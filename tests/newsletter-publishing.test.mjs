import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const [schema, migration, subscribe, confirm, unsubscribe, preferences, summary, send, form, manager, updates, privacy, operations] = await Promise.all([
  read("../db/schema.ts"),
  read("../drizzle/0004_newsletter.sql"),
  read("../app/api/newsletter/subscribe/route.ts"),
  read("../app/api/newsletter/confirm/route.ts"),
  read("../app/api/newsletter/unsubscribe/route.ts"),
  read("../app/api/newsletter/preferences/route.ts"),
  read("../app/api/newsletter/summary/route.ts"),
  read("../app/api/newsletter/send/route.ts"),
  read("../app/updates/newsletter-form.tsx"),
  read("../app/subscription/subscription-manager.tsx"),
  read("../lib/updates.ts"),
  read("../app/privacy/page.tsx"),
  read("../docs/EMAIL_DELIVERY.md"),
]);

test("persists consent and delivery state in D1", () => {
  assert.match(schema, /newsletterSubscribers/);
  assert.match(schema, /confirmationTokenHash/);
  assert.match(schema, /newsletterDeliveries/);
  assert.match(migration, /CREATE UNIQUE INDEX `uq_newsletter_subscribers_email`/);
  assert.match(migration, /PRAGMA optimize/);
});

test("implements double opt-in without exposing confirmation tokens", () => {
  assert.match(form, /consent.*checkbox/);
  assert.match(subscribe, /hashToken\(confirmationToken\)/);
  assert.match(subscribe, /Check your inbox/);
  assert.doesNotMatch(subscribe, /confirmationToken[,\s]*\n?\s*message/);
  assert.match(confirm, /status = 'active'/);
  assert.match(confirm, /confirmation_token_hash = NULL/);
});

test("supports one-click unsubscribe and bounded manual publication", () => {
  assert.match(unsubscribe, /status = 'unsubscribed'/);
  assert.match(send, /NEWSLETTER_ADMIN_TOKEN/);
  assert.match(send, /LIMIT 25/);
  assert.match(send, /duplicate/);
  assert.match(operations, /intentionally manual/);
});

test("offers private self-service preferences and deletion", () => {
  assert.match(subscribe, /\/subscription#token=/);
  assert.match(send, /Manage preferences or delete my data/);
  assert.match(manager, /window\.location\.hash/);
  assert.match(manager, /history\.replaceState/);
  assert.doesNotMatch(manager, /localStorage|sessionStorage/);
  assert.match(preferences, /maskEmail/);
  assert.match(preferences, /action === "update"/);
  assert.match(preferences, /action === "unsubscribe"/);
  assert.match(preferences, /DELETE FROM newsletter_subscribers/);
});

test("keeps newsletter operations aggregate-only", () => {
  assert.match(summary, /NEWSLETTER_ADMIN_TOKEN/);
  assert.match(summary, /GROUP BY status, region, locale/);
  assert.match(summary, /aggregate-only; no email addresses or subscriber tokens/);
  assert.doesNotMatch(summary, /SELECT email|unsubscribe_token/);
});

test("publishes durable update pages and an accurate privacy notice", () => {
  assert.match(updates, /route-level-price-provenance/);
  assert.match(updates, /manual-refresh-data-trust/);
  assert.match(privacy, /Double opt-in is required/);
  assert.match(privacy, /does not trigger collection/);
  assert.match(privacy, /permanently delete the subscription/);
});
