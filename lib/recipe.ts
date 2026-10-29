import type { Recipe } from "@/lib/db";

// Turns whatever the browser sent into a recipe.
// ZOMBIE: no real validation. servings can be 0 or negative, minutes can be text, a title can be empty,
// there are no length limits, and amounts typed as "1/2" become 1 because parseFloat stops at the slash.
export function cleanRecipe(body: Record<string, unknown>): Omit<Recipe, "id" | "ownerId"> {
  const ingredients = Array.isArray(body.ingredients) ? body.ingredients : [];
  const steps = Array.isArray(body.steps) ? body.steps : [];
  const tags = Array.isArray(body.tags) ? body.tags : [];
  return {
    title: String(body.title ?? ""),
    servings: Number(body.servings),
    minutes: Number(body.minutes),
    tags: tags.map(String),
    ingredients: ingredients.map((i: { amount?: unknown; unit?: unknown; name?: unknown }) => ({
      amount: parseFloat(String(i.amount)),
      unit: String(i.unit ?? ""),
      name: String(i.name ?? ""),
    })),
    steps: steps.map(String),
    notes: String(body.notes ?? ""),
    source: String(body.source ?? ""),
  };
}
