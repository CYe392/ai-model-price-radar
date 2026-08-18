import { filterCatalog, validateCatalogFilters } from "../../../../lib/public-catalog";
import { apiError, apiJson, boundedNumber, envelope, optionsResponse, validateQuery } from "../../../../lib/public-api";

export const dynamic = "force-dynamic";
export function OPTIONS() { return optionsResponse(); }

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const queryError = validateQuery(params, ["model", "provider", "region", "compliance", "sort", "input_share", "cache_hit", "limit"]);
  if (queryError) return apiError(400, "invalid_query", queryError);
  const filterError = validateCatalogFilters(params);
  if (filterError) return apiError(400, "invalid_filter", filterError);
  const metric = params.get("sort") ?? "blended";
  if (!['input', 'cached', 'output', 'blended'].includes(metric))
    return apiError(400, "invalid_sort", "sort must be input, cached, output, or blended");
  const inputShare = boundedNumber(params, "input_share", .8, 0, 1);
  const cacheHit = boundedNumber(params, "cache_hit", .4, 0, 1);
  const limit = boundedNumber(params, "limit", 20, 1, 50, true);
  if (inputShare === null) return apiError(400, "invalid_input_share", "input_share must be a number from 0 to 1");
  if (cacheHit === null) return apiError(400, "invalid_cache_hit", "cache_hit must be a number from 0 to 1");
  if (limit === null) return apiError(400, "invalid_limit", "limit must be an integer from 1 to 50");
  const routes = filterCatalog(params)
    .map((item) => {
      const input = item.prices.input * inputShare * (1 - cacheHit);
      const cached = (item.prices.cached_input ?? item.prices.input) * inputShare * cacheHit;
      const output = item.prices.output * (1 - inputShare);
      return { ...item, blended_price: Number((input + cached + output).toFixed(6)) };
    })
    .sort((a, b) => {
      if (metric === "input") return a.prices.input - b.prices.input;
      if (metric === "cached") return (a.prices.cached_input ?? a.prices.input) - (b.prices.cached_input ?? b.prices.input);
      if (metric === "output") return a.prices.output - b.prices.output;
      return a.blended_price - b.blended_price;
    })
    .slice(0, limit);
  return apiJson(envelope(routes, { count: routes.length, sort: metric, assumptions: { input_share: inputShare, cache_hit: cacheHit } }));
}
