import { apiJson, envelope, optionsResponse } from "../../../../lib/public-api";
import { getServiceStatus } from "../../../../lib/service-status";

export const dynamic = "force-dynamic";
export function OPTIONS() { return optionsResponse(); }

export async function GET() {
  const status = await getServiceStatus();
  return apiJson(envelope(status, {
    readiness: status.status,
    refresh_policy: "manual-only",
  }), { status: 200, headers: { "cache-control": "public, max-age=60, stale-while-revalidate=300" } });
}
