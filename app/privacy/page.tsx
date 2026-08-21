import { ProductShell } from "../product-shell";

export default function PrivacyPage() {
  return (
    <ProductShell eyebrow="PRIVACY" title="Collect less. Explain what remains." lede="This notice describes the v2.6 product, optional email updates, privacy choices, and aggregate measurement.">
      <div className="policyCopy">
        <h2>Browser-local product data</h2>
        <p>Price alert rules and events, interface preferences, workspace settings, responsibility-role labels, audit entries, and saved recommendation decisions are stored in your browser. They are not synchronized to a ModelScope user account because this release has no product account or cloud workspace service. Exporting workspace JSON is an explicit user action.</p>
        <h2>Privacy choices</h2>
        <p>The consent manager stores a versioned choice, optional analytics and advertising permissions, and the time saved in your browser. Necessary storage remains available so the site can remember your choice. Optional categories default to off; rejecting them does not block price comparison, recommendations, public updates, or email subscription.</p>
        <h2>Aggregate analytics</h2>
        <p>If Analytics is enabled, ModelScope stores daily totals grouped by event, canonical path, and coarse source category. The analytics table does not store IP addresses, email addresses, session identifiers, device fingerprints, full referrers, search terms, or URL query strings. Aggregate reports are restricted to the operator.</p>
        <h2>Email subscriptions</h2>
        <p>If you subscribe, ModelScope stores your email address, selected market, language, consent and subscription timestamps, confirmation state, unsubscribe token, and delivery status in Cloudflare D1. Double opt-in is required. Every delivered update includes an unsubscribe link and a private preference link. The preference token is placed in the URL fragment, removed from the address bar after loading, and is not sent in the initial page request.</p>
        <h2>Server-side operational data</h2>
        <p>The service stores accepted price snapshots, collection runs, source-parser health, newsletter delivery records, and consented daily analytics aggregates in Cloudflare D1. Edge request logs contain a generated request ID, method, path, response status, and duration. The application deliberately does not add query values, email addresses, browser-local workspace contents, or provider credentials to its structured request log.</p>
        <h2>Advertising</h2>
        <p>v2.6 does not load a third-party advertising network. Reserved slots display a first-party house message. A future network activation requires advertising consent and a separate regional compliance review; sponsored placement cannot alter ranking or editorial evidence.</p>
        <h2>Manual source collection and indexing</h2>
        <p>Provider pages are fetched only after an authorized user presses Refresh prices. Reading the UI, changing consent, subscribing, receiving an email, or using the public API does not trigger collection. Search-engine notifications are separate, administrator-authorized actions and never fetch provider pricing.</p>
        <h2>Third parties and links</h2>
        <p>The deployment infrastructure processes network metadata needed to serve the site. When email delivery is configured, Resend processes the address and message required for delivery. Official source and GitHub links take you to third-party services governed by their own policies.</p>
        <h2>Your choices</h2>
        <p>Use Privacy choices to change optional categories. Use the private Manage preferences link in any email to change market or language, unsubscribe, or permanently delete the subscription and its delivery history. Use Reset display defaults for interface preferences. Remove alert rules, triggered events, roles, and decisions in their product views. Clear site storage in your browser to remove all remaining browser-local product data.</p>
      </div>
    </ProductShell>
  );
}
