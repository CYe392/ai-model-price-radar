# Changelog

## v2.2.0 — Advertising readiness and consent

- Added a site-wide consent manager with necessary, first-party analytics, and advertising choices; optional categories default to off and can be changed later.
- Added stable, visibly labeled advertising placements that currently render only a first-party house message without third-party tracking.
- Published an advertising policy that separates sponsorship from ranking, price evidence, source health, editorial coverage, and corrections.
- Documented the activation gate for any future advertising network, including regional consent review and Google-certified CMP requirements where applicable.
- Expanded privacy disclosures for the consent record and confirmed that comparison, recommendations, and email updates remain available after rejecting optional uses.

## v2.1.0 — Email updates and publishing foundation

- Added region-aware, double-opt-in email subscriptions backed by Cloudflare D1, with durable consent, confirmation, unsubscribe, and delivery state.
- Added one-click unsubscribe headers and provider-neutral queued delivery, with optional Resend delivery configured entirely through server secrets.
- Added an authenticated, manually triggered publication sender with duplicate-delivery protection and a bounded batch size.
- Added permanent update index and detail pages so product, methodology, and data-trust briefs can be linked, revisited, and cited.
- Expanded the privacy notice and operational documentation for subscriber data, delivery configuration, deletion, and failure handling.
- Preserved manual-only provider price collection: subscriptions and email delivery never trigger source fetching.

## v2.0.1 — Security and maintenance release

- Updated React, the React Server Components runtime, Vinext, Vite, Cloudflare tooling, Tailwind, and related build dependencies to patched compatible versions.
- Kept ESLint on the supported v9 line and TypeScript on v5 to avoid incompatible grouped major upgrades.
- Upgraded GitHub Actions to the current Node 24 based action releases.
- Split weekly dependency updates into production, Cloudflare, lint, TypeScript, and GitHub Actions groups so failures stay isolated and reviewable.
- Preserved the product contract and data model; this release changes maintenance infrastructure rather than user-facing pricing behavior.

## v2.0.0 — Complete product launch

- Added a guided four-step onboarding journey and homepage calls to action that deep-link into recommendations, workspace governance, prices, and the cost calculator.
- Added launch-ready Plans, Methodology, About, Privacy, and Terms pages with explicit boundaries for private-preview access, local data, public-source collection, and features not yet offered.
- Added canonical/Open Graph metadata, a web app manifest, sitemap, and explicit no-index robots policy appropriate for the current private deployment.
- Added a 15-route release smoke suite covering product, policies, readiness, public API, embed, metadata, and recovery surfaces.
- Added GitHub Actions quality gates, weekly dependency updates, a safe bug-report template, contributing rules, and a complete launch/deployment checklist.
- Preserved the core product contract: no provider accounts, no automatic refresh, no invented payment/authentication service, and every release remains independently deployable and rollback-ready.

## v1.9.0 — Security and operational readiness

- Added route-aware CSP, HSTS, content-type, referrer, permissions, framing, and cross-origin resource policies while preserving the public `/embed` contract.
- Added a unique `x-request-id`, Server-Timing, privacy-safe structured request logs, and generic failure responses at the Worker boundary.
- Added strict query allowlists, length/repetition limits, numeric bounds, and shared region/compliance validation across public APIs.
- Added `/api/v1/status` and `/status` for machine-readable and human-readable application, catalog, D1, source, and manual-collection readiness.
- Added dedicated error and 404 recovery pages, a production operations/rollback runbook, and a private vulnerability-reporting policy.

## v1.8.0 — Personalization and accessibility

- Added a browser-local preference center for English or Chinese core UI, system/light/dark themes, comfortable/compact density, reduced motion, and high contrast.
- Added synchronized user-region and display-currency defaults without triggering collection or changing the manual-refresh rule.
- Added skip-to-content navigation, visible keyboard focus, tab semantics, live status announcements, explicit control names, and native document-language updates.
- Added responsive preference layouts, smaller-screen refresh improvements, OS-level reduced-motion support, and a print-friendly comparison view.
- Kept English as the default interface for North American and European users while making the core navigation, hero, pricing controls, status, and notices bilingual.

## v1.7.0 — Private workspace and governance

- Added a browser-local workspace for team responsibility roles, recommendation decisions, and an auditable action history.
- Added balanced, US enterprise, EU regulated, cost sandbox, and Mainland China governance presets that synchronize region, compliance, currency, risk, and budget settings.
- Added advisory and hard monthly API budget guardrails; hard caps exclude over-budget routes before recommendation ranking.
- Added one-click capture of the leading recommendation as a portable decision record.
- Added validated JSON export and import so workspace data can be handed off without an external identity or storage service.
- Made the local-only privacy boundary explicit: roles document responsibility but do not create accounts, permissions, invitations, or cloud sync.

## v1.6.0 — Public API and integrations

- Added versioned CORS-enabled read APIs for catalog, comparison, recommendations, and collection health.
- Added structured response envelopes, validation errors, cache headers, API version metadata, and fair-use guidance.
- Added workload-aware blended comparisons and scenario recommendations with score breakdowns.
- Added an OpenAPI 3.1 document plus cURL, JavaScript, and Python integration examples.
- Added a dedicated developer documentation page and an iframe-friendly price table at `/embed`.
- Kept all public read endpoints separate from the manual provider-refresh workflow.

## v1.5.0 — History, alerts, and Market Brief 2.0

- Added 7-day, 30-day, 90-day, and all-history views with route trends, largest moves, accepted-snapshot counts, and CSV export.
- Added browser-local price alert rules for model, provider, direction, and percentage threshold.
- Kept alerts manual-only: rules are evaluated solely after the user presses Refresh prices, with no background polling.
- Added triggered-event history, enable/disable controls, rule removal, and local persistence without provider accounts.
- Added Market Brief category and materiality filters, regional scope, affected scenarios, official source links, and richer impact analysis.

## v1.4.0 — Recommendation Engine 2.0

- Added scenario-first discovery for everyday chat, light/medium development, intensive development, OpenClaw and agent automation, customer support, and long-context RAG.
- Added pilot, standard, and production workload profiles with explicit input, output, and cache assumptions.
- Added experimental, balanced, and enterprise risk postures and hard minimum ability/context requirements.
- Added explainable capability, cost, latency, cache, and trust scoring with confidence labels.
- Added projected monthly and annual spend, three ranked alternatives, exclusion counts, and operational guardrails.
- Kept region, access stage, compliance, priority, and currency synchronized with every recommendation.

## v1.3.0 — Region, availability, and compliance

- Replaced broad regional buckets with explicit US, Canada, EU, UK, Mainland China, Hong Kong, Singapore, Japan, and Australia views.
- Distinguished account registration, purchasing, in-region deployment, and documented data residency.
- Added GDPR, Zero Data Retention, SLA, no-training, and regional-processing filters with unavailable-route explanations.
- Added route model IDs, residency and retention context, policy badges, and official policy links.
- Split Qwen 3.7 Plus into China, international, and US routes with their regional model IDs and public list prices.
- Added USD, EUR, GBP, CNY, JPY, and AUD planning currency views across comparison, recommendation, calculator, and CSV exports.

## 1.2.0 — Complete Cost Engine

- Added Standard, Batch, Flex, and Priority pricing assumptions with explicit multipliers.
- Added free credits, detected subscription fees, additional fixed fees, and estimated tax.
- Added cache-hit sensitivity analysis across five workload profiles.
- Added auditable CSV export with a full monthly cost breakdown.
- Updated calculator disclosures for excluded transfer, storage, commitments, and rounding.

## 1.1.0 — Data Trust and Traceability

- Added route-level verification labels for current, retained, and reference pricing.
- Added official-source links, parser versions, last verification timestamps, and freshness states.
- Persisted price provenance in D1 with a forward migration.
- Retained the last accepted price when an official source is unavailable or changes structure.
- Added an anomaly-review surface for quarantined changes above 50%.
- Added dedicated AWS Bedrock, Azure AI, and SiliconFlow public-page adapters.
- Added regression fixtures for all 12 public pricing adapters.
- Expanded automated release checks for provenance and quarantine behavior.
