/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

function securityHeaders(request: Request, response: Response, requestId: string, durationMs: number) {
  const path = new URL(request.url).pathname;
  const isApi = path.startsWith("/api/");
  const isEmbed = path === "/embed";
  const headers = new Headers(response.headers);
  headers.set("x-request-id", requestId);
  headers.set("server-timing", `app;dur=${durationMs.toFixed(1)}`);
  headers.set("x-content-type-options", "nosniff");
  headers.set("referrer-policy", "strict-origin-when-cross-origin");
  headers.set("strict-transport-security", "max-age=31536000; includeSubDomains");
  headers.set("permissions-policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()");
  headers.set("cross-origin-resource-policy", isApi || isEmbed ? "cross-origin" : "same-origin");
  headers.set(
    "content-security-policy",
    `default-src 'self'; base-uri 'self'; object-src 'none'; form-action 'self'; frame-ancestors ${isEmbed ? "*" : "'self' https://chatgpt.com https://*.chatgpt.com"}; img-src 'self' data:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self' https:; upgrade-insecure-requests`,
  );
  if (!isEmbed) headers.set("x-frame-options", "SAMEORIGIN");
  if (isApi && !headers.has("access-control-allow-origin"))
    headers.set("access-control-allow-origin", "*");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function internalError(path: string) {
  if (path.startsWith("/api/"))
    return Response.json(
      { error: { status: 500, code: "internal_error", message: "The service could not complete this request", details: null } },
      { status: 500, headers: { "cache-control": "no-store", "access-control-allow-origin": "*" } },
    );
  return new Response("Service temporarily unavailable", {
    status: 500,
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
  });
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const started = performance.now();
    const requestId = crypto.randomUUID();
    let response: Response;

    try {
      if (url.pathname === "/_vinext/image") {
        const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
        response = await handleImageOptimization(request, {
          fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
          transformImage: async (body, { width, format, quality }) => {
            const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
            return result.response();
          },
        }, allowedWidths);
      } else {
        response = await handler.fetch(request, env, ctx);
      }
    } catch (error) {
      console.error(JSON.stringify({
        event: "request_failed",
        request_id: requestId,
        method: request.method,
        path: url.pathname,
        error: error instanceof Error ? error.name : "UnknownError",
      }));
      response = internalError(url.pathname);
    }
    const durationMs = performance.now() - started;
    console.log(JSON.stringify({
      event: "request_complete",
      request_id: requestId,
      method: request.method,
      path: url.pathname,
      status: response.status,
      duration_ms: Number(durationMs.toFixed(1)),
    }));
    return securityHeaders(request, response, requestId, durationMs);
  },
};

export default worker;
