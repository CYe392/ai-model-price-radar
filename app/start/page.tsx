import Link from "@/app/app-link";
import { ProductShell } from "../product-shell";

export default function StartPage() {
  return (
    <ProductShell eyebrow="GET STARTED" title="From workload to API shortlist in minutes." lede="Start with the decision you need to make. ModelScope keeps price, region, cache behavior, capability, and source confidence visible at every step.">
      <div className="journeySteps">
        <article><i>01</i><b>Describe the workload</b><p>Choose everyday chat, light development, intensive development, OpenClaw agents, customer support, or long-context RAG. Select pilot, standard, or production volume.</p><Link href="/?view=recommend#main-content">Open API finder →</Link></article>
        <article><i>02</i><b>Apply hard constraints</b><p>Set the user region, purchase or residency stage, compliance profile, risk posture, and a hard or advisory workspace budget.</p><Link href="/?view=workspace#main-content">Configure workspace →</Link></article>
        <article><i>03</i><b>Validate total cost</b><p>Model input, output, cache hits and writes, service mode, credits, subscriptions, fees, and tax before committing to a route.</p><Link href="/?view=calculator#main-content">Open calculator →</Link></article>
        <article><i>04</i><b>Record the decision</b><p>Save the leading recommendation with its score, projected monthly spend, region, compliance context, and confidence. Export the local workspace for handoff.</p><Link href="/?view=recommend#main-content">Build a shortlist →</Link></article>
      </div>
      <aside className="productNotice"><b>Manual by design</b><p>Reading prices, recommendations, history, or APIs never starts a provider collection. Only the Refresh prices button initiates server-side checks of public official sources.</p></aside>
    </ProductShell>
  );
}
