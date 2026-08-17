import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const fixtures=JSON.parse(await readFile(new URL("./fixtures/pricing-pages.json",import.meta.url),"utf8"));
const route=await readFile(new URL("../app/api/prices/route.ts",import.meta.url),"utf8");
const schema=await readFile(new URL("../db/schema.ts",import.meta.url),"utf8");

test("keeps a regression fixture for every public pricing adapter",()=>{
  const expected=["openrouter","opencode-go","openai","anthropic","aws-bedrock","azure-ai","google","deepseek","qwen","siliconflow","together","fireworks"];
  assert.deepEqual(Object.keys(fixtures),expected);
  for(const [id,fixture] of Object.entries(fixtures)){
    assert.ok(fixture.sample.length>20,`${id} fixture must contain a representative sample`);
    for(const anchor of fixture.anchors) assert.ok(route.toLowerCase().includes(anchor.toLowerCase()),`${id} production adapter must retain ${anchor}`);
  }
});

test("persists route provenance and distinguishes retained data",()=>{
  for(const field of ["sourceUrl","parserVersion","verificationStatus"]) assert.match(schema,new RegExp(field));
  assert.match(route,/verificationStatus:\s*"previously_verified"/);
  assert.match(route,/verificationStatus:\s*safe \? "verified" : "quarantined"/);
  assert.match(route,/PARSER_VERSION/);
  assert.match(route,/retainedPrices/);
});

test("never applies quarantined observations",()=>{
  assert.match(route,/change <= 50/);
  assert.match(route,/eq\(priceSnapshots\.accepted, true\)/);
  assert.match(route,/accepted\.push\(update\)/);
});
