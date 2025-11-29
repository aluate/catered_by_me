# 🍾 CURSOR PROMPT — ENABLE "DEMO MODE" FOR PRESENTATION

**GOAL:**

Implement a full, non-destructive **Demo Mode** so Karl can show a fully-functioning product — including "fake success" and confetti for features not implemented yet — with zero billing, zero Stripe, and zero Steppo integration required.

This must sit on top of the current production-ready build.

---

# 🔥 HIGH-LEVEL REQUIREMENTS

### 1. Add a global `DEMO_MODE` flag

Add a new config file:

```
apps/web/src/lib/demo.ts
```

It should export:

```ts
export const DEMO_MODE = true;
```

Later we can flip to `false`.

### 2. In Demo Mode:

Override ALL calls to:
* Stripe upgrade
* Payment flows
* Sharing upgrades
* Pro-feature locks
* Feature-limit blockers
* "Premium" badge actions
* Anything that normally requires Steppo

With:
* **Confetti burst**
* **Fake toast: "You're in Demo Mode — Pro features unlocked!"**
* **No errors, no blocks, no redirects**

### 3. Fake Pro-tier everywhere

Modify feature flags:

```
featureFlags.ts
```

If `DEMO_MODE` is true:
* Return unlimited limits
* Always return `tier = "pro"`
* Suppress paywalls
* Unlock PDF export
* Unlock sharing
* Unlock unlimited events/recipes
* Allow creation of everything

This MUST NOT modify Supabase.

The demo should *look real* but *not write real upgrades*.

### 4. Add "Demo User" on login

If `DEMO_MODE` is true:
* After login, force a non-destructive "demoProfile"
* Show name: **Hannah (Demo)**
* Assign sample events & recipes automatically
* Store demo profile only in localStorage
* DO NOT write to Supabase

### 5. Add "Demo Success" UI for Fake Actions

For buttons that aren't wired yet (like future premium features), replace behavior with:
* A modal:

  ```
  🎉 Success!
  You're seeing a demo of a Pro feature.
  ```
* Confetti blast
* Close button

Make this reusable by creating:

```
apps/web/src/components/DemoSuccess.tsx
```

### 6. Add confetti to all upgrade buttons

Override all instances of:
* "Upgrade to Pro"
* "Unlock"
* "Go Pro"
* "Founding Host"
* "Holiday Host Pass upgrade"

Replace with:
* Confetti animation (can use ts-confetti or canvas-confetti)
* Toast:

  ```
  🎉 Demo Mode: This is what the upgrade flow will feel like!
  ```

### 7. Add "Demo Badge" in Header

In the top-right corner of the app (next to user avatar):

Badge:

```
DEMO MODE
```

Muted color, but visible.

### 8. Add Demo Mode overlays where appropriate

Examples:
* Pricing page: Add banner "You are viewing a demo. All Pro features are unlocked."
* Dashboard: Add subtle ribbon "Demo data"
* Event pages: Badge "Demo Event" if using sample events
* Grocery list: Footer "Demo Mode — This is a preview"

### 9. Add No-Write Middleware to ALL API calls

Any mutation functions should be wrapped with:

```
if (DEMO_MODE) return fake success + toast + no database writes
```

Specifically:
* createEvent
* updateEvent
* deleteEvent
* createRecipe
* updateRecipe
* deleteRecipe
* saveEventRecipes
* upgradePlan

Return fake "success" objects with mock IDs:

```ts
{id: 'demo-' + Math.random().toString(36).slice(2)}
```

### 10. Add Demo Mode to Print View

PDF page should include tiny text footer:

```
Generated in Demo Mode — Not final.
```

---

# 🎨 VISUAL DEMO ENHANCEMENTS

Cursor must add:

### ✔ Confetti bursts

Anywhere Stripe or premium features were blocked.

### ✔ Sweet success modals

Use brand voice from BRAND_GUIDE.md:

Examples:
* "Host with the most! (Demo mode success.)"
* "Look at you go — everything is unlocked for the demo!"
* "This is what your guests will see when we launch."

### ✔ Better skeleton loaders

Dashboard, Events list, Recipe list

### ✔ Demo-only "Autofill Hannah's Week" button

Place on dashboard:

```
Fill my week (Demo)
```

Populates:
* Breakfast burritos
* Girls' night (3 courses)
* Family pizza night

Uses `mockData.ts`.

---

# 🧠 LEAN ON CONTROL DOCS

All work must follow:
* `control/BRAND_GUIDE.md`
* `control/WEB_PHASE1.md`
* `control/WEB_PHASE2.md`
* `control/WEB_PHASE3.md`
* `PROJECT_STATUS.md`
* `PROMPT_FOR_FRAT_FINAL.md`

Cursor should:
* Use established components
* Follow branding voice
* Maintain file organization
* Keep Tailwind tokens
* Keep event/recipe types intact

---

# 🧪 TESTING CHECKLIST FOR CURSOR

Cursor should VALIDATE the following before finishing:

### Demo mode ON:
* All Pro features are unlocked without Stripe
* All upgrade buttons produce confetti & modals
* No API writes occur
* Dashboard loads mock data instantly
* Events populate properly
* Print view works with demo disclaimer
* No hard crashes
* No 500/400 errors
* No Supabase writes

### Demo mode OFF:
* Everything returns to normal
* Feature-locking returns
* Upgrade flow reverts (still no Stripe; just soft fail but no confetti)

---

# 📎 FINAL DELIVERABLES

Cursor must:

### 1. Implement Demo Mode system

As described.

### 2. Update all relevant pages

Dashboard, events, recipes, pricing, print pages.

### 3. Add two new components

* `DemoSuccess.tsx`
* `DemoBadge.tsx`

### 4. Add demo ribbon, overlays, and banners where appropriate

### 5. Update feature flags to respect demo mode

### 6. Introduce fake success paths for all premium features

---

# END OF PROMPT

**Implement Demo Mode exactly as specified.**

When finished, commit and push.

