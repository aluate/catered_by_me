# 🚀 CATEREDBY.ME — LAUNCH CHECKLIST

## 1. Branding / UI

* [ ] Logo displays correctly everywhere (header, favicon, PDFs)
* [ ] Mobile header behaves cleanly (no layout shifts)
* [ ] Buttons use consistent sizing (`sm`, `md`, `lg`)
* [ ] Pricing page renders correctly on:
  * Mobile
  * Desktop
* [ ] Onboarding (first-time user explainer) triggers correctly

---

## 2. Authentication / Accounts

* [ ] Supabase signup + login works end-to-end
* [ ] Email/password works on:
  * Web
  * Mobile viewport
* [ ] Profiles table creates rows automatically via trigger
* [ ] Logout works and clears state
* [ ] Limits enforced for free tier:
  * [ ] 3 max events
  * [ ] 10 max recipes
  * [ ] No PDF export
  * [ ] Share link gated

---

## 3. Events & Recipes

* [ ] Creating an event → toasts
* [ ] Creating a recipe → toasts
* [ ] Editing both works
* [ ] Deleting works
* [ ] Weekly dashboard shows:
  * Next event
  * Weekly prep event
  * Recent recipes

---

## 4. Grocery Lists

* [ ] Real data loading works
* [ ] Ingredient merging works
* [ ] Store sections work
* [ ] Recipe grouping works
* [ ] Print layout is:
  * 8.5×11
  * Two-column
  * Margins correct
* [ ] localStorage persists checked items

---

## 5. Shareability

* [ ] Read-only link loads
* [ ] No accidental editing
* [ ] Print view available for shared links
* [ ] Gated features behave correctly

---

## 6. Error Handling

* [ ] ErrorBoundary catches UI errors
* [ ] Central error handler catches API errors
* [ ] "Retry" logic fires correctly
* [ ] Rate limits return branded error messages

---

## 7. Monetization Prep

* [ ] Pricing page animations & layout good
* [ ] UpgradePrompt displays correctly
* [ ] All upgrade paths → `/pricing`

---

## 8. Infrastructure

* [ ] Vercel env vars set for:
  * SUPABASE URL
  * anon key
* [ ] Render env vars set for:
  * service role key
  * jwt secret
* [ ] Supabase schema matches repo
* [ ] No failing migrations

---

## 9. Deployment

* [ ] Vercel build is clean
* [ ] Render logs show no errors
* [ ] Rate limits do not spike
* [ ] Favicon correct

---

## LAUNCH READY WHEN:

If **ALL** checkboxes are true, you can onboard paying users tomorrow.

