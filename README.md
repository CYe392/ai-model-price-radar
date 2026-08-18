# AI Model Price Radar

AI API price intelligence dashboard that compares official pricing, cache economics, regional availability, price history, provider updates, workload costs, and use-case recommendations across leading model providers and API routers.

## Product capabilities

- Manual, server-side refresh from public provider pricing pages and catalogs
- Standard input, cache-read, cache-write, and output price comparison
- Region-aware route availability and native-currency pricing metadata
- Workload cost calculator with configurable cache hit and write rates
- Price history, source-health monitoring, and anomaly quarantine
- Market briefs and scenario recommendations with price/capability priorities
- Responsive English interface designed for North American and European users
- Versioned read-only JSON API, OpenAPI 3.1 document, and embeddable price table
- Browser-local team workspace with governance presets, budget guardrails, decision records, audit history, and portable JSON handoff
- Browser-local personalization with English/Chinese core UI, adaptive themes, density controls, reduced motion, high contrast, keyboard focus, and print support
- Production readiness status, request tracing, security headers, strict public-API validation, error recovery, and an incident/rollback runbook

No provider accounts or paid inference APIs are required for collection. Provider billing pages remain authoritative.

## Development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Validate a release with:

```bash
npm test
npm run lint
```

## Architecture

The application uses React and vinext on Cloudflare Workers. Structured price snapshots, collection runs, and source-health checks are persisted in Cloudflare D1 through Drizzle ORM. Deployment configuration is stored in `.openai/hosting.json`.

Price collection follows a public-pages-only policy: no authentication, no anti-bot bypass, and route changes above 50% are quarantined for review.

## Public API

The production service exposes cached, CORS-enabled read endpoints. Reading these endpoints never starts a provider refresh.

```text
GET /api/v1/catalog
GET /api/v1/compare?region=US&sort=blended&cache_hit=0.6
GET /api/v1/recommend?scenario=openclaw-agents&region=US
GET /api/v1/health
GET /api/v1/status
GET /api/v1/openapi.json
```

Interactive documentation is available at `/api-docs`, and the compact `/embed` page can be placed in an iframe. Public access is fair-use; consumers should cache responses and treat linked provider billing pages as authoritative.

Human-readable production readiness is available at `/status`. Operational response and rollback procedures are documented in [docs/OPERATIONS.md](docs/OPERATIONS.md), and vulnerability reporting guidance is in [SECURITY.md](SECURITY.md).

## Releases

See [CHANGELOG.md](CHANGELOG.md) for versioned product changes. Every phase is delivered as a tested GitHub release and an independently deployable production version.
