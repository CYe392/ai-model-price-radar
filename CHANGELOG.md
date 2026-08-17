# Changelog

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
