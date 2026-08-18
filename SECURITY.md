# Security policy

## Supported versions

Security fixes are applied to the current production release. Older GitHub tags and saved Sites versions exist for rollback and auditability, not ongoing support.

## Reporting a vulnerability

Report suspected vulnerabilities privately through GitHub private vulnerability reporting for this repository when available, or contact the repository owner through a private channel. Do not include credentials, private user data, exploit details, or unredacted request logs in a public issue.

Please include the affected route, observed behavior, impact, reproduction steps, release version, and the `x-request-id` response header when available. You should receive an acknowledgement before any public disclosure; remediation timing depends on severity and reproducibility.

## Security boundaries

- Provider collection uses public pages only: no provider credentials and no anti-bot bypass.
- Public API routes are read-only and cannot start price collection.
- Team workspace records, alerts, and interface preferences remain in the browser unless a user explicitly exports them.
- Responses include CSP, content-type protection, a restricted permissions policy, referrer policy, HSTS, request tracing, and route-aware framing controls.
- `/embed` intentionally allows cross-site framing; other application pages use same-origin framing protection.
- Secrets and short-lived deployment credentials must never be committed, logged, persisted in configuration, or copied into issue reports.
