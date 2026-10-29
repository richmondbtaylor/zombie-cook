import { Suspense } from "react";
import { notFound } from "next/navigation";
import RecipeForm from "@/components/RecipeForm";
import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EditRecipe({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = (await readDb()).recipes.find((r) => r.id === id);
  if (!recipe) notFound();
  return (
    <>
      <h1>Edit recipe</h1>
      <p className="sub">{recipe.title}</p>
      <Suspense><RecipeForm recipe={recipe} /></Suspense>
    </>
  );
}
