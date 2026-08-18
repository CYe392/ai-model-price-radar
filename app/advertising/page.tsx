import type { Metadata } from "next";
import { AdSlot } from "../ad-slot";
import { ProductShell } from "../product-shell";

export const metadata: Metadata = {
  title: "Advertising policy",
  description: "How ModelScope labels advertising and protects rankings, evidence, and editorial independence.",
  alternates: { canonical: "/advertising" },
};

export default function AdvertisingPage() {
  return (
    <ProductShell eyebrow="COMMERCIAL TRANSPARENCY" title="Ads fund access. They do not buy the answer." lede="ModelScope is designed to remain free to readers. Commercial placement is visibly labeled and separated from price data, recommendation ranking, and source review.">
      <div className="commercialGrid">
        <article><h2>Ranking independence</h2><p>Advertisers cannot pay to improve a recommendation score, suppress a lower price, alter a provider-health result, or bypass regional and compliance filters.</p></article>
        <article><h2>Visible labeling</h2><p>Paid placements use the word Advertisement or Sponsored. Product cards, price rows, source evidence, and market briefs are not silently converted into native ads.</p></article>
        <article><h2>Consent before network code</h2><p>Third-party advertising code is disabled by default. A future network may load only after the user grants advertising consent and the deployment has the required regional consent controls.</p></article>
        <article><h2>Conflicts and corrections</h2><p>Sponsorship does not prevent coverage of provider price increases, outages, access limits, or parser failures. Material errors follow the same correction and quarantine rules regardless of advertiser status.</p></article>
      </div>
      <AdSlot placement="advertising-policy-example" />
      <div className="productNotice"><b>Current release</b><p>v2.2 reserves stable placements and records consent, but does not ship a third-party ad-network script. The displayed slot is a first-party house placement.</p></div>
    </ProductShell>
  );
}
