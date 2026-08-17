import { desc } from "drizzle-orm";
import { getDb } from "../../../../db";
import { collectionRuns, sourceChecks } from "../../../../db/schema";
import { apiJson, envelope, optionsResponse } from "../../../../lib/public-api";

export const dynamic = "force-dynamic";
export function OPTIONS() { return optionsResponse(); }

export async function GET() {
  try {
    const db = getDb();
    const [runs, checks] = await Promise.all([
      db.select().from(collectionRuns).orderBy(desc(collectionRuns.collectedAt)).limit(1),
      db.select().from(sourceChecks).orderBy(desc(sourceChecks.checkedAt)).limit(100),
    ]);
    const latest = new Map<string, (typeof checks)[number]>();
    for (const check of checks) if (!latest.has(check.sourceId)) latest.set(check.sourceId, check);
    const sources = [...latest.values()];
    return apiJson(envelope({ status: sources.every((item) => item.status === "ok") ? "healthy" : "degraded", last_collection: runs[0] ?? null, sources }, { source_count: sources.length }));
  } catch {
    return apiJson(envelope({ status: "unknown", last_collection: null, sources: [] }, { note: "No collection history is available yet" }), { status: 200 });
  }
}
