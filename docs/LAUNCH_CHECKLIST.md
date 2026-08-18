# v2 launch checklist

## Product truth

- Core price, cache, region, history, health, brief, alerts, recommendation, workspace, and preference workflows are complete.
- Manual refresh remains the only collection trigger.
- Plans page distinguishes free public access from capabilities that do not yet exist.
- Methodology, privacy, terms, security, and operations pages match the implemented system.

## Release gate

- Build and all automated tests pass.
- All saved D1 migrations apply cleanly in order to an empty database.
- ESLint and accessibility rules pass.
- Production dependency audit is reviewed.
- Release smoke covers root, onboarding, product policies, status, API, embed, metadata routes, and 404.
- Git diff is clean and the version/changelog are updated.
- PR is merged; annotated tag and GitHub Release point to the merge commit.

## Deployment gate

- The exact merge commit is pushed to the existing Sites source repository.
- The artifact is built from that source and saved as a new Sites version.
- The saved version is deployed to the approved public production URL.
- Production root, model/provider directories, guide, updates, API finder, calculator, onboarding, plans, methodology, privacy, terms, status, API docs, embed, metadata, and 404 are browser-checked.
- `robots.txt`, canonical URLs, sitemap, RSS, `llms.txt`, Open Graph image, and structured data are verified on the public origin.
- Manual refresh is not invoked during smoke unless source collection itself is the test target.
- Previous saved Sites version remains available for rollback.
