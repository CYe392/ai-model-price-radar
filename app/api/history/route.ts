export const dynamic = "force-dynamic";
import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { collectionRuns, priceSnapshots } from "../../../db/schema";

export async function GET() {
  try {
    const db=getDb();
    const snapshots=await db.select().from(priceSnapshots).where(eq(priceSnapshots.accepted,true)).orderBy(desc(priceSnapshots.collectedAt)).limit(100);
    const runs=await db.select().from(collectionRuns).orderBy(desc(collectionRuns.collectedAt)).limit(20);
    return Response.json({snapshots,runs},{headers:{"cache-control":"no-store"}});
  } catch(error) { return Response.json({error:error instanceof Error?error.message:"history unavailable"},{status:500}); }
}
