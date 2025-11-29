# Phase 4: Launch Readiness

**Goal:** Make the app production-ready with error handling, observability, limits, email capture, and clear pricing story.

---

## 1. Error Handling & User-Facing Messages

### 1.1 Central Error Helper
**Create:** `apps/web/src/lib/errors.ts`

**Behavior:**
```typescript
export function apiErrorToMessage(error: unknown): string {
  if (error instanceof Error) {
    // Network errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return "We couldn't reach the server. Check your connection and try again.";
    }
    // Supabase errors
    if (error.message.includes('JWT') || error.message.includes('auth')) {
      return "Your session expired. Please sign in again.";
    }
    // Generic API errors
    return error.message || "Something went wrong. Please try again.";
  }
  return "An unexpected error occurred. Please try again.";
}
```

### 1.2 Toast Notifications
**Create:** `apps/web/src/components/ui/Toast.tsx`

**Behavior:**
- Simple toast component (appears top-right, auto-dismisses after 3s)
- Use for non-fatal errors, success messages
- Integrate with error helper

**Update all API calls:**
- Wrap in try/catch
- Show toast on error
- Show success toast for key actions (recipe saved, event created, etc.)

### 1.3 Retry Logic for Critical Actions
**Update:** `apps/web/src/lib/api.ts`

**Add retry wrapper:**
```typescript
async function apiFetchWithRetry<T>(
  path: string,
  options: RequestInit,
  maxRetries = 2
): Promise<T> {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await apiFetch<T>(path, options);
    } catch (error) {
      if (i === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error("Max retries exceeded");
}
```

**Use for:**
- Schedule generation
- Recipe/event saves
- Profile updates

---

## 2. Observability & Logging

### 2.1 Backend Logging
**Update:** `apps/api/main.py`

**Add:**
- Structured logging (use Python `logging` module)
- Log all schedule generation attempts (success/failure)
- Log Supabase query errors with context
- Log authentication failures

**Example:**
```python
import logging

logger = logging.getLogger(__name__)

@router.post("/events/{id}/plan")
async def generate_event_plan(...):
    try:
        # ... generate schedule ...
        logger.info(f"Schedule generated for event {event_id}", extra={
            "event_id": event_id,
            "user_id": user_id,
            "recipe_count": len(recipes),
        })
        return schedule
    except Exception as e:
        logger.error(f"Schedule generation failed for event {event_id}", extra={
            "event_id": event_id,
            "error": str(e),
        }, exc_info=True)
        raise
```

### 2.2 Frontend Error Tracking (Optional)
**Note:** Add basic error boundary and console logging for now. Full analytics (PostHog/Plausible) can come later.

**Create:** `apps/web/src/components/ErrorBoundary.tsx`

**Behavior:**
- Catches React errors
- Shows friendly error page
- Logs to console (later: send to analytics)

---

## 3. Limits & Abuse Prevention

### 3.1 Rate Limiting
**Backend:** `apps/api/main.py`

**Add simple rate limiting:**
- Use a simple in-memory store (or Redis later)
- Limit `/schedule/generate` to 10 requests per minute per user
- Limit recipe/event creation to 20 per hour per user

**Response on limit hit:**
```json
{
  "error": "rate_limit_exceeded",
  "message": "You're making requests a bit too quickly. Take a breath and try again in a minute.",
  "retry_after": 60
}
```

### 3.2 Content Limits
**Backend:** `apps/api/routers/recipes.py`, `apps/api/routers/events.py`

**Add validation:**
- Max recipe title length: 200 chars
- Max recipe tasks: 50 per recipe
- Max total tasks per schedule: 100
- Max event name length: 200 chars

**Error messages:**
- "This recipe has a lot of steps. Consider breaking it into multiple recipes or simplifying."
- "This schedule would have too many tasks. Try splitting into multiple events."

### 3.3 Free Tier Enforcement
**Backend:** `apps/api/routers/events.py`, `apps/api/routers/recipes.py`

**Add middleware/check:**
- Before creating event/recipe, check user's current count
- If at limit, return:
  ```json
  {
    "error": "limit_exceeded",
    "message": "You've reached the free tier limit of 3 events. Upgrade to Pro for unlimited events.",
    "limit_type": "events",
    "current_count": 3,
    "limit": 3
  }
  ```

**Frontend:** Show upgrade prompt (don't block, just inform)

---

## 4. Email Capture & List Building

### 4.1 Marketing Page Email Form
**Update:** `apps/web/src/app/page.tsx` (landing page)

**Add:** "Join the Holiday Host beta" form
- Simple email input
- "Get recipes + hosting tips" checkbox
- Submit to backend endpoint (store in `waitlist` table or similar)

**Backend:** `apps/api/main.py`

**Add:** `POST /waitlist`
- Stores email, opt-in preferences
- Returns success (no auth required)

### 4.2 Signup Email Capture
**Update:** `apps/web/src/app/auth/sign-in/page.tsx`

**Add:** Optional checkbox:
- "Send me recipes and hosting tips" (checked by default)
- Store preference in profile when user signs up

### 4.3 Post-Event Feedback (Future)
**Note:** Add to roadmap, not blocking MVP

**Concept:**
- After event date passes, show optional "How was your dinner?" prompt
- Simple 1-5 star + optional note
- Store in `event_feedback` table

---

## 5. Pricing Page Clarity

### 5.1 Feature Comparison Table
**Update:** `apps/web/src/app/pricing/page.tsx`

**Add:** Clear comparison table:
| Feature | Free | Pro |
|---------|------|-----|
| Events | 3 | Unlimited |
| Recipes | 10 | Unlimited |
| Schedules | Unlimited | Unlimited |
| Grocery Lists | Yes | Yes |
| PDF Export | No | Yes |
| Sharing | No | Yes |
| Support | Community | Priority |

### 5.2 Grandfathered Users Concept
**Document:** Add to `control/MONETIZATION.md` (create if needed)

**Note:**
- Users who sign up before [launch date] get "Founding Host" rate ($10/year)
- Locked in forever
- Track via `profiles.subscription_tier` or `profiles.grandfathered_until`

### 5.3 Pricing Timeline
**Update:** `apps/web/src/app/pricing/page.tsx`

**Add clear copy:**
- "Everything works now, free through January 15, 2026"
- "After January 15, new users pay $15/year. Early birds get $10/year locked in."
- "Your account is grandfathered if you sign up before [date]"

---

## 6. Launch Narrative & Storytelling

### 6.1 About/Story Section
**Create:** `apps/web/src/app/about/page.tsx`

**Content:**
- "Why we built Catered By Me"
- Hannah's story (the persona)
- "Everyday is Thanksgiving" concept
- Link from footer

### 6.2 Hero Update
**Update:** `apps/web/src/app/page.tsx`

**Enhance hero with:**
- More specific value prop
- "See how it works" demo link
- Social proof (optional: "Join 100+ hosts planning their next meal")

### 6.3 Demo Page (Optional)
**Create:** `apps/web/src/app/demo/page.tsx`

**Content:**
- Screenshots of Hannah's week
- Sample events (read-only)
- "Try it yourself" CTA

---

## 7. Future Considerations (Documented)

### 7.1 Multi-Timezone & DST
**Document:** Add to `control/TECHNICAL_NOTES.md`

**Note:**
- All times are local to the host's browser timezone
- Event dates/times stored as ISO strings
- Display converted to user's local time
- Future: Allow timezone selection in profile

### 7.2 Data Export
**Document:** Add to roadmap

**Note:**
- Users will eventually ask for export
- Plan: `GET /users/me/export` endpoint
- Returns JSON/CSV of all recipes and events
- Phase 5 or later

### 7.3 Accessibility
**Document:** Add to `control/ACCESSIBILITY.md` (create)

**Checklist:**
- [ ] Color contrast meets WCAG AA (text vs backgrounds)
- [ ] All buttons/keyboard accessible
- [ ] Form labels have proper ARIA
- [ ] Screen reader testing
- [ ] Focus indicators visible

### 7.4 Testing Debt
**Document:** Add to `control/TESTING.md` (create)

**Plan:**
- Unit tests for scheduler logic
- Unit tests for grocery parsing
- Integration tests: event → plan → grocery flow
- E2E tests for critical paths (signup → create event → generate plan)

---

## Testing Checklist

After implementation:
- [ ] All API errors show user-friendly messages
- [ ] Toast notifications appear for key actions
- [ ] Retry logic works for schedule generation
- [ ] Backend logs schedule generation attempts
- [ ] Rate limiting prevents abuse
- [ ] Content limits enforced with helpful messages
- [ ] Free tier limits enforced (with upgrade prompt)
- [ ] Email capture works on landing page
- [ ] Pricing page has clear comparison table
- [ ] About page tells the story
- [ ] All documented future considerations are in control docs

---

## Files to Create/Update

**New:**
- `apps/web/src/lib/errors.ts`
- `apps/web/src/components/ui/Toast.tsx`
- `apps/web/src/components/ErrorBoundary.tsx`
- `apps/web/src/app/about/page.tsx`
- `control/MONETIZATION.md`
- `control/TECHNICAL_NOTES.md`
- `control/ACCESSIBILITY.md`
- `control/TESTING.md`

**Update:**
- `apps/web/src/lib/api.ts` (retry logic, error handling)
- `apps/api/main.py` (logging, rate limiting)
- `apps/api/routers/recipes.py` (content limits)
- `apps/api/routers/events.py` (content limits, free tier enforcement)
- `apps/web/src/app/page.tsx` (email form, hero update)
- `apps/web/src/app/auth/sign-in/page.tsx` (email opt-in)
- `apps/web/src/app/pricing/page.tsx` (comparison table, timeline)
- `supabase/schema.sql` (waitlist table, feedback table)

---

## Priority Order

1. **Error handling** (critical for production)
2. **Basic logging** (needed for debugging)
3. **Content limits** (prevent abuse)
4. **Email capture** (marketing)
5. **Pricing clarity** (conversion)
6. **Storytelling** (brand)

Rate limiting and free tier enforcement can come after initial launch if needed, but should be in place before scale.

