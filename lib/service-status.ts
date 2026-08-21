import { PUBLIC_CATALOG } from "./public-catalog";
import { getNewsletterRuntimeReadiness } from "./newsletter-readiness";

export const PRODUCT_VERSION = "2.8.1";

export async function getServiceStatus() {
  let database: "operational" | "unavailable" = "operational";
  let lastCollection: { collectedAt: string; updateCount: number; rejectedCount: number } | null = null;
  let latestSources: { sourceId: string; sourceName: string; status: string; checkedAt: string }[] = [];
  try {
    const [{ desc }, { getDb }, { collectionRuns, sourceChecks }] = await Promise.all([
      import("drizzle-orm"),
      import("../db"),
      import("../db/schema"),
    ]);
    const db = getDb();
    const [runs, checks] = await Promise.all([
      db.select().from(collectionRuns).orderBy(desc(collectionRuns.collectedAt)).limit(1),
      db.select().from(sourceChecks).orderBy(desc(sourceChecks.checkedAt)).limit(100),
    ]);
    lastCollection = runs[0] ?? null;
    const latest = new Map<string, (typeof checks)[number]>();
    for (const check of checks) if (!latest.has(check.sourceId)) latest.set(check.sourceId, check);
    latestSources = [...latest.values()];
  } catch {
    database = "unavailable";
  }
  const degradedSources = latestSources
    .filter((source) => source.status !== "ok")
    .map((source) => ({ name: source.sourceName, status: source.status, checked_at: source.checkedAt }));
  const sourceState = latestSources.length === 0
    ? "awaiting_manual_refresh"
    : degradedSources.length > 0 ? "degraded" : "operational";
  const status = database === "operational" && sourceState !== "degraded" ? "operational" : "degraded";
  let emailDelivery = getNewsletterRuntimeReadiness();
  try {
    const { env } = await import("cloudflare:workers");
    emailDelivery = getNewsletterRuntimeReadiness(
      env as unknown as Record<string, string | undefined>,
    );
  } catch {
    // Optional delivery remains visibly unconfigured outside the Worker runtime.
  }
  return {
    status,
    version: PRODUCT_VERSION,
    generated_at: new Date().toISOString(),
    components: {
      application: { status: "operational" },
      public_catalog: { status: "operational", routes: PUBLIC_CATALOG.length },
      database: { status: database },
      provider_sources: { status: sourceState, checked: latestSources.length, degraded: degradedSources.length },
      email_delivery: emailDelivery,
    },
    manual_collection: {
      scheduled_refresh: false,
      user_initiated_only: true,
      last_run: lastCollection?.collectedAt ?? null,
      accepted_updates: lastCollection?.updateCount ?? null,
      quarantined_updates: lastCollection?.rejectedCount ?? null,
    },
    degraded_sources: degradedSources,
  };
}
