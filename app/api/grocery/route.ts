import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import { buildGrocery } from "@/lib/grocery";

export async function GET(req: Request) {
  const owner = new URL(req.url).searchParams.get("owner") ?? "";
  const db = await readDb();
  return NextResponse.json(buildGrocery(db, owner));
}

// Tick or untick one line.
export async function POST(req: Request) {
  const { key } = await req.json().catch(() => ({ key: "" }));
  const db = await readDb();
  db.checked = db.checked.includes(key) ? db.checked.filter((k) => k !== key) : [...db.checked, key];
  await writeDb(db);
  return NextResponse.json({ ok: true });
}
