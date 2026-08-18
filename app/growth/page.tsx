import type { Metadata } from "next";
import Link from "next/link";
import { ProductShell } from "../product-shell";

export const metadata: Metadata = { title: "Growth and measurement methodology", description: "How ModelScope measures useful discovery without user profiles and keeps indexing actions manual.", alternates: { canonical: "/growth" } };

export default function GrowthPage() {
  return <ProductShell eyebrow="GROWTH METHODOLOGY" title="Measure useful discovery—not people." lede="ModelScope uses consented, first-party daily aggregates to improve public information architecture without building user profiles.">
    <div className="commercialGrid">
      <article><h2>What is counted</h2><p>Page views, successful newsletter requests, recommendation starts, and official provider-source clicks are grouped by day, canonical path, event, and coarse source category.</p></article>
      <article><h2>What is never stored</h2><p>No IP address, email, session identifier, device fingerprint, full referrer, search query, or URL query string is placed in the analytics table.</p></article>
      <article><h2>Consent first</h2><p>The client sends no analytics event until the reader enables Analytics in Privacy choices. Rejecting analytics leaves every comparison and recommendation feature available.</p></article>
      <article><h2>Manual distribution</h2><p>IndexNow submissions require an administrator token and an allowlisted public path. OpenSEO receives a read-only target manifest; it cannot publish or rewrite site content.</p></article>
    </div>
    <div className="productNotice"><b>Machine-readable audit surface</b><p>The public <Link href="/api/v1/growth/targets">growth target manifest</Link> is generated from the same model, provider, and update collections as the website. Aggregate results remain private to the operator.</p></div>
  </ProductShell>;
}
