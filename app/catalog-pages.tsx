import Link from "@/app/app-link";
import type { CatalogGroup } from "../lib/discovery";
import { money, slugify } from "../lib/discovery";

export function CatalogIndex({ groups, type }: { groups: CatalogGroup[]; type: "model" | "provider" }) {
  return (
    <div className="catalogCards">
      {groups.map((group) => (
        <article key={group.slug}>
          <small>{group.routes.length} {group.routes.length === 1 ? "route" : "routes"}</small>
          <h2><Link href={`/${type}s/${group.slug}`}>{group.name}</Link></h2>
          <p>{group.regions.join(" · ")}</p>
          <dl><div><dt>Lowest input</dt><dd>{money(group.lowestInput)}</dd></div><div><dt>Lowest output</dt><dd>{money(group.lowestOutput)}</dd></div></dl>
          <Link href={`/${type}s/${group.slug}`}>Compare routes →</Link>
        </article>
      ))}
    </div>
  );
}

export function CatalogDetail({ group, type }: { group: CatalogGroup; type: "model" | "provider" }) {
  return (
    <>
      <section className="catalogSummary">
        <div><small>ROUTES</small><strong>{group.routes.length}</strong></div>
        <div><small>LOWEST INPUT / 1M</small><strong>{money(group.lowestInput)}</strong></div>
        <div><small>LOWEST OUTPUT / 1M</small><strong>{money(group.lowestOutput)}</strong></div>
        <div><small>MARKETS</small><strong>{group.regions.length}</strong></div>
      </section>
      <div className="catalogTable" role="region" aria-label={`${group.name} route prices`}>
        <div className="catalogHead"><span>{type === "model" ? "Provider route" : "Model"}</span><span>Input</span><span>Cache hit</span><span>Cache write</span><span>Output</span><span>Regions</span></div>
        {group.routes.map((route) => (
          <article className="catalogRow" key={route.id}>
            <span><Link href={type === "model" ? `/providers/${slugify(route.provider)}` : `/models/${slugify(route.model)}`}>{type === "model" ? route.provider : route.model}</Link><small>{route.model_id}</small></span>
            <strong>{money(route.prices.input)}</strong>
            <strong>{money(route.prices.cached_input)}</strong>
            <strong>{money(route.prices.cache_write)}</strong>
            <strong>{money(route.prices.output)}</strong>
            <span className="catalogRegions">{route.regions.join(", ")}</span>
            <small className="catalogEvidence"><a href={route.source_url} rel="noreferrer" data-analytics-event="provider_outbound">Official source ↗</a> · {route.verification} catalog · {route.context_tokens.toLocaleString()} context tokens</small>
          </article>
        ))}
      </div>
      <div className="productNotice"><b>How to read this table</b><p>Prices are USD per one million tokens. Cache hit and cache write are separate bill components when the provider publishes them. “Not published” does not mean free. This reference catalog must be validated against the linked official source before procurement.</p></div>
    </>
  );
}
