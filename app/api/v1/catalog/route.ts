import { filterCatalog, validateCatalogFilters } from "../../../../lib/public-catalog";
import { apiError, apiJson, envelope, optionsResponse, validateQuery } from "../../../../lib/public-api";

export const dynamic = "force-dynamic";
export function OPTIONS() { return optionsResponse(); }

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const queryError = validateQuery(params, ["model", "provider", "region", "compliance"]);
  if (queryError) return apiError(400, "invalid_query", queryError);
  const filterError = validateCatalogFilters(params);
  if (filterError) return apiError(400, "invalid_filter", filterError);
  const routes = filterCatalog(params);
  return apiJson(envelope(routes, { count: routes.length, filters: Object.fromEntries(params) }));
}
