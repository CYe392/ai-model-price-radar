export const SITE_NAME = "ModelScope";
export const SITE_DESCRIPTION =
  "Compare AI API pricing, cache economics, regional availability, total workload cost, and provider routes from public official sources.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://modelscope-price-radar.cybercl19.chatgpt.site";

export function absoluteUrl(path = "/") {
  return new URL(path, `${SITE_URL}/`).toString();
}
