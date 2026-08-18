import type { Metadata } from "next";
import { CatalogIndex } from "../catalog-pages";
import { ProductShell } from "../product-shell";
import { PUBLIC_MODELS } from "../../lib/discovery";

export const metadata: Metadata = { title: "AI model API prices", description: "Browse model-level AI API pricing across direct providers, cloud platforms, and API routers, including cache and regional availability.", alternates: { canonical: "/models" } };

export default function ModelsPage() {
  return <ProductShell eyebrow="MODEL DIRECTORY" title="One model. Every documented route." lede="Compare direct, cloud, marketplace, and router offers without flattening cache prices or regional availability."><CatalogIndex groups={PUBLIC_MODELS} type="model" /></ProductShell>;
}
