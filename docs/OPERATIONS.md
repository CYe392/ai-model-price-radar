# Production operations runbook

## Readiness checks

- Open `/status` for the human-readable application, catalog, database, and provider-source state.
- Read `/api/v1/status` for a cached machine-readable readiness snapshot. A `degraded` value does not necessarily mean price comparison is unavailable; the public reference catalog remains independent of D1.
- Read `/api/v1/health` when investigating the latest manual collection and individual source parsers.
- Capture the `x-request-id` response header when reporting a failed request. Edge logs emit the same identifier, path, status, and duration without query values.

## Manual refresh incident

Price collection is user initiated only. There is no scheduler or background poller.

1. Confirm the main comparison page and `/api/v1/catalog` still serve the last accepted/reference catalog.
2. Open Data health and identify sources marked restricted, changed, or failed.
3. Do not bypass anti-bot controls. Inspect the official public page and update only the affected parser/fixture.
4. Run `npm test` and `npm run lint`; changes above the safety threshold must remain quarantined.
5. Deploy a new saved Sites version only after the parser tests and a manual browser refresh pass.

## Rollback

Each phase is a GitHub tag/Release and a saved Sites version. If a production regression occurs:

1. Record the current deployment ID, version ID, commit, time, request ID, and visible impact.
2. Select the previous known-good saved Sites version in the same project and publish it. Do not rebuild old source into a new, unaudited artifact.
3. Verify `/`, `/status`, `/api/v1/catalog`, and `/embed`; confirm that D1 history remains intact.
4. Open a corrective branch from `main`, add a regression test, and publish the next patch version through the standard PR workflow.

## Database and data recovery

- D1 stores accepted snapshots, collection runs, and source checks. Browser-local preferences, alerts, and workspace decisions are not stored server-side.
- Never delete or rewrite price history during an incident. Take a provider-supported backup/export before any schema or data repair.
- Apply forward-only Drizzle migrations, then validate accepted/quarantined counts and the latest source checks.
- If D1 is unavailable, the application should report degraded readiness while continuing to serve the built-in reference catalog.

## Release gate

- Clean diff and intentional commit scope
- `npm test` and `npm run lint`
- Dependency audit reviewed
- GitHub PR merged, tag and Release created
- Exact commit pushed to Sites source, saved as a new version, and deployed
- Production root, status page, public API, embed, and manual-refresh behavior smoke-tested
