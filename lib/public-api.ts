export const API_VERSION = "2026-08-17";
export const API_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, OPTIONS",
  "access-control-allow-headers": "content-type",
  "cache-control": "public, max-age=300, stale-while-revalidate=3600",
  "content-type": "application/json; charset=utf-8",
  "x-modelscope-api-version": API_VERSION,
  "x-ratelimit-policy": "public-fair-use; contact repository owner for bulk access",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
};

export function validateQuery(params: URLSearchParams, allowed: readonly string[]) {
  const seen = new Map<string, number>();
  let count = 0;
  for (const [key, value] of params) {
    count += 1;
    if (count > 16) return "no more than 16 query parameters are allowed";
    if (!allowed.includes(key)) return `unsupported query parameter: ${key.slice(0, 64)}`;
    if (key.length > 64 || value.length > 128) return "query parameter names and values must be 128 characters or fewer";
    seen.set(key, (seen.get(key) ?? 0) + 1);
    if ((seen.get(key) ?? 0) > 1) return `query parameter may appear only once: ${key}`;
  }
  return null;
}

export function boundedNumber(
  params: URLSearchParams,
  name: string,
  fallback: number,
  min: number,
  max: number,
  integer = false,
) {
  const raw = params.get(name);
  if (raw === null) return fallback;
  if (!/^-?(?:\d+|\d*\.\d+)$/.test(raw) || raw.length > 24) return null;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value)))
    return null;
  return value;
}

export function apiJson(data: unknown, init: ResponseInit = {}) {
  return Response.json(data, {
    ...init,
    headers: { ...API_HEADERS, ...(init.headers ?? {}) },
  });
}

export function apiError(status: number, code: string, message: string, details?: unknown) {
  return apiJson({ error: { status, code, message, details: details ?? null } }, { status });
}

export function optionsResponse() {
  return new Response(null, { status: 204, headers: API_HEADERS });
}

export function envelope<T>(data: T, meta: Record<string, unknown> = {}) {
  return {
    data,
    meta: {
      api_version: API_VERSION,
      generated_at: new Date().toISOString(),
      prices: "USD per 1M tokens unless stated otherwise",
      authority: "Provider billing pages remain authoritative",
      ...meta,
    },
  };
}
