"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { scaleAmount, showAmount } from "@/lib/scale";
import type { Recipe } from "@/lib/db";

export default function RecipeView({ recipe }: { recipe: Recipe }) {
  const router = useRouter();
  const [servings, setServings] = useState(String(recipe.servings));
  const [msg, setMsg] = useState("");

  async function nutrition() {
    const res = await fetch("/api/nutrition");
    const data = await res.json();
    setMsg(data.error ?? "");
  }

  async function remove() {
    await fetch(`/api/recipes/${recipe.id}`, { method: "DELETE" });
    router.push("/");
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>{recipe.title}</h1>
          <p className="sub">{recipe.minutes} min · {recipe.tags.join(", ") || "no tags"}</p>
        </div>
        <div className="row">
          <Link href={`/recipes/${recipe.id}/edit`} className="btn ghost">Edit</Link>
          <button className="ghost" onClick={remove}>Delete</button>
        </div>
      </div>

      <div className="two-col">
        <div className="card stack">
          <label>
            Servings
            <input value={servings} onChange={(e) => setServings(e.target.value)} style={{ maxWidth: 120 }} />
          </label>
          <span className="muted small">Written for {recipe.servings}. Change the number to scale it.</span>
          <ul className="ingredients">
            {recipe.ingredients.map((i, n) => (
              <li key={n}>
                <strong>{showAmount(scaleAmount(i.amount, recipe.servings, Number(servings)))}</strong> {i.unit} {i.name}
              </li>
            ))}
          </ul>
          {/* ZOMBIE: no allergen info. Nothing here warns about milk, eggs, peanuts, tree nuts, wheat, soy, fish, shellfish or sesame. */}
        </div>
        <div className="card stack">
          <strong>Steps</strong>
          <ol className="steps">{recipe.steps.map((s, n) => <li key={n}>{s}</li>)}</ol>
          {recipe.notes && <p className="muted">Notes: {recipe.notes}</p>}
          {recipe.source && <p className="muted small">From: {recipe.source}</p>}
        </div>
      </div>

      <div className="card stack" style={{ marginTop: 16 }}>
        <div className="row">
          <button className="ghost small-btn" onClick={nutrition}>Show nutrition</button>
          <span className="muted small">Share link: <Link href={`/r/${recipe.id}`}>/r/{recipe.id}</Link></span>
        </div>
        {msg && <span className="error">{msg}</span>}
      </div>
    </>
  );
}
