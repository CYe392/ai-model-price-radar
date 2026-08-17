import { index, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const priceSnapshots = sqliteTable("price_snapshots", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  collectedAt: text("collected_at").notNull(),
  model: text("model").notNull(),
  provider: text("provider").notNull(),
  source: text("source").notNull(),
  input: real("input"),
  cached: real("cached"),
  cacheWrite: real("cache_write"),
  output: real("output"),
  currency: text("currency"),
  nativeInput: real("native_input"),
  nativeOutput: real("native_output"),
  listInput: real("list_input"),
  listOutput: real("list_output"),
  discountPercent: real("discount_percent"),
  pricingRegion: text("pricing_region"),
  fxRate: real("fx_rate"),
  fxAsOf: text("fx_as_of"),
  tier: text("tier"),
  accepted: integer("accepted", { mode: "boolean" }).notNull().default(true),
  confidence: text("confidence").notNull().default("structured"),
  changePercent: real("change_percent"),
}, (table) => [
  index("idx_price_snapshots_route_time").on(table.model, table.provider, table.collectedAt),
  index("idx_price_snapshots_collected_at").on(table.collectedAt),
]);

export const collectionRuns = sqliteTable("collection_runs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  collectedAt: text("collected_at").notNull(),
  sourceCount: integer("source_count").notNull(),
  okCount: integer("ok_count").notNull(),
  updateCount: integer("update_count").notNull(),
  rejectedCount: integer("rejected_count").notNull().default(0),
});

export const sourceChecks = sqliteTable("source_checks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  checkedAt: text("checked_at").notNull(),
  sourceId: text("source_id").notNull(),
  sourceName: text("source_name").notNull(),
  url: text("url").notNull(),
  status: text("status").notNull(),
  detail: text("detail").notNull(),
  records: integer("records").notNull().default(0),
}, (table) => [
  index("idx_source_checks_source_time").on(table.sourceId, table.checkedAt),
  index("idx_source_checks_checked_at").on(table.checkedAt),
]);
