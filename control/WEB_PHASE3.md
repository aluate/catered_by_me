# Phase 3 – User Accounts & Recipe Bank

## Mission

Transform Catered By Me from an anonymous tool into Hannah's actual weeknight co-pilot with saved recipes, events, and persistent data.

**Phase 3 Goals:**
- User accounts with email-based authentication
- Recipe bank for saving and reusing recipes
- Event planning with attached recipes
- One-click plan generation from saved data
- Capacity warnings with personality messages

**Not in Phase 3:**
- Full auto-parsing from URLs/PDFs/images (Phase 4)
- Payments/monetization (Phase 5)
- Multi-user collaboration (future)

---

## Technical Architecture

### Auth & Database: Supabase

**Choice:** Supabase for auth + Postgres database

**Why:**
- Easy email magic-links
- Built-in Postgres
- Nice TypeScript client
- JWT-based auth that works with both Next.js and FastAPI

**Flow:**
- **Next.js:** Uses Supabase client for signup/login/logout, stores session in cookies
- **FastAPI:** Receives Supabase JWT in `Authorization: Bearer ...`, verifies JWT and extracts `user_id`

### Database Schema

#### Tables

1. **profiles** (extends Supabase auth.users)
   - `id` (uuid, PK, references auth.users)
   - `email` (text)
   - `display_name` (text)
   - `default_headcount` (int, nullable)
   - `oven_capacity_lbs` (int, nullable)
   - `burner_count` (int, nullable)
   - `created_at` (timestamptz)

2. **recipes**
   - `id` (uuid, PK)
   - `user_id` (uuid, FK → profiles.id)
   - `title` (text)
   - `category` (text: 'main' | 'side' | 'dessert' | 'app' | 'other')
   - `base_headcount` (int)
   - `prep_time_minutes` (int)
   - `cook_time_minutes` (int)
   - `method` (text: 'oven' | 'stovetop' | 'no_cook' | 'mixed')
   - `day_before_ok` (bool)
   - `source_type` (text: 'text' | 'url' | 'pdf' | 'image')
   - `source_raw` (jsonb) - original text/URL/metadata
   - `normalized` (jsonb) - parsed structure for scheduling
   - `notes` (text)
   - `created_at` (timestamptz)
   - `updated_at` (timestamptz)

3. **events**
   - `id` (uuid, PK)
   - `user_id` (uuid, FK → profiles.id)
   - `name` (text)
   - `event_type` (text: 'prep_week' | 'event')
   - `event_date` (timestamptz)
   - `headcount` (int)
   - `location` (text, nullable)
   - `vibe` (text: 'chill' | 'formal' | 'family_chaos')
   - `notes` (text, nullable)
   - `created_at` (timestamptz)
   - `updated_at` (timestamptz)

4. **event_recipes**
   - `id` (uuid, PK)
   - `event_id` (uuid, FK → events.id)
   - `recipe_id` (uuid, FK → recipes.id)
   - `target_headcount` (int)
   - `course_order` (int) - for display ordering
   - `is_primary` (bool) - main vs side

---

## Implementation Slices

### Slice 1: Auth + Recipe Saving (MVP)
- Supabase client setup in Next.js
- Email magic-link login
- "My Recipes" page
- Save recipes after generating schedule
- Re-load saved recipes into form

### Slice 2: Events + Capacity Warnings
- "My Events" page
- Create/edit events
- Attach recipes to events
- Generate plan from event
- Capacity warning system integration

### Slice 3: Profile & Onboarding
- User profile page
- Onboarding flow (default headcount, oven capacity)
- Profile settings

---

## FastAPI Endpoints (New)

All require authentication (JWT) except existing public endpoints:

### User Profile
- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update profile

### Recipes
- `GET /recipes` - List user's recipes
- `POST /recipes` - Create recipe
- `GET /recipes/{id}` - Get recipe detail
- `PUT /recipes/{id}` - Update recipe
- `DELETE /recipes/{id}` - Delete recipe

### Events
- `GET /events` - List user's events
- `POST /events` - Create event
- `GET /events/{id}` - Get event detail
- `PUT /events/{id}` - Update event
- `DELETE /events/{id}` - Delete event
- `POST /events/{id}/recipes` - Attach recipe to event
- `DELETE /events/{id}/recipes/{recipe_id}` - Remove recipe from event
- `POST /events/{id}/plan` - Generate schedule from event

---

## Frontend Pages & Components

### New Pages
- `apps/web/src/app/login/page.tsx` - Login/signup page
- `apps/web/src/app/recipes/page.tsx` - My Recipes list
- `apps/web/src/app/recipes/[id]/page.tsx` - Recipe detail/edit
- `apps/web/src/app/events/page.tsx` - My Events list
- `apps/web/src/app/events/[id]/page.tsx` - Event detail/planning
- `apps/web/src/app/profile/page.tsx` - User profile

### New Components
- `apps/web/src/components/auth/AuthProvider.tsx` - Supabase auth context
- `apps/web/src/components/auth/LoginButton.tsx` - Login/logout button
- `apps/web/src/components/recipes/RecipeCard.tsx` - Recipe list item
- `apps/web/src/components/events/EventCard.tsx` - Event list item
- `apps/web/src/components/events/EventPlanView.tsx` - Event planning interface

---

## UX Flows

### Flow 1: First-time Signup
1. User clicks "Get Started" or "Log in"
2. Email input → "Send magic link"
3. After login → onboarding questions:
   - Default headcount
   - Oven capacity
   - Burner count
4. Save to profile

### Flow 2: Building Recipe Bank
1. Navigate to "My Recipes"
2. See empty state or list of saved recipes
3. "Add recipe" → form with:
   - Name, category, headcount
   - Prep/cook times
   - Method (oven/stovetop/etc)
   - "Day before OK?" toggle
   - Notes
4. Save → appears in list
5. Click recipe → loads into main form

### Flow 3: Planning an Event
1. Navigate to "My Events"
2. "Create event" → form:
   - Name, date, headcount
   - Location, vibe
3. "Add recipe" → picker from saved recipes
4. Set portions for each recipe
5. "Generate Game Plan" → schedule appears
6. If capacity issues → show personality warning

---

## Personality & Microcopy

### Capacity Warnings
Backend returns warnings in schedule response:
```json
{
  "schedule": { ... },
  "warnings": ["oven_overbooked", "capacity_overload"]
}
```

Frontend shows:
- Message from `getMessage(warnings[0])`
- Optional explanation/suggestion

### Empty States
- **My Recipes:** "This is where grandma's stuffing and your weeknight tacos come to live together. Add your first recipe."
- **My Events:** "No events yet. Either you're overdue for a dinner party, or you're finally resting. Start with your next big meal."

---

## Environment Variables

### Frontend (Vercel)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Backend (Render)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET`

---

## Testing Checklist

See `PHASE3_SETUP.md` for full testing checklist.

---

## Notes

- Keep anonymous "quick try" flow working on home page
- All new features require authentication
- Use existing brand colors and components
- Maintain personality in all microcopy
- Capacity warnings should be helpful, not harsh

