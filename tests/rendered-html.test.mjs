import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set(
    "test",
    `${process.pid}-${Date.now()}-${Math.random()}`,
  );
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the complete ModelScope product shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(
    html,
    /<title>ModelScope \| AI API Price Intelligence<\/title>/i,
  );
  assert.match(html, /Compare AI APIs/);
  assert.match(html, /Refresh prices/);
  assert.match(html, /Live pricing/);
  assert.match(html, /Cost calculator/);
  assert.match(html, /Price history/);
  assert.match(html, /Data health/);
  assert.match(html, /Recommendations/);
  assert.doesNotMatch(
    html,
    /codex-preview|Building your site|react-loading-skeleton/i,
  );
});

test("keeps refresh manual and public-source only", async () => {
  const [page, route] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/prices/route.ts", import.meta.url), "utf8"),
  ]);
  assert.match(page, /onClick=\{refresh\}/);
  assert.doesNotMatch(page, /setInterval|setTimeout\(refresh/);
  assert.match(
    route,
    /public-pages-only; no authentication; no anti-bot bypass/,
  );
  for (const id of [
    "openrouter",
    "opencode-go",
    "openai",
    "anthropic",
    "google",
    "deepseek",
    "qwen",
    "together",
    "fireworks",
  ])
    assert.match(route, new RegExp(`\\"${id}\\"`));
  assert.match(route, /change <= 50/);
});

test("pricing parsers retain structural safety gates", async () => {
  const route = await readFile(
    new URL("../app/api/prices/route.ts", import.meta.url),
    "utf8",
  );
  for (const parser of [
    "openAIPrices",
    "anthropicPrices",
    "googlePrices",
    "deepseekPrices",
    "qwenPrices",
    "togetherPrices",
    "fireworksPrices",
  ])
    assert.match(route, new RegExp(`function ${parser}\\(`));
  assert.match(
    route,
    /u\.input\s*!=\s*null\s*&&\s*u\.output\s*!=\s*null\s*&&\s*u\.input\s*>\s*0\s*&&\s*u\.output\s*>\s*0/,
  );
  assert.match(route, /change <= 50/);
});
