# MEL.md

This is a hackathon project: a half-built copy of Plan to Eat and Paprika (a recipe box, meal planner and grocery list) that we are turning into a real SaaS product the whole group can use.

## The stack

- Next.js (App Router) + TypeScript + React. Plain CSS in `app/globals.css`, no Tailwind.
- Data: `lib/db.ts` reads and writes `data/db.json`. `data/seed.json` is the starting data (users, recipes, meal plan, checked grocery lines). This is temporary.
- Routes: `app/api/users`, `recipes`, `recipes/[id]`, `plan`, `grocery`, `grocery/email` (501), `import` (501) and `nutrition` (501). Pages: Recipe box (`app/page.tsx`), `recipes/new`, `recipes/[id]`, `recipes/[id]/edit`, `plan`, `grocery`, `pricing`, and the public share page `r/[id]`.
- Logic: `lib/scale.ts` (servings scaler), `lib/grocery.ts` (builds the grocery list from the plan), `lib/recipe.ts` (cleans a recipe from the form). `components/RecipeForm.tsx` and `components/RecipeView.tsx` draw the form and the recipe page.
- "Who am I" is a dropdown (`components/PretendPicker.tsx`, `lib/useMe.ts`). There are no real accounts yet.
- Payments: `app/api/checkout/route.ts` is a stub. Stripe is not connected.
- Runs on port 3109.

## The job

Work through `ZOMBIE.md` in order: make it work, make it secure, make it compliant, connect Stripe, ship it.
Every planted problem in the code is marked with a `ZOMBIE:` comment.
Recipe apps feel low risk, but allergens, nutrition numbers and copied recipe text all matter. Read section 3 before you build Import or Nutrition.

## Rules for agents

- Keep it running. Run `npm run build` after each change and fix what breaks.
- Never commit secrets. Keys go in `.env.local` (it is git-ignored).
- Use Stripe test mode keys only.
- Keep all sample data fake. Never copy a real site's recipe steps or photos into the seed data.
- Nutrition numbers need a named source and a "not medical advice" note.
- When you fix a `ZOMBIE:` item, delete its comment and tick its box in `ZOMBIE.md`.
- Small commits with plain messages.
