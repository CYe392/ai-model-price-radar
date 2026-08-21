import Link from "@/app/app-link";
import { getServiceStatus } from "../../lib/service-status";

export const dynamic = "force-dynamic";

export default async function StatusPage() {
  const snapshot = await getServiceStatus();
  const components = Object.entries(snapshot.components);
  return (
    <main className="statusPage">
      <header><Link href="/" className="brand"><i>M</i>ModelScope</Link><Link href="/api/v1/status">Status JSON ↗</Link></header>
      <section className="statusHero">
        <b>PRODUCTION READINESS</b>
        <h1>{snapshot.status === "operational" ? "All core systems operational" : "Service operating with degradation"}</h1>
        <p>Live application readiness, public catalog availability, storage connectivity, optional email delivery, and the latest user-initiated provider collection.</p>
        <span className={snapshot.status}>{snapshot.status}</span>
      </section>
      <section className="statusContent">
        <div className="statusGrid">
          {components.map(([name, detail]) => <article key={name}><i className={detail.status === "operational" ? "ok" : detail.status} /><span><b>{name.replaceAll("_", " ")}</b><small>{detail.status}</small></span>{"routes" in detail && <strong>{detail.routes}</strong>}{"checked" in detail && <strong>{detail.checked} checked</strong>}{"configured" in detail && "required" in detail && <strong>{detail.configured}/{detail.required} configured</strong>}</article>)}
        </div>
        <aside>
          <b>COLLECTION POLICY</b>
          <h2>Manual refresh by design</h2>
          <p>No scheduled background collector runs. The latest provider check occurs only after an authorized user presses Refresh prices.</p>
          <dl><dt>Last collection</dt><dd>{snapshot.manual_collection.last_run ? new Date(snapshot.manual_collection.last_run).toLocaleString("en-US") : "Awaiting first manual refresh"}</dd><dt>Accepted updates</dt><dd>{snapshot.manual_collection.accepted_updates ?? "—"}</dd><dt>Quarantined</dt><dd>{snapshot.manual_collection.quarantined_updates ?? "—"}</dd><dt>Email delivery</dt><dd>{snapshot.components.email_delivery.status.replaceAll("_", " ")}</dd><dt>Product version</dt><dd>v{snapshot.version}</dd></dl>
        </aside>
      </section>
      <footer><span>Generated {new Date(snapshot.generated_at).toLocaleString("en-US")}</span><Link href="/">Back to price intelligence</Link></footer>
    </main>
  );
}
