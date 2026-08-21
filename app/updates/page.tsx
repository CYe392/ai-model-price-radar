import type { Metadata } from "next";
import Link from "next/link";
import { ProductShell } from "../product-shell";
import { PRODUCT_UPDATES } from "../../lib/updates";
import { NewsletterForm } from "./newsletter-form";
import { AdSlot } from "../ad-slot";

export const metadata: Metadata = {
  title: "Updates",
  description: "Permanent ModelScope product, methodology, and AI API price-intelligence updates.",
  alternates: { canonical: "/updates" },
};

export default async function UpdatesPage({ searchParams }: { searchParams: Promise<{ subscription?: string }> }) {
  const { subscription } = await searchParams;
  return (
    <ProductShell eyebrow="UPDATES" title="Changes worth understanding." lede="Permanent briefs explain what changed, what it affects, and how ModelScope handles the underlying evidence.">
      <NewsletterForm subscriptionStatus={subscription} />
      <p className="newsletterManageNote">Already subscribed? Use the private Manage preferences link included in every ModelScope email to update your market or language, unsubscribe, or delete your subscription data.</p>
      <AdSlot placement="updates-leaderboard" />
      <div className="updateList">
        {PRODUCT_UPDATES.map((update) => (
          <article key={update.slug}>
            <small>{update.category} · {update.publishedAt} · {update.readingMinutes} min</small>
            <h2><Link href={`/updates/${update.slug}`}>{update.title}</Link></h2>
            <p>{update.summary}</p>
            <Link href={`/updates/${update.slug}`}>Read update →</Link>
          </article>
        ))}
      </div>
    </ProductShell>
  );
}
