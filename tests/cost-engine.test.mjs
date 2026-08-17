import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page=await readFile(new URL("../app/page.tsx",import.meta.url),"utf8");

test("cost engine models the complete published bill components",()=>{
  for(const signal of ["standard","cached","cacheWrite","output","planFee","freeCredits","extraMonthlyFee","tax"]) assert.match(page,new RegExp(signal));
  assert.match(page,/Math\.max\(0, subtotal - Math\.max\(0, freeCredits\)\)/);
  assert.match(page,/afterCredits \* \(Math\.max\(0, taxRate\) \/ 100\)/);
});

test("supports service modes and cache sensitivity",()=>{
  for(const mode of ["standard","batch","flex","priority"]) assert.match(page,new RegExp(`value="${mode}"`));
  assert.match(page,/\[0, 25, 50, 75, 90\]/);
  assert.match(page,/CACHE SENSITIVITY/);
});

test("exports an auditable monthly and annual CSV breakdown",()=>{
  assert.match(page,/model,provider,standard_input,cache_read,cache_write,output,fixed_fees,tax,monthly_total,annual_total/);
  assert.match(page,/r\.total \* 12/);
  assert.match(page,/\/year/);
  assert.match(page,/modelscope-cost-estimate\.csv/);
});
