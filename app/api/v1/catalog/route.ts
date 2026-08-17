import { COMPLIANCE_KEYS, filterCatalog, REGION_CODES } from "../../../../lib/public-catalog";
import { apiError, apiJson, envelope, optionsResponse } from "../../../../lib/public-api";

export const dynamic = "force-dynamic";
export function OPTIONS() { return optionsResponse(); }

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const region = params.get("region")?.toUpperCase();
  const compliance = params.get("compliance");
  if (region && !REGION_CODES.includes(region as (typeof REGION_CODES)[number]))
    return apiError(400, "invalid_region", `region must be one of: ${REGION_CODES.join(", ")}`);
  if (compliance && !COMPLIANCE_KEYS.includes(compliance as (typeof COMPLIANCE_KEYS)[number]))
    return apiError(400, "invalid_compliance", `compliance must be one of: ${COMPLIANCE_KEYS.join(", ")}`);
  const routes = filterCatalog(params);
  return apiJson(envelope(routes, { count: routes.length, filters: Object.fromEntries(params) }));
}
