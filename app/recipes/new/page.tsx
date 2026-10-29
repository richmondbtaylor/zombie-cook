import { Suspense } from "react";
import RecipeForm from "@/components/RecipeForm";

export default function NewRecipe() {
  return (
    <>
      <h1>Add a recipe</h1>
      <p className="sub">Type it in. Amounts are numbers, like 2 or 0.5.</p>
      <Suspense><RecipeForm /></Suspense>
    </>
  );
}
