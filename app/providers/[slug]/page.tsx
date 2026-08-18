import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogDetail } from "../../catalog-pages";
import { JsonLd } from "../../json-ld";
import { ProductShell } from "../../product-shell";
import { getPublicProvider, PUBLIC_PROVIDERS } from "../../../lib/discovery";
import { absoluteUrl } from "../../../lib/site";

export function generateStaticParams() { return PUBLIC_PROVIDERS.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const provider = getPublicProvider((await params).slug);
  if (!provider) return { title: "Provider not found" };
  return { title: `${provider.name} model API pricing`, description: `Compare ${provider.name} AI API input, cache, cache-write, output, and regional availability across ${provider.routes.length} model routes.`, alternates: { canonical: `/providers/${provider.slug}` } };
}

export default async function ProviderPage({ params }: { params: Promise<{ slug: string }> }) {
  const provider = getPublicProvider((await params).slug);
  if (!provider) notFound();
  return <ProductShell eyebrow="PROVIDER PRICE PROFILE" title={`${provider.name} model API pricing`} lede={`Compare ${provider.routes.length} documented model routes and availability across ${provider.regions.length} market codes.`}><JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: `${provider.name} model API pricing`, description: `Route-level pricing and regional availability for ${provider.name}.`, url: absoluteUrl(`/providers/${provider.slug}`), dateModified: "2026-08-18" }} /><CatalogDetail group={provider} type="provider" /></ProductShell>;
}
