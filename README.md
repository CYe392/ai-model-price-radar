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

## Releases

See [CHANGELOG.md](CHANGELOG.md) for versioned product changes. Every phase is delivered as a tested GitHub release and an independently deployable production version.
