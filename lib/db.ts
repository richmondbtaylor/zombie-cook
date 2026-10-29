// ZOMBIE: this "database" is a JSON file on disk. It works on your laptop and
// dies on any real host (Vercel's disk is read-only and wiped on every deploy).
// Replace it with a real database (Supabase, Neon, Postgres...) before you ship.
import { promises as fs } from "fs";
import path from "path";
import seed from "@/data/seed.json";

export type Ingredient = { amount: number; unit: string; name: string };
// ZOMBIE: no allergen field. Nothing says "contains peanuts" or "contains milk" anywhere in the app.
export type Recipe = {
  id: string; ownerId: string; title: string; servings: number; minutes: number;
  tags: string[]; ingredients: Ingredient[]; steps: string[]; notes: string; source: string;
};
export type Meal = "breakfast" | "lunch" | "dinner";
export type Slot = { userId: string; day: number; meal: Meal; recipeId: string };
export type User = { id: string; name: string; color: string };
export type Db = {
  users: User[];
  recipes: Recipe[];
  plan: Slot[];
  checked: string[];
};

// ZOMBIE: the live site (Vercel) can't write to the app folder, so it writes to /tmp instead.
// /tmp is wiped whenever the server restarts, and each server copy keeps its own. Use a real database.
const DB_PATH = process.env.VERCEL
  ? path.join("/tmp", "db.json")
  : path.join(process.cwd(), "data", "db.json");

export async function readDb(): Promise<Db> {
  try {
    return JSON.parse(await fs.readFile(DB_PATH, "utf8")) as Db;
  } catch {
    const fresh = structuredClone(seed) as Db;
    await writeDb(fresh);
    return fresh;
  }
}

export async function writeDb(db: Db): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

export function newId(): string {
  // ZOMBIE: guessable ids. Anyone can walk the list by trying id+1. The public link /r/<id> uses these too.
  return String(Date.now());
}
