"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useConsentSettings } from "./consent-manager";

type AnalyticsEvent = "page_view" | "newsletter_subscribe" | "recommendation_start" | "provider_outbound" | "pricing_guide_view";

function sourceCategory() {
  const campaign = new URLSearchParams(globalThis.location.search).get("utm_source")?.toLowerCase();
  if (campaign?.includes("chatgpt")) return "chatgpt";
  if (campaign?.includes("openai")) return "openai";
  const referrer = document.referrer;
  if (!referrer) return "direct";
  try {
    const host = new URL(referrer).hostname;
    if (host.includes("google.")) return "google";
    if (host.includes("bing.")) return "bing";
    if (host.endsWith("chatgpt.com")) return "chatgpt";
    if (host.endsWith("openai.com")) return "openai";
  } catch {
    return "other";
  }
  return "other";
}

function hasAnalyticsConsent() {
  try {
    return JSON.parse(localStorage.getItem("modelscope-consent-v1") ?? "null")?.analytics === true;
  } catch {
    return false;
  }
}

export function trackAnalyticsEvent(event: AnalyticsEvent, path = globalThis.location?.pathname ?? "/") {
  if (!hasAnalyticsConsent()) return;
  void fetch("/api/analytics/event", {
    method: "POST",
    keepalive: true,
    headers: { "content-type": "application/json", "x-modelscope-consent": "analytics-v1" },
    body: JSON.stringify({ event, path, source: sourceCategory() }),
  }).catch(() => undefined);
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const consent = useConsentSettings();

  useEffect(() => {
    if (consent?.analytics && pathname) trackAnalyticsEvent("page_view", pathname);
  }, [consent?.analytics, pathname]);

  useEffect(() => {
    function trackClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-analytics-event]") : null;
      const name = target?.dataset.analyticsEvent as AnalyticsEvent | undefined;
      if (name) trackAnalyticsEvent(name);
    }
    document.addEventListener("click", trackClick);
    return () => document.removeEventListener("click", trackClick);
  }, []);

  return null;
}
