import { ProductShell } from "../product-shell";

export default function MethodologyPage() {
  return (
    <ProductShell eyebrow="METHODOLOGY" title="Every number should explain where it came from." lede="ModelScope combines published prices with explicit planning assumptions. It does not infer a provider invoice, run hidden benchmarks, or disguise stale data as a fresh observation.">
      <div className="methodSections">
        <article><b>01 · Collection</b><h2>Public pages, manually refreshed</h2><p>Server-side adapters read official public price pages and catalogs without accounts or paid inference APIs. Restricted or structurally changed pages retain the last accepted observation and surface parser health.</p></article>
        <article><b>02 · Acceptance</b><h2>Provenance before novelty</h2><p>Each observation records source, parser version, verification time, and confidence. Changes above the safety threshold are quarantined instead of replacing the accepted value.</p></article>
        <article><b>03 · Cost</b><h2>A workload—not one token price</h2><p>Projected cost separates standard input, cache read, cache write, and output. Service modes, credits, recurring fees, extra fixed fees, and estimated tax remain explicit inputs. Transfer, storage, commitments, and provider-specific rounding are disclosed exclusions.</p><code>monthly = input_miss + cache_read + cache_write + output + subscription + fees + tax − credits</code></article>
        <article><b>04 · Availability</b><h2>Four different regional questions</h2><p>Registration, purchase access, in-region deployment, and documented data residency are modeled separately. A model being purchasable in a market does not imply local processing or residency.</p></article>
        <article><b>05 · Recommendation</b><h2>Hard filters, then explainable ranking</h2><p>Region, access stage, compliance, minimum context, minimum ability, risk posture, and an enforced budget are hard gates. Remaining routes receive visible capability, cost, latency, cache, and trust scores. Ability and latency are editorial planning inputs—not live benchmark claims.</p></article>
        <article><b>06 · Limits</b><h2>Planning intelligence, not a quote</h2><p>Promotions, contracts, taxes, currency conversion, usage tiers, and provider terms can change the final bill. Provider billing pages and agreements remain authoritative.</p></article>
      </div>
    </ProductShell>
  );
}
