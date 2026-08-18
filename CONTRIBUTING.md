# Contributing

ModelScope is a private, release-driven product. Keep changes small, auditable, and honest about data confidence and service boundaries.

## Local validation

Use Node.js 22.13 or newer.

```bash
npm ci
npm test
npm run lint
npm run smoke
```

## Product rules

- Provider collection is public-pages-only: no authentication and no anti-bot bypass.
- Manual refresh remains the only collection trigger. Never add a timer, scheduler, page-load fetch, or read-API side effect that starts collection.
- Keep standard input, cache read, cache write, and output pricing distinct.
- Preserve route-level region, source, verification, and compliance context.
- Quarantine anomalous observations; do not overwrite accepted history to make a test pass.
- Do not transmit browser-local workspace, alert, or preference data without an explicit product decision and updated privacy notice.
- Do not claim authentication, shared storage, billing, benchmarks, SLAs, or commercial availability that is not implemented.

## Pull requests and releases

Create a focused branch, add regression tests, run the full release gate, and document user-visible changes. Every product phase is merged through a PR, tagged, published as a GitHub Release, saved as an exact-commit Sites version, deployed, and smoke-tested in production. Never commit deployment tokens or other secrets.
