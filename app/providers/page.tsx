import type { Metadata } from "next";
import { CatalogIndex } from "../catalog-pages";
import { ProductShell } from "../product-shell";
import { PUBLIC_PROVIDERS } from "../../lib/discovery";

export const metadata: Metadata = { title: "AI API providers and routers", description: "Browse direct AI API providers, cloud platforms, marketplaces, and routers with route-level prices and regional availability.", alternates: { canonical: "/providers" } };

export default function ProvidersPage() {
  return <ProductShell eyebrow="PROVIDER DIRECTORY" title="Direct APIs, clouds, and routers—side by side." lede="Browse every provider route represented in the public reference catalog, including OpenRouter, OpenCode Go, major clouds, and direct APIs."><CatalogIndex groups={PUBLIC_PROVIDERS} type="provider" /></ProductShell>;
}
