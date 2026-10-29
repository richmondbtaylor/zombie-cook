import { NextResponse } from "next/server";
import { readDb, writeDb, type Meal } from "@/lib/db";

export async function GET(req: Request) {
  const owner = new URL(req.url).searchParams.get("owner");
  const db = await readDb();
  return NextResponse.json(db.plan.filter((s) => s.userId === owner));
}

// Put a recipe in a slot. An empty recipeId clears the slot.
export async function PUT(req: Request) {
  const { userId, day, meal, recipeId } = await req.json().catch(() => ({}));
  const db = await readDb();
  db.plan = db.plan.filter((s) => !(s.userId === userId && s.day === day && s.meal === meal));
  // ZOMBIE: nothing checks that the day is 0 to 6, the meal is real, or that the recipe exists.
  if (recipeId) db.plan.push({ userId, day, meal: meal as Meal, recipeId });
  await writeDb(db);
  return NextResponse.json({ ok: true });
}

// ZOMBIE: "Clear the week" has no confirm step and no undo.
export async function DELETE(req: Request) {
  const owner = new URL(req.url).searchParams.get("owner");
  const db = await readDb();
  db.plan = db.plan.filter((s) => s.userId !== owner);
  await writeDb(db);
  return NextResponse.json({ ok: true });
}
