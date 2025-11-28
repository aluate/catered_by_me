# Catered By Me – Web Phase 1 (Visual Refresh)

## Goal

Keep all existing functionality (sample recipe, schedule generation, lanes, API calls) but:

- Make the site feel modern and calm instead of 1995.

- Clearly explain what the app does and who it's for.

- Set up a structure we can build user accounts and dashboards into later.

No backend changes in this phase. **Frontend only**.

---

## Global design system

Use these as guidelines when updating components and styles.

### Colors

- `bg-body`: `#f7f3ee` (warm neutral background)

- `bg-card`: `#ffffff`

- `accent-primary`: `#3b7f5c` (muted green)

- `accent-primary-soft`: `#e2f0e8`

- `accent-danger`: existing red styles for errors are fine

- `text-main`: `#121212`

- `text-muted`: `#4b5563` (can use Tailwind `text-slate-600`)

### General style

- Rounded corners on cards and buttons (`rounded-xl` or similar)

- Subtle shadows on main cards only (not everything)

- Plenty of padding and spacing (`py-8`, `py-12`, `space-y-6`, etc.)

- Mobile-first, with a max-width layout on larger screens (`max-w-5xl` / `max-w-6xl` centered).

### Typography

Use the existing font setup but apply consistent hierarchy:

- Page title / hero H1: big (`text-3xl md:text-4xl`), bold.

- Section headings: `text-xl md:text-2xl`, semibold.

- Body: `text-base md:text-[15px]`, normal weight.

- Muted helper text: smaller, `text-sm text-muted`.

---

## Layout changes – `src/app/page.tsx`

### Overall page structure

Update the main page to be structured like this (top to bottom):

1. **Top nav / header bar**

2. **Hero section** (marketing message + CTA)

3. **Main app area** (RecipeForm + ScheduleView layout)

4. **"How it works" section**

5. **Footer**

### 1. Header

Add a simple header at the top:

- Left: text logo `Catered By Me` (no actual image yet)

- Right: placeholder nav links (non-functional for now):

  - "How it works" (scrolls to that section if easy)

  - "Log in" (just a button style, no auth yet)

Visual:

- Background: transparent over the body background.

- Content centered in the same max-width container as the body.

### 2. Hero section

Place this **above** the existing "form + schedule" content.

Content:

- H1:  

  `Turn chaos in the kitchen into a game plan.`

- Subheading:  

  `Paste your recipes, pick a serve time, and get a minute-by-minute schedule for the big day.`

- Primary button:  

  Label: `Try it now`  

  Behavior: scroll the page down to the form section.

- Secondary text link under the button:  

  `See how it works` → scrolls to the "How it works" section.

Layout:

- On desktop: hero content on the left, a simple "preview card" on the right (could show a mini timeline mock or just a card with bullets).

- On mobile: stack vertically.

Style:

- Background: same body color.

- Use accent-primary for the button background and white text.

### 3. Main app area (form + schedule)

Refine layout but keep logic:

- Wrap RecipeForm and ScheduleView in a section with a card-like container.

- On **desktop**: two columns:

  - Left column: RecipeForm

  - Right column: ScheduleView

- On **mobile**: stack form on top of schedule.

Additional tweaks:

- Give the form and schedule panels their own subtle card backgrounds within the container.

- Add section heading above the form:  

  `Build your game plan`

- Under the heading, a short line:  

  `Start with the sample recipe or paste your own.`

Ensure no existing behavior breaks:

- "Try sample recipe" still works.

- "Generate game plan" still calls the existing API and scrolls to the schedule.

### 4. "How it works" section

Add a new section **below** the app area with 3 steps.

Content:

- Section title: `How it works`

- Subtitle: `From idea to served-on-time in three simple steps.`

- 3 cards in a responsive grid (stack on small screens):

  1. **Step 1 – Add your recipes**  

     Text: `Paste recipe text or bring your favorite dishes into your Catered By Me library.`

  2. **Step 2 – Set headcount & serve time**  

     Text: `Tell us how many guests you're feeding and when you want to serve.`

  3. **Step 3 – Follow your game plan**  

     Text: `Get a minute-by-minute schedule grouped by prep, stove, oven, and more.`

Use simple icons from Lucide (if already available in the project) or lightweight inline SVGs; don't add new heavy dependencies.

### 5. Footer

Add a simple footer at the bottom:

- Text: `Catered By Me`

- Smaller line under: `Built for people who want to host and actually enjoy the party.`

- Centered, light text, small font size.

- Keep it subtle (`text-slate-500` style).

---

## Component styling tweaks

### `RecipeForm`

- Make the card feel cohesive with the design system:

  - Use `bg-card`, `rounded-xl`, `shadow-sm`.

- Ensure labels and inputs have consistent spacing.

- Make the primary submit button use `accent-primary` with hover state.

- Error or validation messages should use muted red but feel integrated with the new style.

### `ScheduleView`

- Keep the swim-lane logic as is, but refine visuals:

  - Each lane card: white background, rounded corners, title at top.

  - Lane title format:  

    `Prep`, `Stove`, `Oven`, `Counter`, `Passive`

  - Tasks: show time range in bold (or semibold), then the task label.

  - Use subtle dividers between tasks (`border-t`).

- Add a small heading above the schedule:  

  `Your game plan`

- If there is a warning/note (like "prep window exceeded"), present it as a small amber callout box above the lanes.

---

## Behavior & constraints

- **NO backend changes** in this phase.

- Do not change API endpoints or request/response shapes.

- Do not remove the "Try sample recipe" functionality.

- Keep all current TypeScript types compatible; only adjust UI and layout.

- Ensure page works well on mobile (narrow screen) and desktop.

---

## Files likely to be touched

- `apps/web/src/app/page.tsx`

- `apps/web/src/app/layout.tsx` or global layout file

- `apps/web/src/components/RecipeForm.tsx`

- `apps/web/src/components/ScheduleView.tsx`

- Global styles (e.g., `globals.css` or Tailwind config) if needed for colors

Keep changes localized and focused on visual/layout improvements.

---

