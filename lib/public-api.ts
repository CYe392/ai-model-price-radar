export const API_VERSION = "2026-08-17";
export const API_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, OPTIONS",
  "access-control-allow-headers": "content-type",
  "cache-control": "public, max-age=300, stale-while-revalidate=3600",
  "content-type": "application/json; charset=utf-8",
  "x-modelscope-api-version": API_VERSION,
  "x-ratelimit-policy": "public-fair-use; contact repository owner for bulk access",
};

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
