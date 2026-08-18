import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogDetail } from "../../catalog-pages";
import { JsonLd } from "../../json-ld";
import { ProductShell } from "../../product-shell";
import { getPublicModel, PUBLIC_MODELS } from "../../../lib/discovery";
import { absoluteUrl } from "../../../lib/site";

export function generateStaticParams() { return PUBLIC_MODELS.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const model = getPublicModel((await params).slug);
  if (!model) return { title: "Model not found" };
  return { title: `${model.name} API pricing`, description: `Compare ${model.name} API input, cache, cache-write, output, region, and route pricing across ${model.routes.length} providers.`, alternates: { canonical: `/models/${model.slug}` } };
}

export default async function ModelPage({ params }: { params: Promise<{ slug: string }> }) {
  const model = getPublicModel((await params).slug);
  if (!model) notFound();
  return <ProductShell eyebrow="MODEL PRICE PROFILE" title={`${model.name} API pricing`} lede={`Compare ${model.routes.length} documented provider routes, including cache economics and availability across ${model.regions.length} market codes.`}><JsonLd data={{ "@context": "https://schema.org", "@type": "Dataset", name: `${model.name} API route pricing`, description: `Input, cached-input, cache-write, output, and regional availability for ${model.name}.`, url: absoluteUrl(`/models/${model.slug}`), dateModified: "2026-08-18", creator: { "@type": "Organization", name: "ModelScope" }, variableMeasured: ["input price per million tokens", "cached input price per million tokens", "cache write price per million tokens", "output price per million tokens", "regional availability"] }} /><CatalogDetail group={model} type="model" /></ProductShell>;
}
