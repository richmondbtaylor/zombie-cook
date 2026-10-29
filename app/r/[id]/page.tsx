// ZOMBIE: the public share link. The id is a timestamp, so anyone can guess /r/1001, /r/1002...
// and read every recipe, private or not. There is no "make this public" switch, no owner check,
// and no way to turn a link off. Use long random share tokens that the owner can create and revoke.
import { readDb } from "@/lib/db";
import { showAmount } from "@/lib/scale";

export const dynamic = "force-dynamic";

export default async function SharedRecipe({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await readDb();
  const recipe = db.recipes.find((r) => r.id === id);
  if (!recipe) return <div className="card"><strong>No recipe at this link.</strong></div>;
  const owner = db.users.find((u) => u.id === recipe.ownerId);
  return (
    <div className="card stack" style={{ maxWidth: 640 }}>
      <h1>{recipe.title}</h1>
      <p className="sub">Shared by {owner?.name ?? "someone"} · {recipe.minutes} min · serves {recipe.servings}</p>
      <ul className="ingredients">
        {recipe.ingredients.map((i, n) => <li key={n}><strong>{showAmount(i.amount)}</strong> {i.unit} {i.name}</li>)}
      </ul>
      <ol className="steps">{recipe.steps.map((s, n) => <li key={n}>{s}</li>)}</ol>
      {/* ZOMBIE: notes are printed as raw HTML. A note with a script tag runs for everyone who opens the link (stored XSS). */}
      <div className="muted" dangerouslySetInnerHTML={{ __html: recipe.notes }} />
      {/* ZOMBIE: the source credit is plain text, not a link, and copied steps are shown as if they were yours. */}
      {recipe.source && <p className="muted small">From: {recipe.source}</p>}
    </div>
  );
}
