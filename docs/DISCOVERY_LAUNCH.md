# Public discovery launch

v2.3 makes public product and editorial pages indexable. Standard HTML, descriptive internal links, canonical URLs, `robots.txt`, and `sitemap.xml` are the authoritative discovery layer. JSON-LD, RSS, and `llms.txt` supplement that layer rather than replacing it.

## Crawler policy

- Googlebot and Bingbot: allowed on public pages.
- OAI-SearchBot and ChatGPT-User: allowed on public pages for search and user-request discovery.
- GPTBot: disallowed as a separate training-crawl choice.
- Newsletter actions and the authorized price-refresh endpoint: disallowed from crawling.

This separation follows current publisher guidance: search discovery and potential model training are different controls.

## Production-domain checklist

1. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin before building.
2. Confirm anonymous access to every URL in `sitemap.xml`.
3. Verify the domain in Google Search Console and Bing Webmaster Tools.
4. Submit `/sitemap.xml`; add `/feed.xml` where recent-feed discovery is supported.
5. Inspect representative model, provider, guide, and update pages in the search-engine URL inspection tools.
6. Validate JSON-LD against the rendered, visible page content. Structured data must never claim prices or features that the page does not show.
7. Review Cloudflare bot controls so allowed crawlers are not accidentally challenged at the edge.
8. Activate IndexNow only after the final domain and key-file ownership mechanism are configured; do not embed a reusable key in source control.

## Content maintenance

Update `dateModified` only when the page data or explanation materially changes. Add new model, provider, and update URLs through their source collections so sitemap and machine maps remain synchronized.
