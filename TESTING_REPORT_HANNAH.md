# Testing Report: Hannah's Journey Through Catered By Me

**Date:** December 2024  
**Tester:** Code review simulation  
**User Persona:** Hannah (Weekday Prepper, Holiday Host, Girls' Night Host)

---

## 🎯 Executive Summary

The app has solid functionality but needs significant UX polish, error handling, and onboarding improvements. Key gaps:

1. **No first-run experience** - New users are dropped into an empty dashboard with no guidance
2. **Generic error messages** - API errors show technical messages, not user-friendly ones
3. **Missing microcopy** - Empty states are functional but lack personality
4. **No onboarding** - Users must figure out the flow themselves
5. **Error handling gaps** - Network failures, auth errors not gracefully handled
6. **Confusing flows** - Recipe attachment to events could be clearer

---

## 📋 Detailed Findings

### 1. First-Time User Experience (Critical)

#### Issue: Empty Dashboard with No Guidance
**Location:** `apps/web/src/app/app/page.tsx`

**Current State:**
- New user sees empty dashboard with generic empty states
- No explanation of what the app does
- No guided first step

**What Hannah Sees:**
```
My Kitchen
Hi, hannah@example.com 👋
We see you, Weekday Warrior. Let's feed Future You.

Next event
No events on the calendar (yet)
You know something's coming. Start with the next dinner...
[Plan a new event]

This week's prep
No weekly prep planned
Want lunches and breakfasts to run on autopilot?...
[Set up weekly prep]

Recent recipes
No recipes yet.
[Add your first recipe]
```

**Problems:**
- Too many CTAs competing for attention
- No clear "start here" path
- Doesn't explain what an "event" is vs a "recipe"
- No inline explainer of what the app does

**Recommendation:**
- Add prominent card at top: "Catered By Me turns *what you want to cook* into *a real-time plan, grocery list, and timing map*."
- Single primary CTA: "Create your first event"
- Hide other sections until user has at least one event

---

### 2. Error Handling (Critical)

#### Issue: Generic API Error Messages
**Location:** `apps/web/src/lib/api.ts` (lines 60-70)

**Current State:**
```typescript
if (!res.ok) {
  let message = `API error: ${res.status}`;
  try {
    const body = await res.json();
    if (body.detail) {
      message = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
    }
  } catch {
    // ignore JSON parse errors
  }
  throw new Error(message);
}
```

**Problems:**
- Shows technical errors like "API error: 500" or raw Supabase errors
- No retry logic for network failures
- No user-friendly error translation
- Errors shown via `alert()` in some places (bad UX)

**Example Errors Hannah Might See:**
- "API error: 500" (when backend is down)
- "JWT expired" (when session expires)
- "Failed to load events" (generic, no context)

**Recommendation:**
- Create `apps/web/src/lib/errors.ts` with `apiErrorToMessage()` helper
- Map common errors to friendly messages:
  - Network errors → "We couldn't reach the server. Check your connection."
  - Auth errors → "Your session expired. Please sign in again."
  - 500 errors → "Something went wrong. Please try again in a moment."
- Add retry logic for critical actions (schedule generation, saves)
- Use toast notifications instead of alerts

---

### 3. Empty States Need Personality

#### Issue: Generic Empty State Copy
**Locations:**
- `apps/web/src/app/app/recipes/page.tsx` (line 103): "No recipes yet"
- `apps/web/src/app/app/events/page.tsx` (line 101): "No events yet. Either you're overdue for a dinner party, or you're finally resting."
- `apps/web/src/app/app/page.tsx` (line 122): "No events on the calendar (yet)"

**Current State:**
- Some have personality ("Either you're overdue for a dinner party...")
- Others are generic ("No recipes yet")
- Inconsistent tone

**Recommendation:**
- Use `getMessage()` pattern from `messages.ts` for all empty states
- Add message keys:
  - `no_recipes_yet`: "Your recipe bank is empty. Time to start building your arsenal."
  - `no_events_yet`: "No events planned yet. Let's fix that – create your first event."
  - `no_upcoming_events`: "Nothing on the calendar. Perfect time to plan something delicious."

---

### 4. Recipe Attachment Flow (Confusing)

#### Issue: Unclear How to Attach Recipes to Events
**Location:** `apps/web/src/app/app/events/[id]/page.tsx`

**Current State:**
- User creates event
- Must click "Add recipe" button
- Modal shows recipe picker
- Must also set "target headcount" per recipe (confusing)

**Problems:**
- No explanation of why you'd attach recipes
- "target headcount" concept not explained
- No visual feedback when recipe is attached
- Can't see what recipes are attached until you scroll

**Recommendation:**
- Add inline help text: "Attach recipes to generate a combined game plan and grocery list"
- Show attached recipes prominently at top
- Explain target headcount: "How many people will this recipe serve at this event?"

---

### 5. Schedule Generation Errors (No Feedback)

#### Issue: Silent Failures on Schedule Generation
**Location:** `apps/web/src/app/app/events/[id]/page.tsx` (lines 150-170)

**Current State:**
```typescript
const handleGeneratePlan = async () => {
  try {
    const schedule = await generateEventPlan(eventId, session);
    setSchedule(schedule);
  } catch (err) {
    console.error("Failed to generate plan:", err);
    // No user feedback!
  }
};
```

**Problems:**
- Errors only logged to console
- User sees nothing if generation fails
- No loading state feedback
- No retry option

**Recommendation:**
- Add loading spinner during generation
- Show toast notification on error
- Display error message in UI
- Add retry button

---

### 6. Grocery List Empty State

#### Issue: Generic Message When No Recipes Attached
**Location:** `apps/web/src/app/app/events/[id]/grocery/page.tsx` (line 212)

**Current State:**
```
No recipes attached to this event yet.
[Add recipes]
```

**Problems:**
- Generic message
- Doesn't explain why you need recipes for grocery list
- Link goes back to event page (user might not know to attach recipes first)

**Recommendation:**
- More helpful message: "No recipes attached yet. Attach recipes to this event to generate your grocery list."
- Direct link to event page with recipe picker open

---

### 7. Missing Onboarding

#### Issue: No First-Run Walkthrough
**Location:** None (doesn't exist)

**Current State:**
- User signs up
- Immediately dropped into empty dashboard
- Must figure out flow themselves

**Recommendation:**
- Add `onboarding_completed` field to profiles table
- Create `FirstRunTour.tsx` component
- Show 3-step tour:
  1. "Create your first event"
  2. "Attach recipes"
  3. "Generate your game plan"
- Allow "Skip tour" option

---

### 8. Network Error Handling

#### Issue: No Handling for Offline/Network Failures
**Location:** All API calls

**Current State:**
- If network fails, user sees generic error
- No retry logic
- No offline detection

**Recommendation:**
- Add retry wrapper in `api.ts`
- Detect network failures specifically
- Show "Check your connection" message
- Auto-retry on network errors (up to 2-3 times)

---

### 9. Session Expiration

#### Issue: No Graceful Handling of Expired Sessions
**Location:** All authenticated pages

**Current State:**
- If JWT expires, API calls fail
- User sees error but doesn't know why
- Must manually sign in again

**Recommendation:**
- Detect JWT/auth errors
- Show friendly message: "Your session expired. Redirecting to sign in..."
- Auto-redirect to sign-in page
- Preserve intended destination (redirect back after sign-in)

---

### 10. Loading States

#### Issue: Inconsistent Loading Feedback
**Locations:** Various pages

**Current State:**
- Some pages show spinners
- Others show nothing during loading
- No skeleton screens

**Recommendation:**
- Consistent loading pattern across all pages
- Skeleton screens for better perceived performance
- Loading text: "Loading your kitchen..." (on-brand)

---

## 🎨 UX Polish Issues

### 11. Visual Hierarchy in Schedule View

#### Issue: Hard to Distinguish Recipes in Multi-Recipe Schedules
**Location:** `apps/web/src/components/ScheduleView.tsx`

**Current State:**
- All tasks look the same
- No visual indication of which recipe a task belongs to
- Grocery list doesn't show recipe colors

**Recommendation:**
- Add color coding per recipe (use `getRecipeColor()` helper)
- Show recipe name with color chip on each task
- Use same colors in grocery list

---

### 12. Grocery List Print Layout

#### Issue: Could Be More Organized
**Location:** `apps/web/src/app/app/events/[id]/grocery/print/page.tsx`

**Current State:**
- Two-column layout works
- But sections could have stronger visual separation

**Recommendation:**
- Add border-bottom to section headers
- More spacing between sections
- Recipe tags on items (small chip)

---

## 🚨 Critical Issues (Fix Before Launch)

1. **Error handling** - Users see technical errors
2. **No onboarding** - New users are lost
3. **Silent failures** - Schedule generation errors not shown
4. **Session expiration** - No graceful handling

---

## 📝 Medium Priority (Fix Soon)

5. **Empty state microcopy** - Needs personality
6. **Recipe attachment flow** - Unclear
7. **Loading states** - Inconsistent
8. **Network error handling** - No retry logic

---

## ✨ Nice to Have (Phase 3.5)

9. **Visual hierarchy** - Color coding for recipes
10. **Print layout** - Better section separation
11. **Onboarding tour** - First-run walkthrough

---

## 🧪 Test Scenarios to Run Manually

### Scenario 1: First-Time User
1. Sign up with new email
2. Land on dashboard
3. Try to create first event
4. Try to attach recipe (but have none)
5. Create recipe first
6. Go back to event
7. Attach recipe
8. Generate plan

**Expected Issues:**
- No guidance on what to do first
- Confusion about recipe vs event
- Must navigate back and forth

### Scenario 2: Network Failure
1. Disconnect internet
2. Try to create event
3. Try to generate schedule

**Expected Issues:**
- Generic error messages
- No retry option
- User doesn't know what to do

### Scenario 3: Session Expiration
1. Sign in
2. Wait for session to expire (or manually expire)
3. Try to create event

**Expected Issues:**
- Error message not clear
- Must manually sign in again
- Loses context

### Scenario 4: Multi-Recipe Event
1. Create event with 3 recipes
2. Generate schedule
3. View grocery list

**Expected Issues:**
- Hard to see which tasks belong to which recipe
- Grocery list doesn't show recipe grouping clearly
- No color coding

---

## 📊 Summary Statistics

- **Critical Issues:** 4
- **Medium Priority:** 4
- **Nice to Have:** 3
- **Total Issues Found:** 11

---

## 🎯 Recommended Action Plan

### Phase 3.5 (Immediate)
1. Add error handling helper (`errors.ts`)
2. Add toast notifications
3. Improve empty state microcopy
4. Add onboarding tour
5. Fix session expiration handling

### Phase 4 (Before Launch)
6. Add retry logic for network errors
7. Improve recipe attachment flow
8. Add loading states everywhere
9. Add color coding for recipes
10. Improve print layout

---

**Next Steps:**
1. Review this report with Frat
2. Prioritize fixes
3. Create implementation tickets
4. Test fixes with real user (Hannah persona)

