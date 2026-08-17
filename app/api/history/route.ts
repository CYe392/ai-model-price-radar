export const dynamic = "force-dynamic";
import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import {
  collectionRuns,
  priceSnapshots,
  sourceChecks,
} from "../../../db/schema";

export async function GET() {
  try {
    const db = getDb();
    const snapshots = await db
      .select()
      .from(priceSnapshots)
      .where(eq(priceSnapshots.accepted, true))
      .orderBy(desc(priceSnapshots.collectedAt))
      .limit(100);
    const quarantined = await db
      .select()
      .from(priceSnapshots)
      .where(eq(priceSnapshots.accepted, false))
      .orderBy(desc(priceSnapshots.collectedAt))
      .limit(50);
    const runs = await db
      .select()
      .from(collectionRuns)
      .orderBy(desc(collectionRuns.collectedAt))
      .limit(20);
    const checks = await db
      .select()
      .from(sourceChecks)
      .orderBy(desc(sourceChecks.checkedAt))
      .limit(200);
    return Response.json(
      { snapshots, quarantined, runs, checks },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "history unavailable" },
      { status: 500 },
    );
  }
}
