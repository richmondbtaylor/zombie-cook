"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useMe } from "@/lib/useMe";
import type { Recipe } from "@/lib/db";

type Row = { amount: string; unit: string; name: string };

export default function RecipeForm({ recipe }: { recipe?: Recipe }) {
  const me = useMe();
  const router = useRouter();
  const wantsImport = useSearchParams().get("import") === "1";
  const [title, setTitle] = useState(recipe?.title ?? "");
  const [servings, setServings] = useState(String(recipe?.servings ?? 4));
  const [minutes, setMinutes] = useState(String(recipe?.minutes ?? 30));
  const [tags, setTags] = useState((recipe?.tags ?? []).join(", "));
  const [rows, setRows] = useState<Row[]>(
    recipe?.ingredients.map((i) => ({ amount: String(i.amount), unit: i.unit, name: i.name })) ?? [{ amount: "", unit: "", name: "" }],
  );
  const [steps, setSteps] = useState((recipe?.steps ?? []).join("\n"));
  const [notes, setNotes] = useState(recipe?.notes ?? "");
  const [source, setSource] = useState(recipe?.source ?? "");
  const [importUrl, setImportUrl] = useState("");
  const [msg, setMsg] = useState("");

  function setRow(i: number, patch: Partial<Row>) {
    setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  }

  async function doImport() {
    const res = await fetch("/api/import", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: importUrl }) });
    const data = await res.json();
    setMsg(data.error ?? "Imported.");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const body = {
      ownerId: me,
      title, servings, minutes,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      ingredients: rows.filter((r) => r.name.trim()),
      steps: steps.split("\n").map((s) => s.trim()).filter(Boolean),
      notes, source,
    };
    const res = await fetch(recipe ? `/api/recipes/${recipe.id}` : "/api/recipes", {
      method: recipe ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const saved = await res.json();
    if (res.ok) router.push(`/recipes/${saved.id}`);
    else setMsg(saved.error ?? "Could not save.");
  }

  return (
    <form onSubmit={save} className="stack" style={{ maxWidth: 720 }}>
      {(wantsImport || !recipe) && (
        <div className="card stack">
          <strong>Import from a URL</strong>
          <div className="row nowrap">
            <input placeholder="https://..." value={importUrl} onChange={(e) => setImportUrl(e.target.value)} />
            <button type="button" className="ghost" onClick={doImport}>Import</button>
          </div>
        </div>
      )}
      <label>Title<input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
      <div className="row">
        <label>Servings<input value={servings} onChange={(e) => setServings(e.target.value)} /></label>
        <label>Minutes<input value={minutes} onChange={(e) => setMinutes(e.target.value)} /></label>
        <label style={{ flex: 1 }}>Tags (comma between)<input value={tags} onChange={(e) => setTags(e.target.value)} /></label>
      </div>

      <h2>Ingredients</h2>
      {rows.map((r, i) => (
        <div key={i} className="row nowrap">
          <input placeholder="Amount" value={r.amount} onChange={(e) => setRow(i, { amount: e.target.value })} style={{ width: 90 }} />
          <input placeholder="Unit (cup, g)" value={r.unit} onChange={(e) => setRow(i, { unit: e.target.value })} style={{ width: 120 }} />
          <input placeholder="Name" value={r.name} onChange={(e) => setRow(i, { name: e.target.value })} />
          <button type="button" className="ghost small-btn" onClick={() => setRows(rows.filter((_, j) => j !== i))}>Remove</button>
        </div>
      ))}
      <div><button type="button" className="ghost small-btn" onClick={() => setRows([...rows, { amount: "", unit: "", name: "" }])}>Add ingredient</button></div>

      <label>Steps (one per line)<textarea rows={6} value={steps} onChange={(e) => setSteps(e.target.value)} /></label>
      <label>Notes<textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
      <label>Where it came from (a name or a web address)<input value={source} onChange={(e) => setSource(e.target.value)} /></label>
      {/* ZOMBIE: photo upload is turned off. Build it with file type and size checks and storage that is not public by default. */}
      <label>Photo (turned off)<input type="file" disabled /></label>
      {/* ZOMBIE: there is no allergen picker (milk, eggs, fish, shellfish, tree nuts, peanuts, wheat, soy, sesame). */}
      <div className="row">
        <button type="submit" disabled={!me}>{recipe ? "Save changes" : "Save recipe"}</button>
        {msg && <span className="error">{msg}</span>}
      </div>
    </form>
  );
}
