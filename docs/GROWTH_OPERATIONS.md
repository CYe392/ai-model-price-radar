# Growth operations

## Runtime configuration

- `GROWTH_ADMIN_TOKEN`: long random bearer token shared by the aggregate analytics report and manual IndexNow endpoint.
- `INDEXNOW_KEY`: 8-128 character IndexNow ownership key. The service exposes it at `/api/indexnow/key` only when configured.
- `NEXT_PUBLIC_SITE_URL`: final canonical HTTPS origin used in sitemaps, manifests, and submitted URLs.

Do not commit runtime values. Rotate the admin token after suspected disclosure.

## Aggregate report

With analytics consent, the browser submits an allowlisted event, canonical path, and coarse source category. D1 increments a daily aggregate row. It does not create a visitor or session record.

```sh
curl https://YOUR_DOMAIN/api/analytics/summary \
  -H "Authorization: Bearer $GROWTH_ADMIN_TOKEN"
```

Review 30-day page views, newsletter requests, recommendation starts, and official-source exits by public path. Counts measure actions, not unique people.

## IndexNow

Only paths present in the generated growth manifest can be submitted. The endpoint accepts 1-100 paths and is never called by a page view, price refresh, build, or publication automatically.

```sh
curl -X POST https://YOUR_DOMAIN/api/indexnow \
  -H "Authorization: Bearer $GROWTH_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"paths":["/guide","/models/gpt-5-mini"]}'
```

Use IndexNow after a material public-page addition, update, or deletion. A successful protocol response is a discovery notification, not an indexing or ranking guarantee.

## Privacy checks

Before every release, reject optional consent in a clean browser and verify that no request reaches `/api/analytics/event`. Then grant Analytics and verify that request bodies contain no query string, full referrer, email, workspace state, IP-derived field, or device identifier.
