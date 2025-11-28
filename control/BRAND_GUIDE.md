# Catered By Me – Brand Guide v0.1

## Core idea

Turn the recipes you already love into a step-by-step game plan so everything hits the table at the same time.

## Primary avatar – Hannah

- Early 30s–40s, works, has a family, loves hosting.
- Uses Pinterest and food blogs but hates that none of them tell her what to do *when*.
- Two main use cases:
  1. **Weekday meal prep** – Sunday block for breakfasts + lunches.
  2. **Big events** – Friendsgiving, Christmas, birthdays, etc.

Internally we treat both as "Events":
- `type: "event"` – one-time party/dinner.
- `type: "prep-week"` – weekly prep window.

## Taglines

- Public hero line: **"Host the meal. We've got the rest."**
- Secondary: **"You know what looks good. We know how to get you there."**

Use these on:
- `<Head>` metadata
- Hero section
- Social share cards

## Voice

- Friendly, confident, lightly cheeky.
- Feels like a competent friend who's run Thanksgiving before.
- No profanity. Jokes should never target the user's body, family, or identity.
- Punch up at chaos (too many dishes, wild timelines), not at the person.

Examples:
- ✅ "This is more of a tasting menu than a Tuesday night. Want to drop one dish?"
- ✅ "Even a pro chef might sweat this timeline. Let's add a little buffer."
- ❌ "What were you thinking?" (too harsh)

## Visuals

Colors (Tailwind tokens):

- `bg` / canvas: `#F7F3EE` (warm neutral)
- `accent-primary`: `#4F7C63` (sage/olive)
- `accent-secondary`: `#F4A87A` (warm apricot/coral)
- `ink`: `#1E2220` (charcoal)
- `lane-bg`: `#E7E0D9` (subtle warm gray for schedule lanes)

Typography:

- One display font for headings (clean sans with soft curves).
- One body/UI font (Inter or system).
- Keep weight range between 400–700, no ultra-thin.

## Logo System

### Final Logo Design

The Catered By Me logo is a **round analog clock** with fork and knife as clock hands, representing "time to cook / time to host."

**Core Elements:**
- **Round clock face** with 12 tick marks
- **Fork** (2 tines only) acts as the short hand, pointing toward ~10:00
- **Knife** acts as the long hand, pointing toward ~4:00
- Hands form an asymmetrical "X" (not a perfect crosshair/target)
- **Major ticks** at 12, 3, 6, 9 (rectangular marks)
- **Minor ticks** at 1, 2, 4, 5, 7, 8, 10, 11 (small dots)

**Style:**
- Flat, minimal, friendly
- No spark/starburst/flare
- No crosshair or target vibes
- Clean, readable at all sizes

### Color Variants

1. **Primary** (`logo-clock-primary.svg`)
   - Uses `accent-primary` (#4F7C63 - sage/olive)
   - Default for headers, main branding

2. **Secondary** (`logo-clock-secondary.svg`)
   - Uses `accent-secondary` (#F4A87A - warm apricot)
   - For accents, highlights, special sections

3. **Mono** (`logo-clock-mono.svg`)
   - Uses `ink` (#1E2220 - charcoal)
   - For light backgrounds, favicon, single-color contexts

### Usage Guidelines

**Do:**
- Use primary variant in headers and main navigation
- Use mono variant for favicon and light backgrounds
- Keep wordmark "Catered By Me" with logo in headers
- Maintain minimum size for readability (32px minimum for icon)

**Don't:**
- Don't reinterpret as a crosshair or target
- Don't add extra elements (sparks, gradients, shadows)
- Don't use more than 2 tines on the fork
- Don't make hands perfectly symmetrical (keep the 10:00/4:00 angle)
- Don't remove any of the 12 tick marks

### Wordmark

- Text: "Catered By Me" (title case)
- Font: Bold, rounded sans-serif matching brand typography
- Color: `ink` (#1E2220)
- Can be hidden on mobile if space is tight (icon-only)

## Personality messages (microcopy)

We will support a small set of canned messages keyed by situation:

- `capacity_overload` – too much oven/station usage for the available window.
- `prep_window_too_short` – total prep time exceeds allowed window.
- `too_many_projects` – many complex multi-step recipes at once.

Each key should have 2–4 variations so the UI can choose one at random.

Tone: reassuring + mildly funny. Example for `capacity_overload`:

- "You might not have the space to pull this off. Let's rethink the plan."
- "Eyes a bit bigger than all those stomachs. Maybe move a dish to the stove or grill."
- "Your oven is yelling 'I'm full' in advance. Try staggering dishes or swapping in a stovetop option."

Example for `prep_window_too_short`:

- "This is a *speedrun*, not a dinner. Let's either start earlier or trim a dish."
- "Even Gordon Ramsay would sweat this timeline. Add a little more prep time?"
- "We can make this work *or* keep your sanity, but not both. Extend the window a bit."

Example for `too_many_projects`:

- "You've built a tasting menu, not a Tuesday night. Maybe swap one 'project' dish for a simple side."
- "Great choices. Also… do you own a brigade? If not, we might dial one dish back."

## Monetization strategy

- **Holiday Host Pass**: Free until Jan 15, then transition to paid.
- **Pricing**: $15/year (or $19/yr) for Pro tier.
- **Early adopter**: "Founding Host: $10/year locked in forever."
- **Free tier**: 2 saved events, no PDF export.
- **Pro tier**: Unlimited events, recipe bank, PDF export, sharing.

## Product roadmap

### Phase 0 (Current)
- Paste text recipes
- Generate schedule

### Phase 1 – URL import
- Parse recipe links from blogs (schema.org support)
- Fallback to heuristics

### Phase 2 – PDF & image upload
- OCR for scanned recipes
- User review/edit step before scheduling

### Phase 3 – Recipe bank & reuse
- Save recipes to library
- Tags and organization
- Reuse in multiple events

