# Changelog

## 1.1.0 — Data Trust and Traceability

- Added route-level verification labels for current, retained, and reference pricing.
- Added official-source links, parser versions, last verification timestamps, and freshness states.
- Persisted price provenance in D1 with a forward migration.
- Retained the last accepted price when an official source is unavailable or changes structure.
- Added an anomaly-review surface for quarantined changes above 50%.
- Added dedicated AWS Bedrock, Azure AI, and SiliconFlow public-page adapters.
- Added regression fixtures for all 12 public pricing adapters.
- Expanded automated release checks for provenance and quarantine behavior.
