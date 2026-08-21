import type { Metadata } from "next";
import Link from "@/app/app-link";
import { JsonLd } from "../json-ld";
import { ProductShell } from "../product-shell";
import { absoluteUrl } from "../../lib/site";

const questions = [
  { question: "What does an AI API price include?", answer: "A useful quote separates uncached input, cached-input reads, cache writes when published, and output tokens. It also names the provider route, currency, price region, tier, and observation time." },
  { question: "Is cache-hit pricing controlled by the prompt?", answer: "Not by prompt wording alone. The application workflow and provider cache rules determine whether repeated prefix content is eligible and actually hits. Explicit cache APIs may also charge for writes or storage." },
  { question: "Why does user region change the comparison?", answer: "Model availability, billing region, data processing location, currency, discounts, and compliance options can differ. ModelScope removes routes that do not document support for the selected market before ranking." },
  { question: "Is the cheapest input price the cheapest API?", answer: "Usually not. Output volume, cache behavior, minimum spend, context storage, batch discounts, latency, and model capability can dominate total workload cost." },
  { question: "Are API routers and direct providers comparable?", answer: "Yes at route level, but not as interchangeable products. Routers may add unified billing and routing while direct or cloud routes may offer different residency, enterprise controls, throughput, and contractual terms." },
];

export const metadata: Metadata = { title: "AI API pricing guide", description: "Clear answers about AI API token prices, caching, regions, routers, and total workload cost.", alternates: { canonical: "/guide" } };

export default function GuidePage() {
  return <ProductShell eyebrow="AI API PRICING GUIDE" title="The price table is the start—not the invoice." lede="Use these answers to compare model routes without losing cache, region, workload, and provider context.">
    <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", url: absoluteUrl("/guide"), mainEntity: questions.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }} />
    <div className="guideQuestions">{questions.map((item) => <article key={item.question}><h2>{item.question}</h2><p>{item.answer}</p></article>)}</div>
    <div className="productNotice"><b>Continue with evidence</b><p>Browse <Link href="/models">model price profiles</Link>, <Link href="/providers">provider and router profiles</Link>, or the full <Link href="/methodology">recommendation methodology</Link>. Linked official provider pages remain authoritative.</p></div>
  </ProductShell>;
}
