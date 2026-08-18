import Link from "next/link";
import type { ReactNode } from "react";

export function ProductShell({ eyebrow, title, lede, children }: { eyebrow: string; title: string; lede: string; children: ReactNode }) {
  return (
    <main className="productPage">
      <header>
        <Link href="/" className="brand"><i>M</i>ModelScope</Link>
        <nav aria-label="Product"><Link href="/start">Get started</Link><Link href="/methodology">Methodology</Link><Link href="/plans">Plans</Link><Link href="/updates">Updates</Link><Link href="/status">Status</Link></nav>
        <Link className="productCta" href="/?view=recommend#main-content">Find an API</Link>
      </header>
      <section className="productHero"><b>{eyebrow}</b><h1>{title}</h1><p>{lede}</p></section>
      <section className="productBody">{children}</section>
      <footer><span>ModelScope · AI API price intelligence</span><nav><Link href="/updates">Email updates</Link><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><a href="https://github.com/CYe392/ai-model-price-radar">GitHub ↗</a></nav></footer>
    </main>
  );
}
