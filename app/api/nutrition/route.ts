// ZOMBIE: nutrition facts are not built. If you build them, use a real source (for example the USDA
// FoodData Central database), show where each number came from, and add a "not medical advice" note.
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ error: "Not built yet: nutrition facts." }, { status: 501 });
}
