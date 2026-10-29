import type { Db } from "@/lib/db";

export type GroceryItem = { key: string; name: string; amount: number; unit: string; checked: boolean };

export function buildGrocery(db: Db, userId: string): GroceryItem[] {
  const items = new Map<string, GroceryItem>();
  for (const slot of db.plan.filter((s) => s.userId === userId)) {
    const recipe = db.recipes.find((r) => r.id === slot.recipeId);
    // ZOMBIE: if the recipe was deleted, its meal-plan slot is still here and is silently skipped.
    // The list is short and nobody is told why. Clean up the plan when a recipe is deleted.
    if (!recipe) continue;
    for (const ing of recipe.ingredients) {
      // ZOMBIE: the key is the exact name. "Onion" and "onion" are two lines, and "flour" in cups
      // is added to "flour" in grams (2 cup + 250 g = "252 cup"). Combine only the same unit,
      // convert units that can be converted, and compare names trimmed and lowercase.
      const key = ing.name;
      const have = items.get(key);
      // ZOMBIE: amounts are not scaled. A recipe for 4 planned for 2 still buys the full amount.
      if (have) have.amount += ing.amount;
      else items.set(key, { key, name: ing.name, amount: ing.amount, unit: ing.unit, checked: false });
    }
  }
  // ZOMBIE: the check-off list is one shared list for everyone (db.checked), not one per person.
  return [...items.values()].map((i) => ({ ...i, checked: db.checked.includes(i.key) }));
}
