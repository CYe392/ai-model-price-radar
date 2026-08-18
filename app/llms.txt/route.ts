import { PUBLIC_MODELS, PUBLIC_PROVIDERS } from "../../lib/discovery";
import { SITE_URL } from "../../lib/site";

export function GET() {
  const content = `# ModelScope

> Route-level AI API price intelligence from public official sources. Prices are planning data, not provider quotes. Provider billing pages remain authoritative.

## Core resources
- Product: ${SITE_URL}/
- AI API pricing guide: ${SITE_URL}/guide
- Methodology: ${SITE_URL}/methodology
- Models directory (${PUBLIC_MODELS.length} profiles): ${SITE_URL}/models
- Providers and routers directory (${PUBLIC_PROVIDERS.length} profiles): ${SITE_URL}/providers
- Permanent updates: ${SITE_URL}/updates
- Source and service status: ${SITE_URL}/status
- Public API documentation: ${SITE_URL}/api-docs
- Machine catalog: ${SITE_URL}/api/v1/catalog
- OpenAPI document: ${SITE_URL}/api/v1/openapi.json

## Data interpretation
- Currency and unit: USD per one million tokens unless a page explicitly says otherwise.
- Input, cache hit, cache write, and output are separate bill components.
- Regional availability is a hard route filter.
- “Not published” never means free.
- Price collection is manual only; page views and API reads do not refresh sources.

## Crawl policy
- Search and user-request discovery are allowed.
- GPTBot training crawl is disallowed in robots.txt.
`;
  return new Response(content, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
