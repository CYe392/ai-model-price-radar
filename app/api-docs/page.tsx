import Link from "next/link";

const base = "https://modelscope-price-radar.cybercl19.chatgpt.site";

export default function ApiDocsPage() {
  const endpoints = [
    ["GET /api/v1/catalog", "Filter the complete route catalog by model, provider, region, or compliance."],
    ["GET /api/v1/compare", "Rank routes by standard input, cached input, output, or a blended workload price."],
    ["GET /api/v1/recommend", "Return explainable scenario recommendations with workload cost and score breakdown."],
    ["GET /api/v1/health", "Inspect the latest manual collection run and source health."],
    ["GET /api/v1/status", "Inspect production readiness, storage connectivity, catalog availability, and manual-refresh state."],
  ];
  return (
    <main className="apiDocsPage">
      <header>
        <Link href="/" className="brand"><i>M</i>ModelScope</Link>
        <a href="/api/v1/openapi.json">OpenAPI 3.1 ↗</a>
      </header>
      <section className="apiDocsHero">
        <b>PUBLIC READ API · V1</b>
        <h1>Put price intelligence<br />inside your workflow.</h1>
        <p>Stable JSON endpoints, CORS, structured errors, request IDs, five-minute cache headers, and no provider credentials. Reads never trigger a price refresh.</p>
        <div><span>No API key</span><span>Read-only</span><span>Manual collection</span><span>Request tracing</span><span>USD / 1M tokens</span></div>
      </section>
      <section className="apiDocsContent">
        <div>
          <h2>Endpoints</h2>
          {endpoints.map(([name, desc]) => <article key={name}><code>{name}</code><p>{desc}</p></article>)}
          <h2>Query vocabulary</h2>
          <dl>
            <dt>region</dt><dd>US, CA, EU, UK, CN, HK, SG, JP, AU</dd>
            <dt>compliance</dt><dd>gdpr, zdr_option, published_sla, no_api_training, regional_processing</dd>
            <dt>scenario</dt><dd>daily-chat, light-development, intensive-development, openclaw-agents, customer-support, long-context-rag</dd>
          </dl>
        </div>
        <aside>
          <h2>Quick start</h2>
          <small>cURL</small>
          <pre>{`curl "${base}/api/v1/compare?region=US&sort=blended&cache_hit=0.6"`}</pre>
          <small>JavaScript</small>
          <pre>{`const res = await fetch(
  "${base}/api/v1/recommend?scenario=openclaw-agents&region=US"
);
const { data, meta } = await res.json();`}</pre>
          <small>Python</small>
          <pre>{`import requests

data = requests.get(
    "${base}/api/v1/catalog",
    params={"region": "EU", "compliance": "gdpr"},
).json()`}</pre>
          <h2>Embed</h2>
          <pre>{`<iframe
  src="${base}/embed"
  title="AI API prices"
  loading="lazy">
</iframe>`}</pre>
          <p className="apiNotice">Fair-use public access. Cache responses, avoid bulk polling, and link to the official source URL included with each route.</p>
        </aside>
      </section>
    </main>
  );
}
