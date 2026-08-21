import { PUBLIC_CATALOG } from "../../lib/public-catalog";
import Link from "@/app/app-link";

export default function EmbedPage() {
  const routes = [...PUBLIC_CATALOG]
    .sort((a, b) => (a.prices.input + a.prices.output) - (b.prices.input + b.prices.output))
    .slice(0, 8);
  return (
    <main className="embedPage">
      <div className="embedHeader"><div><i>M</i><span><b>ModelScope</b><small>AI API price radar</small></span></div><Link href="/" target="_blank">Open explorer ↗</Link></div>
      <div className="embedHead"><span>Model / route</span><span>Input</span><span>Cache</span><span>Output</span></div>
      {routes.map((route, index) => (
        <article key={route.id}>
          <span><b>{route.model}</b><small>{route.provider}</small></span>
          <code>${route.prices.input.toFixed(3)}</code>
          <code>{route.prices.cached_input == null ? "—" : `$${route.prices.cached_input.toFixed(4)}`}</code>
          <code>${route.prices.output.toFixed(2)}</code>
          {index === 0 && <em>LOWEST BLENDED</em>}
        </article>
      ))}
      <footer>USD per 1M tokens · Public planning data · No automatic refresh</footer>
    </main>
  );
}
