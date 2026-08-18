import { GROWTH_TARGETS } from "../../../../../lib/growth-targets";

export function GET() {
  return Response.json({ version: "2026-08-18", generated_from: "public-catalog-and-updates", targets: GROWTH_TARGETS }, { headers: { "cache-control": "public, max-age=300", "access-control-allow-origin": "*" } });
}
