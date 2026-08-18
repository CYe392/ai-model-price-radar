import Link from "next/link";

export default function NotFound() {
  return (
    <main className="recoveryPage">
      <div><i>404</i><b>PAGE NOT FOUND</b><h1>This route is not in the catalog.</h1><p>Return to the price explorer, open the developer documentation, or inspect live service status.</p><span><Link href="/">Price explorer</Link><Link href="/api-docs">Developer API</Link><Link href="/status">Service status</Link></span></div>
    </main>
  );
}
