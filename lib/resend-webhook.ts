function decodeBase64(value: string) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1)
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}

export async function verifyResendWebhook({
  payload,
  id,
  timestamp,
  signature,
  secret,
  now = Date.now(),
}: {
  payload: string;
  id: string;
  timestamp: string;
  signature: string;
  secret: string;
  now?: number;
}) {
  const seconds = Number(timestamp);
  if (!Number.isInteger(seconds) || Math.abs(now / 1000 - seconds) > 300)
    return false;
  const encodedSecret = secret.startsWith("whsec_") ? secret.slice(6) : secret;
  let keyBytes: Uint8Array;
  try {
    keyBytes = decodeBase64(encodedSecret);
  } catch {
    return false;
  }
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${id}.${timestamp}.${payload}`),
  );
  const expected = btoa(String.fromCharCode(...new Uint8Array(digest)));
  return signature
    .split(" ")
    .some((candidate) => candidate.startsWith("v1,") && constantTimeEqual(candidate.slice(3), expected));
}
