import Link from "next/link";
import { ProductShell } from "../product-shell";

export default function AboutPage() {
  return (
    <ProductShell eyebrow="ABOUT MODELSCOPE" title="Price intelligence for choosing an AI API—not another model leaderboard." lede="The hard part is rarely finding a model name. It is understanding the route, region, cache economics, operational constraints, and total workload cost behind that name.">
      <div className="principleGrid"><article><i>◎</i><b>Route-level truth</b><p>Compare direct providers, clouds, and API routers separately because the same model can have different prices, cache policies, regions, and terms.</p></article><article><i>↻</i><b>Manual freshness</b><p>You decide when public sources are checked. The product never creates background traffic or surprise refresh behavior.</p></article><article><i>◇</i><b>Scenario first</b><p>Start from everyday chat, development, agents, support, or RAG; then explain why each shortlisted route fits.</p></article><article><i>▦</i><b>Portable decisions</b><p>Save budgets, roles, and decisions locally and export JSON without signing every team member into another cloud product.</p></article></div>
      <aside className="productNotice"><b>Built for inspectability</b><p>Source links, pricing assumptions, scoring inputs, health state, API schemas, release notes, security policy, and the operations runbook are all part of the product. <Link href="/methodology">Read the methodology →</Link></p></aside>
    </ProductShell>
  );
}
