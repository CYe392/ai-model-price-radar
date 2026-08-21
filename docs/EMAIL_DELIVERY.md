# Email delivery operations

ModelScope keeps subscription state in D1 and uses double opt-in. No email address, confirmation token, unsubscribe token, or provider secret is written to the structured request log.

## Required server secrets

- `RESEND_API_KEY`: Resend server API key.
- `RESEND_WEBHOOK_SECRET`: signing secret from the Resend webhook details page; it normally starts with `whsec_`.
- `NEWSLETTER_FROM`: verified sender, for example `ModelScope <updates@example.com>`.
- `NEWSLETTER_ADMIN_TOKEN`: long random bearer token for the manual publication endpoint.

If delivery secrets are absent, subscriptions and delivery records remain queued in D1. The API never exposes a confirmation token as a substitute for real email delivery.

## Publish an update

Update content is versioned in `lib/updates.ts`. After deploying a release, an operator can send one bounded batch with:

```sh
curl -X POST https://YOUR_DOMAIN/api/newsletter/send \
  -H "Authorization: Bearer $NEWSLETTER_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"slug":"email-updates-and-public-briefs"}'
```

The endpoint processes at most 25 active subscribers per request and skips an already-sent publication/subscriber pair. It is intentionally manual and does not collect provider prices.

## Delivery events and suppression

Register `https://YOUR_DOMAIN/api/newsletter/webhook` in Resend for `email.sent`, `email.delivered`, `email.delivery_delayed`, `email.failed`, `email.bounced`, `email.complained`, and `email.suppressed` events. The handler verifies the raw request with `svix-id`, `svix-timestamp`, and `svix-signature`, rejects timestamps outside five minutes, and deduplicates the at-least-once event stream by `svix-id`.

Events update the matching delivery by Resend email ID. Out-of-order older events cannot replace a newer state. Bounce, complaint, and suppression events immediately change the subscriber to `suppressed`, which excludes it from future publication batches.

## Retry failed publications

Retry a bounded batch manually with:

```sh
curl -X POST https://YOUR_DOMAIN/api/newsletter/retry \
  -H "Authorization: Bearer $NEWSLETTER_ADMIN_TOKEN"
```

The endpoint retries at most 10 failed or delayed publication deliveries, only for active subscribers, and stops after three recorded attempts. Confirmation messages are not reconstructed because their one-time plaintext confirmation token is deliberately not stored; the person can submit the subscription form again to receive a new token.

## Data handling

Every delivered message includes a private `/subscription#token=...` link. The fragment is not sent in the initial HTTP request and the client removes it from the address bar before reading preferences. A valid token can update market/language, unsubscribe, or permanently delete the subscriber row; delivery rows are removed by the existing cascade.

Unsubscribing sets the durable status to `unsubscribed`; it does not silently resubscribe or require an account. Permanent deletion is a separate explicit action with a browser confirmation. Review failed and pending rows in `newsletter_deliveries` before retrying a publication.

## Aggregate operations

`GET /api/newsletter/summary` requires the same `NEWSLETTER_ADMIN_TOKEN`. It returns counts grouped by subscription status, market, language, delivery kind, and delivery status. It never returns email addresses, tokens, or subscriber-level rows.

## Manual retention cleanup

Run retention cleanup manually with:

```sh
curl -X POST https://YOUR_DOMAIN/api/newsletter/maintenance \
  -H "Authorization: Bearer $NEWSLETTER_ADMIN_TOKEN"
```

The current policy deletes unconfirmed subscriptions after 30 days, unsubscribed or suppressed subscriber records after 90 days, and processed webhook event IDs after 90 days. Subscriber deletion cascades to delivery history. No scheduled cleanup job is installed.
