"use client";

import { useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "modelscope-consent-v1";
const CHANGE_EVENT = "modelscope-consent-change";

export type ConsentSettings = {
  version: 1;
  analytics: boolean;
  advertising: boolean;
  savedAt: string;
};

function subscribe(callback: () => void) {
  globalThis.addEventListener("storage", callback);
  globalThis.addEventListener(CHANGE_EVENT, callback);
  return () => {
    globalThis.removeEventListener("storage", callback);
    globalThis.removeEventListener(CHANGE_EVENT, callback);
  };
}

function getSnapshot() {
  return globalThis.localStorage?.getItem(STORAGE_KEY) ?? "";
}

export function useConsentSettings() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => "loading");
  if (!raw || raw === "loading") return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ConsentSettings>;
    if (parsed.version !== 1) return null;
    return {
      version: 1 as const,
      analytics: parsed.analytics === true,
      advertising: parsed.advertising === true,
      savedAt: typeof parsed.savedAt === "string" ? parsed.savedAt : "",
    };
  } catch {
    return null;
  }
}

function saveConsent(analytics: boolean, advertising: boolean) {
  const value: ConsentSettings = {
    version: 1,
    analytics,
    advertising,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  globalThis.dispatchEvent(new Event(CHANGE_EVENT));
}

export function ConsentManager() {
  const consent = useConsentSettings();
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);
  const shouldAsk = consent === null;

  function openSettings() {
    setAnalytics(consent?.analytics ?? false);
    setAdvertising(consent?.advertising ?? false);
    setOpen(true);
  }

  function save() {
    saveConsent(analytics, advertising);
    setOpen(false);
  }

  return (
    <>
      {shouldAsk ? (
        <section className="consentBanner" aria-label="Privacy choices">
          <div><b>Your privacy choices</b><p>Necessary storage keeps the product working. Analytics and advertising remain off unless you choose them.</p></div>
          <span><button onClick={() => saveConsent(false, false)}>Reject optional</button><button onClick={openSettings}>Customize</button><button className="primary" onClick={() => saveConsent(true, true)}>Allow all</button></span>
        </section>
      ) : null}
      <button className="privacyChoices" onClick={openSettings}>Privacy choices</button>
      {open ? (
        <div className="consentBackdrop" role="presentation">
          <section className="consentDialog" role="dialog" aria-modal="true" aria-labelledby="consent-title">
            <b>PRIVACY CONTROL</b><h2 id="consent-title">Choose optional data uses.</h2>
            <p>Changing these settings never affects access to price comparisons, recommendations, or updates.</p>
            <div className="consentOption"><span><strong>Necessary</strong><small>Security, consent record, and core interface state.</small></span><input aria-label="Necessary storage" type="checkbox" checked disabled /></div>
            <div className="consentOption"><span><strong>Analytics</strong><small>First-party, aggregate product usage measurement.</small></span><input aria-label="Analytics consent" type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} /></div>
            <div className="consentOption"><span><strong>Advertising</strong><small>Permission to load a configured advertising network. None is loaded in v2.2 by default.</small></span><input aria-label="Advertising consent" type="checkbox" checked={advertising} onChange={(event) => setAdvertising(event.target.checked)} /></div>
            <footer><button onClick={() => setOpen(false)}>Cancel</button><button className="primary" onClick={save}>Save choices</button></footer>
          </section>
        </div>
      ) : null}
    </>
  );
}
