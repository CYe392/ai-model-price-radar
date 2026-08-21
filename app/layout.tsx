import type { Metadata } from "next";
import "./globals.css";
import "./newsletter.css";
import "./commercial.css";
import "./commercial-options.css";
import "./discovery.css";
import "./guide.css";
import "./subscription.css";
import "./newsletter-manage.css";
import { ConsentManager } from "./consent-manager";
import { JsonLd } from "./json-ld";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "../lib/site";
import { AnalyticsTracker } from "./analytics-tracker";
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "ModelScope | AI API Price Intelligence", template: "%s | ModelScope" },
  description: SITE_DESCRIPTION,
  applicationName: "ModelScope AI API Price Radar",
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "ModelScope", title: "ModelScope | AI API Price Intelligence", description: "Route-level AI API price intelligence, workload costs, regions, source health, and explainable recommendations.", url: "/", images: [{ url: "/modelscope-og.png", width: 1740, height: 917, alt: "ModelScope AI API price routes and comparison radar" }] },
  twitter: { card: "summary_large_image", title: "ModelScope | AI API Price Intelligence", description: SITE_DESCRIPTION, images: ["/modelscope-og.png"] },
  robots: { index: true, follow: true, noarchive: false, nocache: false, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  manifest: "/manifest.webmanifest",
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><JsonLd data={[{ "@context": "https://schema.org", "@type": "Organization", name: SITE_NAME, url: SITE_URL }, { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: SITE_URL, description: SITE_DESCRIPTION }]} />{children}<AnalyticsTracker /><ConsentManager /></body></html>}
