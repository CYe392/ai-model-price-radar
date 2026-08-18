# Email delivery operations

ModelScope keeps subscription state in D1 and uses double opt-in. No email address, confirmation token, unsubscribe token, or provider secret is written to the structured request log.

## Required server secrets

- `RESEND_API_KEY`: Resend server API key.
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

## Data handling

Subscriber deletion and access requests must be handled by the site operator. Unsubscribing sets the durable status to `unsubscribed`; it does not silently resubscribe or require an account. Review failed and pending rows in `newsletter_deliveries` before retrying a publication.
