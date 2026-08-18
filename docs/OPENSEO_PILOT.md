# OpenSEO pilot boundary

The pilot is an evaluation workflow, not an autonomous publishing system. OpenSEO or another discovery-analysis tool may read the public `/api/v1/growth/targets` manifest and the linked public pages.

## Allowed pilot work

- Group targets by search intent and entity.
- Identify missing internal links, unclear headings, weak source context, or duplicated answers.
- Compare visible page content with its title, description, canonical URL, and structured data.
- Propose a small, reviewable experiment for a named target page.
- Export findings for a human-authored GitHub change.

## Not allowed

- No direct repository, CMS, deployment, Search Console, email, or IndexNow write access.
- No automatic page generation or keyword-stuffed variants.
- No invented prices, benchmarks, availability, discounts, or provider claims.
- No hidden text or structured data that is absent from the visible page.
- No provider-page collection; source refresh remains a separate authorized manual action.

## Four-week pilot

1. Select five high-priority targets from the manifest and record baseline impressions, referrals, engaged actions, and source exits.
2. Review answer clarity, evidence links, cache/region explanation, and internal navigation.
3. Ship one reviewed product release with the approved improvements and notify IndexNow manually.
4. Compare the same aggregate measures after 28 days. Keep only changes that improve useful discovery without increasing unsupported claims or privacy scope.

Success means better discovery of accurate pages and more useful downstream actions—not raw page-view growth alone.
