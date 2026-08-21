import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import { verifyResendWebhook } from "../lib/resend-webhook.ts";

const key = Buffer.from("modelscope-resend-webhook-test-key");
const secret = `whsec_${key.toString("base64")}`;
const timestamp = "1787270400";
const now = Number(timestamp) * 1000;
const id = "msg_modelscope_test";
const payload = '{"type":"email.delivered","data":{"email_id":"email_123"}}';
const digest = createHmac("sha256", key)
  .update(`${id}.${timestamp}.${payload}`)
  .digest("base64");

test("verifies a valid raw Resend webhook signature", async () => {
  assert.equal(await verifyResendWebhook({ payload, id, timestamp, signature: `v1,${digest}`, secret, now }), true);
});

test("rejects modified payloads and stale timestamps", async () => {
  assert.equal(await verifyResendWebhook({ payload: `${payload} `, id, timestamp, signature: `v1,${digest}`, secret, now }), false);
  assert.equal(await verifyResendWebhook({ payload, id, timestamp, signature: `v1,${digest}`, secret, now: now + 301_000 }), false);
});
