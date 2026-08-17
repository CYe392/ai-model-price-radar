import { filterCatalog } from "../../../../lib/public-catalog";
import { apiError, apiJson, envelope, optionsResponse } from "../../../../lib/public-api";

export const dynamic = "force-dynamic";
export function OPTIONS() { return optionsResponse(); }

const scenarios = {
  "daily-chat": { input: 20, output: 5, cache: .2, minAbility: 80, minContext: 128_000, capability: .3, cost: .4, latency: .2, trust: .1 },
  "light-development": { input: 80, output: 18, cache: .45, minAbility: 88, minContext: 200_000, capability: .45, cost: .25, latency: .12, trust: .18 },
  "intensive-development": { input: 350, output: 90, cache: .6, minAbility: 93, minContext: 200_000, capability: .58, cost: .14, latency: .08, trust: .2 },
  "openclaw-agents": { input: 500, output: 120, cache: .65, minAbility: 92, minContext: 200_000, capability: .5, cost: .15, latency: .08, trust: .27 },
  "customer-support": { input: 1000, output: 160, cache: .55, minAbility: 84, minContext: 128_000, capability: .25, cost: .45, latency: .18, trust: .12 },
  "long-context-rag": { input: 800, output: 100, cache: .75, minAbility: 88, minContext: 400_000, capability: .32, cost: .26, latency: .07, trust: .35 },
} as const;

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const scenarioId = params.get("scenario") ?? "daily-chat";
  const scenario = scenarios[scenarioId as keyof typeof scenarios];
  if (!scenario) return apiError(400, "invalid_scenario", `scenario must be one of: ${Object.keys(scenarios).join(", ")}`);
  const priority = params.get("priority") ?? "balanced";
  if (!['price', 'balanced', 'ability'].includes(priority))
    return apiError(400, "invalid_priority", "priority must be price, balanced, or ability");
  const limit = Math.min(10, Math.max(1, Number(params.get("limit") ?? 3)));
  const results = filterCatalog(params)
    .filter((item) => item.ability_score >= scenario.minAbility && item.context_tokens >= scenario.minContext)
    .map((item) => {
      const monthly = scenario.input * (1 - scenario.cache) * item.prices.input + scenario.input * scenario.cache * (item.prices.cached_input ?? item.prices.input) + scenario.output * item.prices.output;
      const capability = item.ability_score;
      const cost = 100 / (1 + monthly / Math.max(1, (scenario.input + scenario.output) * .5));
      const latency = Math.max(0, 110 - item.latency_ms_estimate / 8);
      const trust = 55 + Object.values(item.compliance).filter(Boolean).length * 8;
      const capabilityWeight = priority === "ability" ? scenario.capability + .2 : priority === "price" ? Math.max(.1, scenario.capability - .12) : scenario.capability;
      const costWeight = priority === "price" ? scenario.cost + .22 : priority === "ability" ? Math.max(.08, scenario.cost - .1) : scenario.cost;
      const totalWeight = capabilityWeight + costWeight + scenario.latency + scenario.trust;
      const score = (capability * capabilityWeight + cost * costWeight + latency * scenario.latency + trust * scenario.trust) / totalWeight;
      return { route: item, score: Number(score.toFixed(2)), projected_monthly_usd: Number(monthly.toFixed(2)), breakdown: { capability: Number(capability.toFixed(1)), cost: Number(cost.toFixed(1)), latency: Number(latency.toFixed(1)), trust: Number(trust.toFixed(1)) } };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  return apiJson(envelope(results, { scenario: scenarioId, priority, count: results.length, workload: { input_million_tokens: scenario.input, output_million_tokens: scenario.output, cache_hit: scenario.cache } }));
}
