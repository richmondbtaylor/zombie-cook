# Zombie Cook

> A half-built copy of **Paprika / Plan to Eat / Mealime**. It runs, it kind of works, and it is not ready for real users.
> Your job tonight: bring it back to life.

**Replaces:** Plan to Eat (from $5.95/month), Paprika and Mealime Pro

**Live demo:** https://zombie-cook.vercel.app (a shared demo: data resets whenever the server restarts)
<!-- Price verified 2026-10-29 at https://www.plantoeat.com/pricing : "$5.95/ month" billed monthly, or "$49/ year". Mealime Pro price not found: mealime.com/pricing shows no Pro price and says Mealime will shut down on October 21, 2026. -->

## Run it (2 minutes)

You need [Node.js 20 or newer](https://nodejs.org).

```bash
npm install
npm run dev
```

Open http://localhost:3109.

## What works

- A "Pretend to be" dropdown in the top bar picks who you are (there are no real accounts).
- Recipe box: a card for each recipe with time, servings and tags. Search by title and filter by tag.
- Add or edit a recipe: title, servings, minutes, tags, ingredients (amount, unit, name), steps, notes and where it came from.
- Recipe page with a servings scaler. Change the number and the amounts change.
- Meal plan: 7 days with breakfast, lunch and dinner. Pick a recipe for each slot.
- Grocery list built from the week's plan, with check-off boxes.
- Share link at `/r/<id>` for each recipe.
- Pricing page (Stripe is not connected).
- 10 fake recipes for 3 fake cooks in `data/seed.json`.

Try it: pretend to be Maya Chen, open the Grocery list, and look at the butter. Then open Banana Oat Pancakes, set servings to 1, and look at the flour.

## What's broken

See [ZOMBIE.md](ZOMBIE.md). That's the to-do list for the night. It has a food-safety section too: allergens, nutrition and copyright.

## How we build tonight

- **Mel** ([openmel.dev](https://openmel.dev)) does the building. Open this folder in Mel and give it tasks from ZOMBIE.md.
- **Prompt Anything** ([promptanything.io](https://www.promptanything.io)) writes the prompts. Use it inside Mel for features, agents, customer success flows, code fixes and reading this repo.
- **MEL.md** in this folder tells Mel's agents what this project is and how to work on it.

## Submit

Fork this repo, push your work, and send your link through the submission form before the deadline.
Many people can pick the same app. The one that actually works wins.

## License

MIT. Use it, ship it, share it.
