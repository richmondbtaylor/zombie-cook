import Link from "next/link";
import RecipeView from "@/components/RecipeView";
import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = (await readDb()).recipes.find((r) => r.id === id);
  if (!recipe) {
    return (
      <div className="card empty">
        <strong>That recipe is gone.</strong>
        <Link href="/">Back to the recipe box</Link>
      </div>
    );
  }
  return <RecipeView recipe={recipe} />;
}
