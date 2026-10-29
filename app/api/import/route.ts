// ZOMBIE: "Import from a URL" is not built. It should fetch the page, read the recipe data on it
// (most recipe sites include schema.org Recipe JSON-LD), and fill the form.
// Careful: copying a whole page is a copyright problem. See ZOMBIE.md, section 3.
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "Not built yet: importing a recipe from a web address." }, { status: 501 });
}
