# Phase 3.5: UX Polish & Microcopy

**Goal:** Make the app feel polished, on-brand, and immediately understandable. Fix the "first 5 minutes" experience and wire personality-driven microcopy throughout.

---

## 1. Onboarding & First-Run Experience

### 1.1 First-Run Walkthrough
**Create:** `apps/web/src/components/onboarding/FirstRunTour.tsx`

**Behavior:**
- On first login (check `profiles.onboarding_completed` or similar), show a 3-step tour:
  1. "Create your first event – 'Girls' Night' – we'll walk you through it"
  2. "Attach recipes to your event"
  3. "Generate your game plan and grocery list"
- Use a modal/overlay with brand voice
- "Skip tour" option
- Mark `onboarding_completed = true` in profile after completion

### 1.2 Starter Pack / Sample Events
**Create:** `apps/web/src/app/app/onboarding/page.tsx` (optional redirect target)

**Behavior:**
- After signup, show 2-3 sample events:
  - "Your Week" (meal prep example)
  - "Holiday Dinner Demo" (big event example)
- Each has a "Duplicate this event" button
- When duplicated, it becomes the user's real event (they can edit)
- Sample events are read-only until duplicated

**Backend:**
- Add `is_sample: boolean` to `events` table (optional, or use a special user_id like `sample_user`)
- `POST /events/{id}/duplicate` endpoint

### 1.3 Inline Explainer on Dashboard
**Update:** `apps/web/src/app/app/page.tsx`

**Add:** A small card at the top (only shown if user has 0 events):
```
"Catered By Me turns *what you want to cook* into *a real-time plan, grocery list, and timing map*."
[Create your first event] button
```

---

## 2. Microcopy Pass

### 2.1 Empty States
**Update all empty states with brand voice:**

**Files to update:**
- `apps/web/src/app/app/recipes/page.tsx` - "No recipes yet"
- `apps/web/src/app/app/events/page.tsx` - "No events yet"
- `apps/web/src/app/app/page.tsx` - "No upcoming events"
- `apps/web/src/app/app/events/[id]/grocery/page.tsx` - "No recipes attached"

**Message examples (use `getMessage()` pattern):**
- No recipes: "Your recipe bank is empty. Time to start building your arsenal."
- No events: "No events planned yet. Let's fix that – create your first event."
- No upcoming: "Nothing on the calendar. Perfect time to plan something delicious."

### 2.2 Capacity Jokes in More Places
**Update:** `apps/web/src/components/events/EventForm.tsx`

**Add:** Real-time validation that shows warnings *before* schedule generation:
- If headcount > 50 and user has 1 oven → show: "That's a lot of mouths for one oven. We'll make it work, but you might want to delegate dessert."
- If event date is tomorrow and user has 5 recipes → show: "Tomorrow? Ambitious. We'll build you a plan, but consider starting prep tonight."

**Use:** `getMessage()` with new keys like `ambitious_headcount`, `tight_timeline`

### 2.3 Grocery List Microcopy
**Update:** `apps/web/src/app/app/events/[id]/grocery/page.tsx`

**Add personality to:**
- Section headers: "Produce" → "Fresh stuff"
- Empty sections: "Nothing here yet"
- Copy button success: "List copied! Now go shop."

---

## 3. Visual Hierarchy Improvements

### 3.1 Per-Dish Color Coding
**Update:** `apps/web/src/components/ScheduleView.tsx`

**Behavior:**
- Each recipe gets a color chip (use a palette: sage, apricot, navy, etc.)
- Tasks in schedule show recipe name with color chip
- Grocery items show which recipe they're from with color chip

**Implementation:**
- Generate color from recipe ID hash (consistent per recipe)
- Use `apps/web/src/lib/colors.ts` helper:
  ```typescript
  export function getRecipeColor(recipeId: string): string {
    const colors = ['#4F7C63', '#F4A87A', '#2C3E50', '#8B7355', '#A67C52'];
    const hash = recipeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }
  ```

### 3.2 Grocery Print Grouping
**Update:** `apps/web/src/app/app/events/[id]/grocery/print/page.tsx`

**Improvements:**
- Stronger section headers (border-bottom, more spacing)
- Subtle separators between sections
- Recipe tags on items (small chip showing which recipe)

---

## 4. Shareable Read-Only Links

### 4.1 Public Event Tokens
**Backend:** `apps/api/routers/events.py`

**Add:**
- `POST /events/{id}/share` → generates `public_token` (UUID), stores in `events.public_token`
- `GET /events/public/{token}` → returns event + schedule + grocery (no auth required, read-only)

**Frontend:** `apps/web/src/app/share/e/[token]/page.tsx`

**Behavior:**
- Shows event name, date, schedule, grocery list
- No edit buttons, no auth required
- "Share this link" button that copies URL
- Branded header/footer

---

## 5. Week View (Roadmap Addition)

**Note:** This is a **future feature**, but we should add it to roadmap.

**Concept:**
- `/app/plan/week` view
- Shows all events in a date range (default: current week)
- Calendar-like layout with events as cards
- Can see "what's cooking when" across multiple days

**Implementation:** Phase 4 or later (not blocking MVP)

---

## Testing Checklist

After implementation:
- [ ] First-time user can complete onboarding tour
- [ ] Sample events can be duplicated
- [ ] All empty states have personality-driven copy
- [ ] Capacity warnings appear in event form (before schedule generation)
- [ ] Schedule view shows recipe color coding
- [ ] Grocery print has clear visual hierarchy
- [ ] Shareable links work without login
- [ ] All microcopy uses `getMessage()` or brand voice

---

## Files to Create/Update

**New:**
- `apps/web/src/components/onboarding/FirstRunTour.tsx`
- `apps/web/src/lib/colors.ts` (recipe color helper)
- `apps/web/src/app/share/e/[token]/page.tsx`
- `apps/web/src/app/app/onboarding/page.tsx` (optional)

**Update:**
- `apps/web/src/app/app/page.tsx` (inline explainer)
- `apps/web/src/app/app/recipes/page.tsx` (empty state)
- `apps/web/src/app/app/events/page.tsx` (empty state)
- `apps/web/src/components/events/EventForm.tsx` (capacity warnings)
- `apps/web/src/components/ScheduleView.tsx` (color coding)
- `apps/web/src/app/app/events/[id]/grocery/page.tsx` (microcopy)
- `apps/web/src/app/app/events/[id]/grocery/print/page.tsx` (visual hierarchy)
- `apps/api/routers/events.py` (share endpoint)
- `supabase/schema.sql` (add `public_token` to events, `onboarding_completed` to profiles)

---

## Brand Voice Reminders

- Friendly, confident, lightly cheeky
- Never condescending
- Helpful but not hand-holdy
- Use contractions ("we'll", "you're")
- Reference real cooking scenarios
- Acknowledge when things are ambitious (with encouragement)

