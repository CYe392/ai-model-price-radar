import { env } from "cloudflare:workers";

export const NEWSLETTER_REGIONS = [
  "global",
  "north-america",
  "europe",
  "asia-pacific",
] as const;

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isNewsletterRegion(value: string) {
  return NEWSLETTER_REGIONS.includes(
    value as (typeof NEWSLETTER_REGIONS)[number],
  );
}

export function createToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

export async function hashToken(token: string) {
  const bytes = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

type MailConfig = {
  apiKey?: string;
  from?: string;
};

function mailConfig(): MailConfig {
  const bindings = env as unknown as Record<string, string | undefined>;
  return {
    apiKey: bindings.RESEND_API_KEY,
    from: bindings.NEWSLETTER_FROM,
  };
}

export async function sendNewsletterEmail({
  to,
  subject,
  html,
  unsubscribeUrl,
}: {
  to: string;
  subject: string;
  html: string;
  unsubscribeUrl: string;
}) {
  const config = mailConfig();
  if (!config.apiKey || !config.from) {
    return { configured: false as const, providerMessageId: null };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${config.apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: config.from,
      to: [to],
      subject,
      html,
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Email provider returned ${response.status}`);
  }

  const payload = (await response.json()) as { id?: string };
  return {
    configured: true as const,
    providerMessageId: payload.id ?? null,
  };
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
