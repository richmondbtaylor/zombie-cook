# 🧟 ZOMBIE.md: what's broken

This app is a zombie on purpose. Pick items off this list. Every box you tick gets it closer to a product we can all use and stop paying for Plan to Eat.

Search the code for `ZOMBIE:` to find every planted problem.

## 1. Make it work

- [ ] "Import from a URL" gets a 501 (`app/api/import/route.ts`, button in `components/RecipeForm.tsx`). Build it: fetch the page, read the recipe data most sites put in the page (schema.org Recipe), and fill the form. Keep the source address.
- [ ] The servings scaler shows `0.3333333 cup` (`lib/scale.ts`). Show kitchen amounts: fractions like 1/3 and 1/2, or round to something a person can measure. A serving count of 0 shows `Infinity`, so stop that too (`components/RecipeView.tsx`).
- [ ] The grocery list does not combine ingredients properly (`lib/grocery.ts`). It matches names exactly, so "Onion" and "onion" are two lines. It also ignores units, so Maya's list says `22 tbsp butter` when one recipe uses tablespoons and another uses 20 grams. Compare trimmed lowercase names, add only the same unit, and convert units that can be converted (cup to ml, g to oz).
- [ ] Grocery amounts ignore how many servings you plan to cook (`lib/grocery.ts`). A recipe written for 4 but planned for 2 still buys the full amount. Let each meal slot have its own servings.
- [ ] The check-off boxes are one shared list for every user (`lib/grocery.ts`, `app/api/grocery/route.ts`). Save them per person and per week.
- [ ] Deleting a recipe leaves holes in the meal plan (`app/api/recipes/[id]/route.ts`, `app/plan/page.tsx`). The slot says "Recipe was deleted" and the grocery list quietly skips it. Clear those slots, or ask first and say what will change.
- [ ] Recipe search only checks the title and is case sensitive (`app/api/recipes/route.ts`). "chicken" does not find "Chicken". Search ingredients and tags too.
- [ ] The recipe box says "Newest first" but sorts oldest first (`app/api/recipes/route.ts`). Add a created date and sort by it.
- [ ] Amounts typed like `1/2` or `1 1/2` are saved as `1` (`lib/recipe.ts`, because of `parseFloat`). Parse fractions, and show an error when an amount is not a number.
- [ ] There is only one week in the meal planner (`app/plan/page.tsx`). Add real dates, next week, and copy last week.
- [ ] "Email me this list" shows "Not built yet" (`app/api/grocery/email/route.ts`). Build it.
- [ ] "Show nutrition" shows "Not built yet" (`app/api/nutrition/route.ts`). Build it from a real data source, and see section 3 first.
- [ ] Photo upload is turned off (`components/RecipeForm.tsx`). Build it, with a size and file type check.

## 2. Make it secure

- [ ] There is no login. The "Pretend to be" dropdown lets anyone be anyone (`lib/useMe.ts`, `components/PretendPicker.tsx`). Add accounts (Supabase Auth, Clerk, Auth.js...).
- [ ] Every API route trusts the browser (`app/api/recipes/route.ts`). `ownerId` and `?owner=` come from the request, and with no `?owner=` the list returns everyone's recipes. Read the user from the session on the server.
- [ ] Anyone can edit or delete anyone's recipe (`app/api/recipes/[id]/route.ts`). Check that the recipe belongs to the signed-in user.
- [ ] Recipe ids are timestamps (`lib/db.ts`), so the public link `/r/1001`, `/r/1002` can be walked by anyone (`app/r/[id]/page.tsx`). There is also no "make this public" switch. Use long random share tokens that the owner can create and turn off, and keep recipes private by default.
- [ ] Recipe notes are printed as raw HTML on the share page (`app/r/[id]/page.tsx`). Save a note like `<img src=x onerror=alert(1)>` and it runs for every visitor. Print notes as plain text.
- [ ] The server does not check input (`lib/recipe.ts`, `app/api/plan/route.ts`). Servings can be 0 or negative, a title can be empty, text can be any length, and a plan slot can point at a recipe or day that does not exist. Validate on the server (zod or similar).
- [ ] Data lives in `data/db.json` on disk (`lib/db.ts`). Move it to a real database.
- [ ] "Clear the week" and "Delete" have no confirm step and no undo (`app/api/plan/route.ts`, `components/RecipeView.tsx`).
- [ ] Photo uploads, once built, must check file type and size, and must not be public by default.

## 3. Make it compliant

- [ ] Copyright and recipes. In the US, a plain list of ingredients is usually treated as a fact and is not protected. The written directions, the story around a recipe, and the photos can be protected. Importing a page whole, or copying someone's steps and photos into a shared or public recipe, can be copyright infringement. When you build Import: keep ingredients and times, ask the user to write steps in their own words, keep the source link, and never copy photos. The rules differ by country, so check with a lawyer.
- [ ] Your users upload and share content. In the US, the DMCA safe harbor (17 U.S.C. 512) only protects you if you register a DMCA agent with the Copyright Office, publish a takedown contact, and remove content fast when a valid notice arrives. Add a report link on shared recipes (`app/r/[id]/page.tsx`).
- [ ] Allergens. The app has no allergen field (`lib/db.ts`, `components/RecipeForm.tsx`, `components/RecipeView.tsx`). In the US, packaged food must name the 9 major allergens: milk, eggs, fish, shellfish, tree nuts, peanuts, wheat, soy and sesame (FALCPA and the FASTER Act). That law is for food labels, not recipe apps, but a family cooking for a child with an allergy will trust what you show. Add allergen tags, warn when a recipe has one, and say the list can be wrong. Check the current rule.
- [ ] Nutrition and health claims. If you build nutrition (`app/api/nutrition/route.ts`), use a named source such as USDA FoodData Central, show where each number came from, and add "This is not medical advice" next to it. Do not say a recipe is "good for diabetes" or "heart healthy". Health claims can fall under FDA and FTC rules. Check the current rules.
- [ ] Diet data is personal data. If you add allergies, diets or health goals to a profile, treat it as sensitive. Some states, such as Washington (My Health My Data Act), have extra rules for health data. Ask for it only if you need it, and let people delete it.
- [ ] No privacy policy or terms page. Names, emails and what people eat are personal data (CCPA in California, GDPR if you serve people in the EU).
- [ ] No way for a user to export or delete their recipes and plans. Build both (people will want their recipe box if they leave).
- [ ] If you add grocery delivery links (Instacart, Walmart...) and earn money from them, the FTC says you must tell people about the link in plain words.
- [ ] Emailing the grocery list: follow the CAN-SPAM Act (a real sender and a way to opt out of marketing mail).
- [ ] Subscriptions. Automatic renewal laws (California has one, and the FTC has rules in this area) expect a clear price, a clear renewal notice, and an easy way to cancel. Check the current rule before you sell a plan.
- [ ] Accessibility. The meal planner table and checkboxes need labels and keyboard use to work (WCAG 2.1 AA is what lawsuits usually point to).

## 4. Connect Stripe

- [ ] `app/api/checkout/route.ts` returns a 501. Create a Stripe Checkout Session (test mode is fine).
- [ ] Add a webhook route that marks the account as paid.
- [ ] Lock the paid features (meal planner, grocery list, public links) behind the plan. Pick the prices on `app/pricing/page.tsx`.
- [ ] Sales tax on a software subscription differs by state. Use Stripe Tax or check the current rule.

## 5. Ship it

- [ ] Deploy it (Vercel, Netlify, Railway...). The JSON file database will not survive this, so do section 2 first.
- [ ] Put the live link in your README.

## What "done" looks like

Someone who has never seen it can sign up, pay, add a recipe, plan a week, get a clean grocery list, tick it off at the store, and come back tomorrow to find their data still there.
