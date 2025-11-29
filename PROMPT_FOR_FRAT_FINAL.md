# Comprehensive Project Roadmap Prompt for Frat

**Purpose:** This document outlines EVERYTHING that still needs to be done to complete Catered By Me from prototype to full "Hannah MVP" product. Frat will use this to create a detailed implementation prompt for Cursor.

---

## Current State Summary

### ✅ What's Complete and Working

1. **Infrastructure**
   - Backend API (FastAPI) deployed on Render
   - Frontend (Next.js 14) deployed on Vercel
   - CORS configured
   - Environment variables set up

2. **Core Functionality**
   - Recipe text parsing
   - Schedule generation (swim lanes: prep, stove, oven, etc.)
   - Anonymous "quick try" flow on home page

3. **Brand & UI (Phase 1 + 2)**
   - Complete brand guide with voice, colors, logo
   - Modern header, footer, hero section
   - "How it works" and "Built for Hosts Like You" sections
   - Button component system
   - Clock logo with fork/knife hands

4. **Phase 3 Groundwork**
   - Supabase schema created (`supabase/schema.sql`)
   - Database tables defined: profiles, recipes, events, event_recipes
   - Control docs: `WEB_PHASE3.md`, `PHASE3_SETUP.md`
   - Mock data created (`mockData.ts`)

5. **New Features Just Implemented**
   - Grocery list view (`/app/events/[id]/grocery`)
   - Grocery print/PDF view (`/app/events/[id]/grocery/print`)
   - Dashboard page (`/app`) with mock data
   - Grocery aggregation logic (`grocery.ts`)

---

## What Still Needs to Be Built (Complete Roadmap)

### 🔴 CRITICAL: Authentication & User Accounts

**Status:** Not implemented yet

**What's needed:**
1. Supabase client setup in Next.js
   - Install `@supabase/supabase-js`
   - Create client module using env vars
   - Session management

2. Auth UI
   - Sign in/sign up page
   - Magic link email flow
   - Auth callback handling
   - Login/logout buttons in header

3. Auth context/provider
   - React context for user state
   - Protected route handling
   - Session persistence

4. Backend JWT verification
   - FastAPI middleware to verify Supabase JWT
   - Extract user_id from tokens
   - Protect API endpoints

5. Profile creation
   - Auto-create profile on signup (trigger exists in schema)
   - Profile page for editing defaults
   - Kitchen capacity settings

**Files to create:**
- `apps/web/src/lib/supabaseClient.ts`
- `apps/web/src/components/auth/AuthProvider.tsx`
- `apps/web/src/components/auth/LoginButton.tsx`
- `apps/web/src/app/auth/sign-in/page.tsx`
- `apps/web/src/app/auth/callback/page.tsx`
- `apps/api/dependencies.py` (update with JWT verification)
- `apps/api/main.py` (add auth middleware)

**Dependencies:**
- Supabase keys must be set in Vercel and Render
- Database schema must be run in Supabase

---

### 🟠 HIGH PRIORITY: "My Recipes" Page (Real Data)

**Status:** Mock data exists, but no real CRUD yet

**What's needed:**
1. Recipe list page (`/app/recipes`)
   - Fetch user's recipes from Supabase
   - Display in cards with search/filter
   - Empty state with personality

2. Recipe detail/edit page (`/app/recipes/[id]`)
   - View recipe details
   - Edit form (name, category, ingredients, steps, times, method)
   - Save to Supabase

3. Create recipe page (`/app/recipes/new`)
   - Form to create new recipe
   - Save to Supabase `recipes` table

4. Recipe deletion
   - Delete button with confirmation
   - Remove from Supabase

5. Recipe saving from schedule
   - After generating schedule, option to "Save Recipe"
   - Store parsed recipe data in `normalized` JSONB field

**Files to create:**
- `apps/web/src/app/app/recipes/page.tsx` (real Supabase queries)
- `apps/web/src/app/app/recipes/[id]/page.tsx`
- `apps/web/src/app/app/recipes/new/page.tsx`
- `apps/web/src/components/recipes/RecipeCard.tsx`
- `apps/web/src/components/recipes/RecipeForm.tsx` (reusable)

**API endpoints needed:**
- `GET /recipes` - List user's recipes
- `POST /recipes` - Create recipe
- `GET /recipes/{id}` - Get recipe
- `PUT /recipes/{id}` - Update recipe
- `DELETE /recipes/{id}` - Delete recipe

---

### 🟠 HIGH PRIORITY: "My Events" Page (Real Data)

**Status:** Mock data exists, but no real CRUD yet

**What's needed:**
1. Events list page (`/app/events`)
   - Fetch user's events from Supabase
   - Tabs: "Upcoming" and "Past"
   - Event cards with status chips
   - Empty states

2. Event detail page (`/app/events/[id]`)
   - Show event info (name, date, headcount, vibe)
   - List attached recipes
   - "Add recipe" button (picker from user's recipes)
   - "Generate Game Plan" button (uses existing scheduler)
   - "View Grocery List" button (already implemented)
   - Capacity warnings if needed

3. Create event page (`/app/events/new`)
   - Form: name, date, headcount, type, vibe, location
   - Save to Supabase `events` table

4. Event editing
   - Edit event details
   - Add/remove recipes via `event_recipes` table
   - Update portions per recipe

5. Event deletion
   - Delete event and related `event_recipes`

**Files to create:**
- `apps/web/src/app/app/events/page.tsx` (real Supabase queries)
- `apps/web/src/app/app/events/[id]/page.tsx`
- `apps/web/src/app/app/events/new/page.tsx`
- `apps/web/src/components/events/EventCard.tsx`
- `apps/web/src/components/events/EventPlanView.tsx`

**API endpoints needed:**
- `GET /events` - List user's events
- `POST /events` - Create event
- `GET /events/{id}` - Get event with recipes
- `PUT /events/{id}` - Update event
- `DELETE /events/{id}` - Delete event
- `POST /events/{id}/recipes` - Attach recipe to event
- `DELETE /events/{id}/recipes/{recipe_id}` - Remove recipe
- `POST /events/{id}/plan` - Generate schedule from event

---

### 🟡 MEDIUM PRIORITY: Dashboard (Real Data)

**Status:** Mock data implemented, needs Supabase integration

**What's needed:**
1. Replace mock data with real queries
   - Fetch next upcoming event
   - Fetch weekly prep event
   - Fetch recent recipes
   - Fetch recent activity (can be derived from events/recipes)

2. Real-time updates
   - Refresh when events change
   - Show actual status from database

3. Navigation
   - Links to real event/recipe pages
   - "Create new" buttons work

**Files to update:**
- `apps/web/src/app/app/page.tsx` (replace mock with Supabase queries)

---

### 🟡 MEDIUM PRIORITY: Kitchen Profile & Capacity Settings

**Status:** Schema supports it, but no UI yet

**What's needed:**
1. Kitchen profile page (`/app/settings/kitchen`)
   - Form fields:
     - Number of ovens (1 or 2)
     - Oven capacity (full sheet pan? yes/no)
     - Number of burners (4, 6, etc.)
     - Counter space (tight, normal, island flex)
   - Save to `profiles` table

2. Default settings
   - Default headcount
   - Default prep window
   - "Energy level" preference

3. Profile page (`/app/profile`)
   - Display name, email
   - Link to kitchen settings
   - Account management

**Files to create:**
- `apps/web/src/app/app/settings/kitchen/page.tsx`
- `apps/web/src/app/app/profile/page.tsx`

**API endpoints needed:**
- `GET /users/me` - Get profile
- `PUT /users/me` - Update profile

---

### 🟡 MEDIUM PRIORITY: Capacity Coaching & Warnings

**Status:** `messages.ts` exists, but not wired to real logic

**What's needed:**
1. Backend capacity checking
   - Analyze schedule for oven conflicts
   - Check prep window vs available time
   - Return warning codes in schedule response

2. Frontend warning display
   - Show warnings above schedule
   - Use `getMessage()` for personality
   - Suggest fixes (move dish, extend time, etc.)

3. Integration points
   - Event plan generation
   - Schedule view component
   - Grocery list (if capacity issues affect shopping)

**Files to update:**
- `apps/api/services/scheduler.py` (add capacity checks)
- `apps/web/src/components/ScheduleView.tsx` (show warnings)
- `apps/web/src/app/app/events/[id]/page.tsx` (show warnings)

---

### 🟢 LOW PRIORITY: Grocery List Enhancements

**Status:** Basic implementation done, but can be improved

**What's needed:**
1. Better ingredient parsing
   - More accurate quantity extraction
   - Unit normalization
   - Ingredient merging (e.g., "onion" + "onions" = same item)

2. Shopping list features
   - Checkbox persistence (localStorage)
   - Quantity editing
   - Notes per item
   - Share list (copy, email, etc.)

3. Print improvements
   - Better formatting
   - Multi-page support
   - Customizable sections

**Files to enhance:**
- `apps/web/src/lib/grocery.ts` (better parsing)
- `apps/web/src/app/app/events/[id]/grocery/page.tsx` (add features)

---

### 🟢 LOW PRIORITY: Recipe Input Enhancements

**Status:** Text parsing works, but limited

**What's needed:**
1. URL import (Phase 4)
   - Paste recipe URL
   - Fetch and parse HTML
   - Extract recipe data (schema.org support)
   - Fallback to heuristics

2. PDF/image upload (Phase 4)
   - Upload scanned recipe
   - OCR processing
   - User review/edit step
   - Save to recipe bank

3. Recipe validation
   - Check for missing fields
   - Suggest improvements
   - Warn about unrealistic times

**Files to create (future):**
- `apps/web/src/app/app/recipes/import/page.tsx`
- `apps/api/services/url_parser.py`
- `apps/api/services/ocr_parser.py`

---

### 🟢 LOW PRIORITY: Monetization Prep

**Status:** Design discussed, not implemented

**What's needed:**
1. Pricing page (`/pricing`)
   - Free tier description
   - Paid tier ($15/year) description
   - "Holiday Host Pass" messaging
   - Upgrade CTA

2. Soft paywall
   - Client-side limits (e.g., 3 saved events)
   - Friendly upgrade prompts
   - No hard blocking yet

3. Feature flags
   - Track which features are free vs paid
   - Show upgrade prompts at limits

**Files to create:**
- `apps/web/src/app/pricing/page.tsx`
- `apps/web/src/lib/featureFlags.ts` (simple client-side)

**Note:** No Stripe integration yet - just UI/UX prep

---

### 🔵 FUTURE: Advanced Features

**Not in current scope, but documented for later:**

1. **Multi-kitchen support**
   - Save multiple kitchen profiles
   - Switch between them

2. **Recipe sharing**
   - Share recipes with friends
   - Public recipe library

3. **Event collaboration**
   - Invite co-hosts
   - Task assignment
   - Shared grocery lists

4. **Mobile app**
   - Native iOS/Android
   - Offline support

5. **Grocery app integration**
   - Instacart import
   - Shopping list sync

---

## Implementation Order (Recommended)

### Phase 3A: Auth Foundation (Week 1)
1. Supabase client setup
2. Auth UI (sign in/sign up)
3. Auth context/provider
4. Backend JWT verification
5. Profile auto-creation

### Phase 3B: Recipe Management (Week 1-2)
1. Recipe list page (Supabase)
2. Recipe create/edit pages
3. Recipe deletion
4. Save recipe from schedule
5. API endpoints for recipes

### Phase 3C: Event Management (Week 2)
1. Events list page (Supabase)
2. Event create/edit pages
3. Attach recipes to events
4. Generate plan from event
5. API endpoints for events

### Phase 3D: Dashboard & Integration (Week 2-3)
1. Dashboard with real data
2. Wire up all navigation
3. Kitchen profile page
4. Capacity coaching warnings

### Phase 3E: Polish & Prep (Week 3)
1. Grocery list enhancements
2. Pricing page
3. Soft paywall messaging
4. Final testing & bug fixes

---

## Technical Requirements

### Environment Variables Needed

**Frontend (Vercel):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Backend (Render):**
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET`

### Database Setup

1. Run `supabase/schema.sql` in Supabase SQL Editor
2. Verify tables created: profiles, recipes, events, event_recipes
3. Verify RLS policies are active
4. Verify triggers work (auto-create profile on signup)

### Code Quality Standards

- TypeScript strict mode
- No `any` types (document exceptions)
- ESLint passing
- Build succeeds (`npm run build`)
- All new pages responsive
- Brand consistency maintained

---

## Documentation Requirements

As Cursor implements, it should:

1. **Update `PROJECT_STATUS.md`** after each major feature
2. **Create new control docs** for new features:
   - `control/WEB_GROCERY.md` (if not exists)
   - `control/WEB_DASHBOARD.md`
   - `control/WEB_AUTH.md`
   - `control/WEB_COACHING.md`
   - `control/MONETIZATION.md`

3. **Keep existing docs updated:**
   - `WEB_PHASE3.md` - Mark completed sections
   - `BRAND_GUIDE.md` - Add new microcopy as needed

---

## Testing Checklist (For Each Feature)

1. **Auth:**
   - [ ] Can sign up with email
   - [ ] Can sign in with magic link
   - [ ] Can sign out
   - [ ] Profile auto-created
   - [ ] Protected routes work

2. **Recipes:**
   - [ ] Can create recipe
   - [ ] Can view recipe list
   - [ ] Can edit recipe
   - [ ] Can delete recipe
   - [ ] Can save recipe from schedule
   - [ ] Recipes persist after refresh

3. **Events:**
   - [ ] Can create event
   - [ ] Can view event list
   - [ ] Can attach recipes to event
   - [ ] Can generate plan from event
   - [ ] Can view grocery list for event
   - [ ] Can print grocery list

4. **Dashboard:**
   - [ ] Shows next event
   - [ ] Shows weekly prep
   - [ ] Shows recent recipes
   - [ ] Links work correctly

5. **Coaching:**
   - [ ] Warnings show for oven overload
   - [ ] Warnings show for prep window issues
   - [ ] Messages use personality from `messages.ts`
   - [ ] Warnings are helpful, not harsh

---

## What Frat Should Create

Frat should create a **detailed implementation prompt** that:

1. **References this roadmap** as the high-level plan
2. **Breaks down each phase** into specific tasks
3. **Provides exact file paths** and component names
4. **Includes code examples** where helpful
5. **Specifies integration points** with existing code
6. **Lists acceptance criteria** for each feature
7. **Emphasizes documentation** requirements
8. **Includes testing steps** for verification

The prompt should be comprehensive enough that Cursor can:
- Understand the full scope
- Implement features in the right order
- Know exactly what files to create/modify
- Maintain brand consistency
- Update documentation as it goes

---

## Success Criteria

When complete, the app should:

✅ **Feel like a real product** - Not a prototype
✅ **Hannah can log in** - Persistent account
✅ **Save her recipes** - Recipe bank works
✅ **Plan events** - Create events with recipes
✅ **Get grocery lists** - Screen view + print
✅ **See her dashboard** - Home base with upcoming events
✅ **Get smart coaching** - Capacity warnings with personality
✅ **See upgrade path** - Pricing page, soft limits visible

**The app should be ready for real users to test and use.**

---

**Frat, use this roadmap to create the detailed, step-by-step implementation prompt for Cursor that will get us from here to a complete, shippable product.**

