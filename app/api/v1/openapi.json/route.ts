import { apiJson, optionsResponse } from "../../../../lib/public-api";

export const dynamic = "force-dynamic";
export function OPTIONS() { return optionsResponse(); }

export async function GET(request: Request) {
  const base = new URL(request.url).origin;
  return apiJson({
    openapi: "3.1.0",
    info: {
      title: "ModelScope Price Radar Public API",
      version: "1.1.0",
      description: "Read-only AI model pricing, comparison, recommendation, and collection-health endpoints. Public prices are planning data; provider billing pages remain authoritative.",
    },
    servers: [{ url: `${base}/api/v1` }],
    paths: {
      "/catalog": { get: { summary: "List and filter routes", parameters: ["model", "provider", "region", "compliance"].map((name) => ({ name, in: "query", schema: { type: "string" } })), responses: { "200": { description: "Route catalog" }, "400": { description: "Invalid filter" } } } },
      "/compare": { get: { summary: "Rank routes by a price metric", parameters: ["model", "provider", "region", "compliance", "sort", "input_share", "cache_hit", "limit"].map((name) => ({ name, in: "query", schema: { type: "string" } })), responses: { "200": { description: "Ranked routes" }, "400": { description: "Invalid option" } } } },
      "/recommend": { get: { summary: "Recommend routes for a scenario", parameters: ["scenario", "priority", "region", "compliance", "limit"].map((name) => ({ name, in: "query", schema: { type: "string" } })), responses: { "200": { description: "Recommendations with score breakdown" }, "400": { description: "Invalid scenario or priority" } } } },
      "/health": { get: { summary: "Read collection health", responses: { "200": { description: "Latest collection and source status" } } } },
      "/status": { get: { summary: "Read production readiness", responses: { "200": { description: "Application, catalog, database, and manual-collection readiness" } } } },
    },
    components: {
      schemas: {
        Error: { type: "object", properties: { error: { type: "object", properties: { status: { type: "integer" }, code: { type: "string" }, message: { type: "string" }, details: {} } } } },
      },
    },
  });
}
