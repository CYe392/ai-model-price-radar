import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "ModelScope | AI API Price Intelligence", description: "Compare AI API pricing, cache economics, regional availability, and provider routes from public official sources." };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
