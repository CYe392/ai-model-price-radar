"use client";

import Link from "next/link";
import { useConsentSettings } from "./consent-manager";

export function AdSlot({ placement }: { placement: string }) {
  const consent = useConsentSettings();
  return (
    <aside className="adSlot" data-placement={placement} data-ad-consent={consent?.advertising ? "granted" : "not-granted"} aria-label="Advertisement">
      <small>ADVERTISEMENT</small>
      <div><b>Independent price intelligence needs aligned sponsors.</b><p>Reserved placement. Sponsors never buy ranking position, data changes, or editorial approval.</p></div>
      <Link href="/advertising">Advertising policy →</Link>
    </aside>
  );
}
