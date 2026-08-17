import { filterCatalog } from "../../../../lib/public-catalog";
import { apiError, apiJson, envelope, optionsResponse } from "../../../../lib/public-api";

export const dynamic = "force-dynamic";
export function OPTIONS() { return optionsResponse(); }

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const metric = params.get("sort") ?? "blended";
  if (!['input', 'cached', 'output', 'blended'].includes(metric))
    return apiError(400, "invalid_sort", "sort must be input, cached, output, or blended");
  const inputShare = Math.min(1, Math.max(0, Number(params.get("input_share") ?? .8)));
  const cacheHit = Math.min(1, Math.max(0, Number(params.get("cache_hit") ?? .4)));
  const limit = Math.min(50, Math.max(1, Number(params.get("limit") ?? 20)));
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
