import Link from "next/link";
import { ProductShell } from "../product-shell";

export default function PlansPage() {
  return (
    <ProductShell eyebrow="ACCESS & PLANS" title="A complete private-preview product—without a checkout fiction." lede="Version 2.0 is available to authorized site users. There is no billing integration, paid subscription, or cloud team account in this release.">
      <div className="planGrid">
        <article className="featured"><small>CURRENT RELEASE</small><h2>Authorized preview</h2><strong>$0 <i>during private preview</i></strong><ul><li>Full price explorer and cache economics</li><li>Cost calculator, history, alerts, and Market Brief</li><li>Scenario recommendations and regional filters</li><li>Browser-local workspace and personalization</li><li>Fair-use read API, docs, and embed</li></ul><Link href="/?view=prices#main-content">Open product</Link></article>
        <article><small>FOR DEVELOPERS</small><h2>Public read interface</h2><strong>No API key</strong><ul><li>Catalog, comparison, recommendation, health, and status</li><li>OpenAPI 3.1 description</li><li>Five-minute cache policy</li><li>Request tracing and strict validation</li><li>Reads never trigger collection</li></ul><Link href="/api-docs">Read API docs</Link></article>
        <article><small>NOT YET OFFERED</small><h2>Managed team service</h2><strong>Not for sale</strong><ul><li>No remote member accounts today</li><li>No shared cloud workspace today</li><li>No invitation or permission backend today</li><li>No payment method is collected</li><li>Local JSON handoff remains available</li></ul><Link href="/methodology">Review current scope</Link></article>
      </div>
      <aside className="productNotice"><b>Pricing transparency applies to us, too.</b><p>We will not present a paid tier until authentication, shared storage, service commitments, support boundaries, and payment handling actually exist.</p></aside>
    </ProductShell>
  );
}
