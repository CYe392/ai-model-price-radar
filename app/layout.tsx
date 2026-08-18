import type { Metadata } from "next";
import "./globals.css";
import "./newsletter.css";
import "./commercial.css";
import "./commercial-options.css";
import { ConsentManager } from "./consent-manager";
export const metadata: Metadata = {
  metadataBase: new URL("https://modelscope-price-radar.cybercl19.chatgpt.site"),
  title: { default: "ModelScope | AI API Price Intelligence", template: "%s | ModelScope" },
  description: "Compare AI API pricing, cache economics, regional availability, total workload cost, and provider routes from public official sources.",
  applicationName: "ModelScope AI API Price Radar",
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "ModelScope", title: "ModelScope | AI API Price Intelligence", description: "Route-level AI API price intelligence, workload costs, regions, source health, and explainable recommendations.", url: "/" },
  robots: { index: false, follow: false, noarchive: true, nocache: true },
  manifest: "/manifest.webmanifest",
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}<ConsentManager /></body></html>}
