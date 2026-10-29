import { NextResponse } from "next/server";
import { newId, readDb, writeDb } from "@/lib/db";
import { cleanRecipe } from "@/lib/recipe";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const owner = url.searchParams.get("owner");
  const q = url.searchParams.get("q") ?? "";
  const tag = url.searchParams.get("tag") ?? "";
  const db = await readDb();
  // ZOMBIE: with no ?owner= this returns every user's recipes, and the owner is whatever the browser says.
  let list = owner ? db.recipes.filter((r) => r.ownerId === owner) : db.recipes;
  // ZOMBIE: search only looks at the title, and it is case sensitive ("chicken" will not find "Chicken").
  // It should also search ingredients and tags.
  if (q) list = list.filter((r) => r.title.includes(q));
  if (tag) list = list.filter((r) => r.tags.includes(tag));
  // ZOMBIE: the page says "Newest first" but this sorts by id, oldest first.
  list = [...list].sort((a, b) => a.id.localeCompare(b.id));
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const db = await readDb();
  // ZOMBIE: ownerId comes straight from the request body, so anyone can add recipes to anyone's box.
  const recipe = { id: newId(), ownerId: String(body.ownerId), ...cleanRecipe(body) };
  db.recipes.push(recipe);
  await writeDb(db);
  return NextResponse.json(recipe, { status: 201 });
}
