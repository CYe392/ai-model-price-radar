import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const priceSnapshots = sqliteTable(
  "price_snapshots",
  {
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
  sourceUrl: text("source_url"),
  parserVersion: text("parser_version").notNull().default("legacy"),
  verificationStatus: text("verification_status")
    .notNull()
    .default("verified"),
  accepted: integer("accepted", { mode: "boolean" }).notNull().default(true),
    confidence: text("confidence").notNull().default("structured"),
    changePercent: real("change_percent"),
  },
  (table) => [
    index("idx_price_snapshots_route_time").on(
      table.model,
      table.provider,
      table.collectedAt,
    ),
    index("idx_price_snapshots_collected_at").on(table.collectedAt),
  ],
);

export const collectionRuns = sqliteTable("collection_runs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  collectedAt: text("collected_at").notNull(),
  sourceCount: integer("source_count").notNull(),
  okCount: integer("ok_count").notNull(),
  updateCount: integer("update_count").notNull(),
  rejectedCount: integer("rejected_count").notNull().default(0),
});

export const sourceChecks = sqliteTable(
  "source_checks",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    checkedAt: text("checked_at").notNull(),
    sourceId: text("source_id").notNull(),
    sourceName: text("source_name").notNull(),
    url: text("url").notNull(),
    status: text("status").notNull(),
    detail: text("detail").notNull(),
    records: integer("records").notNull().default(0),
  },
  (table) => [
    index("idx_source_checks_source_time").on(table.sourceId, table.checkedAt),
    index("idx_source_checks_checked_at").on(table.checkedAt),
  ],
);

export const newsletterSubscribers = sqliteTable(
  "newsletter_subscribers",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email").notNull(),
    emailNormalized: text("email_normalized").notNull(),
    locale: text("locale").notNull().default("en"),
    region: text("region").notNull().default("global"),
    status: text("status").notNull().default("pending"),
    confirmationTokenHash: text("confirmation_token_hash"),
    unsubscribeToken: text("unsubscribe_token").notNull(),
    consentSource: text("consent_source").notNull().default("updates-page"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
    confirmedAt: text("confirmed_at"),
    unsubscribedAt: text("unsubscribed_at"),
  },
  (table) => [
    uniqueIndex("uq_newsletter_subscribers_email").on(table.emailNormalized),
    uniqueIndex("uq_newsletter_subscribers_confirmation_token").on(
      table.confirmationTokenHash,
    ),
    uniqueIndex("uq_newsletter_subscribers_unsubscribe_token").on(
      table.unsubscribeToken,
    ),
    index("idx_newsletter_subscribers_status").on(table.status),
  ],
);

export const newsletterDeliveries = sqliteTable(
  "newsletter_deliveries",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    subscriberId: integer("subscriber_id")
      .notNull()
      .references(() => newsletterSubscribers.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    publicationSlug: text("publication_slug"),
    status: text("status").notNull().default("pending"),
    providerMessageId: text("provider_message_id"),
    error: text("error"),
    createdAt: text("created_at").notNull(),
    sentAt: text("sent_at"),
  },
  (table) => [
    index("idx_newsletter_deliveries_status_created").on(
      table.status,
      table.createdAt,
    ),
    index("idx_newsletter_deliveries_subscriber").on(table.subscriberId),
  ],
);

export const analyticsDaily = sqliteTable(
  "analytics_daily",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    day: text("day").notNull(),
    event: text("event").notNull(),
    path: text("path").notNull(),
    source: text("source").notNull().default("direct"),
    count: integer("count").notNull().default(1),
    lastSeenAt: text("last_seen_at").notNull(),
  },
  (table) => [
    uniqueIndex("uq_analytics_daily_dimensions").on(
      table.day,
      table.event,
      table.path,
      table.source,
    ),
    index("idx_analytics_daily_day_event").on(table.day, table.event),
  ],
);

export const refreshLease = sqliteTable("refresh_lease", {
  id: text("id").primaryKey(),
  startedAt: text("started_at").notNull(),
  expiresAt: integer("expires_at").notNull(),
  completedAt: text("completed_at"),
  status: text("status").notNull().default("running"),
});
