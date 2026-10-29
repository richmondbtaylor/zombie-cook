// ZOMBIE: the scaler uses plain floats and never rounds to kitchen amounts.
// 1 cup for 3 servings, scaled to 1 serving, shows "0.3333333 cup". Show fractions
// (1/3, 1/2) or round to amounts a person can measure. Also: serving counts of 0 give Infinity.
export function scaleAmount(amount: number, from: number, to: number): number {
  return (amount * to) / from;
}

export function showAmount(n: number): string {
  if (!Number.isFinite(n)) return String(n);
  return String(Number(n.toPrecision(7)));
}
