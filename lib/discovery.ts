import { PUBLIC_CATALOG, type PublicRoute } from "./public-catalog";

export function slugify(value: string) {
  return value.toLowerCase().replaceAll(".", "-").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export type CatalogGroup = {
  slug: string;
  name: string;
  routes: PublicRoute[];
  lowestInput: number;
  lowestOutput: number;
  regions: string[];
};

function groupBy(field: "model" | "provider") {
  const groups = new Map<string, PublicRoute[]>();
  for (const route of PUBLIC_CATALOG) {
    const name = route[field];
    groups.set(name, [...(groups.get(name) ?? []), route]);
  }
  return Array.from(groups, ([name, routes]): CatalogGroup => ({
    slug: slugify(name),
    name,
    routes,
    lowestInput: Math.min(...routes.map((route) => route.prices.input)),
    lowestOutput: Math.min(...routes.map((route) => route.prices.output)),
    regions: [...new Set(routes.flatMap((route) => route.regions))].sort(),
  })).sort((a, b) => a.name.localeCompare(b.name));
}

export const PUBLIC_MODELS = groupBy("model");
export const PUBLIC_PROVIDERS = groupBy("provider");

export function getPublicModel(slug: string) {
  return PUBLIC_MODELS.find((model) => model.slug === slug);
}

export function getPublicProvider(slug: string) {
  return PUBLIC_PROVIDERS.find((provider) => provider.slug === slug);
}

export function money(value: number | null) {
  return value === null ? "Not published" : `$${value.toLocaleString("en-US", { maximumFractionDigits: 4 })}`;
}
