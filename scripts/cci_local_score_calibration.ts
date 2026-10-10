import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DIMENSIONS, type DimensionId } from "../src/cci/model";

const input = JSON.parse(
  readFileSync(new URL("../docs/data/cci-local-2026-calibration.json", import.meta.url), "utf8")
);
assert.equal(input.status, "synthetic_full_capability_calibration_not_city_scores");
const weights = Object.fromEntries(DIMENSIONS.map(d => [d.id, d.weight])) as Record<
  DimensionId,
  number
>;
assert.equal(
  Object.values(weights).reduce((a, b) => a + b, 0),
  100
);

function total(scores: Partial<Record<DimensionId, number>>, selected = weights) {
  assert(Object.keys(scores).every(id => Object.hasOwn(weights, id)));
  let lower = 0;
  let missingWeight = 0;
  for (const { id } of DIMENSIONS) {
    const value = scores[id];
    if (value === undefined) missingWeight += selected[id];
    else {
      assert(Number.isFinite(value) && value >= 0 && value <= 100);
      lower += (value * selected[id]) / 100;
    }
  }
  return { center: missingWeight ? null : lower, lower, upper: lower + missingWeight };
}

assert.equal(new Set(input.cases.map((c: { id: string }) => c.id)).size, input.cases.length);
for (const c of input.cases) {
  assert(c.description && Object.keys(c.scores).length === DIMENSIONS.length);
  assert(Object.values(c.scores).every(value => [20, 40, 60, 80].includes(value as number)));
  assert.equal(total(c.scores).center, c.expectedTotal);
}
const [a, b] = input.cases;
assert.equal(total({ ...a.scores, MED: 60 }).center, 60);
const missing = { ...a.scores };
delete missing.MED;
assert.deepEqual(total(missing), { center: null, lower: 51, upper: 66 });
assert.throws(() => total({ PCS: 101 }));
assert.throws(() => total({ PCS: Number.NaN }));
const sensitivity = { ...weights, MED: 20, TEC: 5 };
assert.equal(
  Object.values(sensitivity).reduce((x, y) => x + y, 0),
  100
);
assert.equal(total(a.scores, sensitivity).center, 55);
assert.equal(total(b.scores, sensitivity).center, 57);
console.log({
  status: input.status,
  totals: input.cases.map((c: { id: string; scores: Record<DimensionId, number> }) => ({
    id: c.id,
    ...total(c.scores),
  })),
  missingMED: total(missing),
  sensitivity: { A: 55, B: 57 },
});
