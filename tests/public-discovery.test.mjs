import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const [layout, robots, sitemap, discovery, models, providers, guide, llms, feed, update, launch] = await Promise.all([
  read("../app/layout.tsx"),
  read("../app/robots.ts"),
  read("../app/sitemap.ts"),
  read("../lib/discovery.ts"),
  read("../app/models/[slug]/page.tsx"),
  read("../app/providers/[slug]/page.tsx"),
  read("../app/guide/page.tsx"),
  read("../app/llms.txt/route.ts"),
  read("../app/feed.xml/route.ts"),
  read("../app/updates/[slug]/page.tsx"),
  read("../docs/DISCOVERY_LAUNCH.md"),
]);

test("publishes indexable canonical metadata and a branded social card", async () => {
  assert.match(layout, /index: true/);
  assert.match(layout, /summary_large_image/);
  assert.match(layout, /modelscope-og\.png/);
  await access(new URL("../public/modelscope-og.png", import.meta.url));
});

test("separates search discovery from training crawl", () => {
  assert.match(robots, /Googlebot/);
  assert.match(robots, /Bingbot/);
  assert.match(robots, /OAI-SearchBot/);
  assert.match(robots, /ChatGPT-User/);
  assert.match(robots, /userAgent: "GPTBot", disallow: "\/"/);
  assert.match(launch, /different controls/);
});

test("creates stable model and provider evidence pages", () => {
  assert.match(discovery, /PUBLIC_MODELS/);
  assert.match(discovery, /PUBLIC_PROVIDERS/);
  assert.match(models, /"@type": "Dataset"/);
  assert.match(providers, /"@type": "CollectionPage"/);
  assert.match(sitemap, /PUBLIC_MODELS/);
  assert.match(sitemap, /PUBLIC_PROVIDERS/);
});

test("supports answer, article, feed, and machine-readable discovery", () => {
  assert.match(guide, /"@type": "FAQPage"/);
  assert.match(update, /"@type": "Article"/);
  assert.match(llms, /Input, cache hit, cache write, and output/);
  assert.match(feed, /application\/rss\+xml/);
});
