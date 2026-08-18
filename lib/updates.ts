export type ProductUpdate = {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  category: "Product" | "Data quality" | "Methodology";
  readingMinutes: number;
  sections: Array<{ heading: string; paragraphs: string[] }>;
};

export const PRODUCT_UPDATES: ProductUpdate[] = [
  {
    slug: "email-updates-and-public-briefs",
    title: "Email updates and durable public briefs",
    summary:
      "ModelScope now supports double-opt-in email subscriptions and permanent update pages that can be cited and revisited.",
    publishedAt: "2026-08-18",
    category: "Product",
    readingMinutes: 3,
    sections: [
      {
        heading: "What changed",
        paragraphs: [
          "Readers can subscribe by region and confirm ownership of their email address before receiving any update.",
          "Every message includes a one-click unsubscribe route. Subscriber state and delivery records are stored in the service database rather than browser storage.",
        ],
      },
      {
        heading: "What stays manual",
        paragraphs: [
          "Email delivery does not refresh provider prices. Price collection still begins only when an authorized operator presses the manual refresh control.",
        ],
      },
    ],
  },
  {
    slug: "route-level-price-provenance",
    title: "Why price provenance belongs at route level",
    summary:
      "A model name is not a complete price quote: provider route, region, cache mode, tier, currency, and observation time all matter.",
    publishedAt: "2026-08-17",
    category: "Methodology",
    readingMinutes: 4,
    sections: [
      {
        heading: "The comparison unit",
        paragraphs: [
          "ModelScope treats each provider route as a distinct offer. The same model can have different input, output, cache-read, and cache-write rates across routes.",
          "Regional availability is a hard filter, not a cosmetic label. A route that cannot serve the selected market is removed before ranking.",
        ],
      },
      {
        heading: "How to interpret confidence",
        paragraphs: [
          "Structured official pricing receives the strongest confidence. Ambiguous or materially changed observations are quarantined for review instead of silently replacing a trusted value.",
        ],
      },
    ],
  },
  {
    slug: "manual-refresh-data-trust",
    title: "Manual refresh is a data-trust feature",
    summary:
      "Price collection remains an explicit operator action so every snapshot has a visible trigger, source-health result, and audit trail.",
    publishedAt: "2026-08-16",
    category: "Data quality",
    readingMinutes: 3,
    sections: [
      {
        heading: "No hidden background collection",
        paragraphs: [
          "Reading the dashboard, using filters, or calling a public comparison endpoint never causes provider pages to be fetched.",
          "The refresh workflow records collection runs, parser health, accepted observations, and quarantined observations separately.",
        ],
      },
      {
        heading: "Why this matters",
        paragraphs: [
          "A deliberate refresh makes it easier to explain when data changed and to recover when an official pricing page changes structure.",
        ],
      },
    ],
  },
];

export function getProductUpdate(slug: string) {
  return PRODUCT_UPDATES.find((update) => update.slug === slug);
}
