import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import { cleanRecipe } from "@/lib/recipe";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const db = await readDb();
  const recipe = db.recipes.find((r) => r.id === id);
  if (!recipe) return NextResponse.json({ error: "Recipe not found." }, { status: 404 });
  return NextResponse.json(recipe);
}

export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const db = await readDb();
  const i = db.recipes.findIndex((r) => r.id === id);
  if (i < 0) return NextResponse.json({ error: "Recipe not found." }, { status: 404 });
  // ZOMBIE: no check that the caller owns this recipe. Anyone can edit anyone's recipe.
  db.recipes[i] = { ...db.recipes[i], ...cleanRecipe(body) };
  await writeDb(db);
  return NextResponse.json(db.recipes[i]);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const db = await readDb();
  // ZOMBIE: no owner check, no "are you sure?", no undo. It also leaves the recipe in every meal plan:
  // those slots now point at nothing (a hole in the week) and the grocery list quietly drops them.
  db.recipes = db.recipes.filter((r) => r.id !== id);
  await writeDb(db);
  return NextResponse.json({ ok: true });
}
