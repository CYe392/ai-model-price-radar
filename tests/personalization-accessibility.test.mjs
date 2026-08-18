import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [page, css, layout] = await Promise.all([
  readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
]);

test("offers a persistent bilingual core interface", () => {
  assert.match(page, /modelscope-ui-preferences/);
  assert.match(page, /Compare AI APIs/);
  assert.match(page, /比较 AI API/);
  assert.match(page, /Refresh prices/);
  assert.match(page, /手动刷新价格/);
  assert.match(page, /root\.lang = preferences\.language === "zh" \? "zh-CN" : "en"/);
  assert.match(layout, /<html lang="en">/);
});

test("personalizes theme, density, motion, contrast, region, and currency", () => {
  for (const setting of ["theme", "density", "reducedMotion", "highContrast"])
    assert.match(page, new RegExp(setting));
  assert.match(page, /prefers-color-scheme: dark/);
  assert.match(css, /html\[data-theme="dark"\]/);
  assert.match(css, /html\[data-density="compact"\]/);
  assert.match(css, /html\[data-motion="reduced"\]/);
  assert.match(css, /html\[data-contrast="high"\]/);
});

test("adds keyboard, status, tab, and reduced-motion accessibility", () => {
  assert.match(page, /className="skipLink"/);
  assert.match(page, /role="tablist"/);
  assert.match(page, /aria-selected=\{tab === x\[0\]\}/);
  assert.match(page, /role="status" aria-live="assertive"/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:reduce/);
});

test("supports mobile and print-friendly presentation", () => {
  assert.match(css, /@media\(max-width:780px\)\{\.preferencePrivacy/);
  assert.match(css, /@media print/);
  assert.match(css, /\.preferencesCenter\{display:none\}/);
});
