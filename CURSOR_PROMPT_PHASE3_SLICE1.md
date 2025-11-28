# Cursor Prompt: Phase 3 Slice 1 - Auth + Recipe Saving

**Copy and paste this entire prompt into Cursor:**

---

## TASK: Implement Phase 3 Slice 1 - Authentication + Recipe Saving

You are implementing the first slice of Phase 3 for Catered By Me. This slice focuses on getting authentication working and allowing users to save recipes.

**Reference Documents:**
- `control/WEB_PHASE3.md` - Full Phase 3 specification
- `PHASE3_SETUP.md` - Setup instructions
- `control/BRAND_GUIDE.md` - Brand guidelines
- `supabase/schema.sql` - Database schema

---

## Requirements

### 1. Supabase Client Setup

**File:** `apps/web/src/lib/supabase.ts`

- Create Supabase client using `@supabase/supabase-js`
- Use environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Export client for use throughout the app

**Install dependency:**
```bash
npm install @supabase/supabase-js --prefix apps/web
```

### 2. Auth Provider & Context

**File:** `apps/web/src/components/auth/AuthProvider.tsx`

- Create React context for auth state
- Provide:
  - `user` - current user object
  - `loading` - auth loading state
  - `signIn` - function to send magic link
  - `signOut` - function to log out
- Use Supabase auth hooks/helpers
- Handle session persistence

**File:** `apps/web/src/components/auth/LoginButton.tsx`

- Component that shows:
  - "Log in" button when not authenticated
  - User menu (name/email + "Log out") when authenticated
- Use existing Button component from `components/ui/Button.tsx`
- Match brand styling

### 3. Update Header

**File:** `apps/web/src/components/Header.tsx`

- Add LoginButton component
- Show "My Recipes" link when authenticated (hidden when not)
- Keep existing navigation and logo

### 4. My Recipes Page

**File:** `apps/web/src/app/recipes/page.tsx`

- List user's saved recipes
- Show empty state if no recipes (use personality from brand guide)
- Each recipe shows:
  - Title
  - Category
  - Base headcount
  - Prep/cook times
- "Add Recipe" button (for now, can be placeholder or link to home)
- Click recipe → loads it into main form (we'll implement this)

**File:** `apps/web/src/components/recipes/RecipeCard.tsx`

- Card component for recipe list item
- Use brand colors and styling
- Clickable to load recipe

### 5. Save Recipe After Schedule Generation

**File:** `apps/web/src/components/RecipeForm.tsx`

- After successful schedule generation:
  - If user is logged in, show "Save Recipe" button
  - On click, save recipe to Supabase `recipes` table
  - Use existing recipe data (title, headcount, etc.)
  - Store `normalized` field with the parsed recipe structure
  - Show success message

### 6. Update Layout for Auth

**File:** `apps/web/src/app/layout.tsx`

- Wrap app with AuthProvider
- Ensure auth state is available throughout

### 7. API Endpoints (FastAPI)

**File:** `apps/api/main.py`

- Add JWT verification middleware
- Verify Supabase JWT tokens from `Authorization: Bearer ...` header
- Extract `user_id` from token

**New endpoints:**

- `GET /users/me` - Get current user profile
  - Requires auth
  - Returns profile data

- `GET /recipes` - List user's recipes
  - Requires auth
  - Returns list of user's recipes

- `POST /recipes` - Create recipe
  - Requires auth
  - Body: recipe data
  - Returns created recipe

**File:** `apps/api/dependencies.py`

- Add `get_current_user` dependency that:
  - Extracts JWT from header
  - Verifies with Supabase
  - Returns user_id

### 8. Environment Variables

**Note for user:** These need to be set in Vercel and Render:
- Frontend: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Backend: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`

---

## Implementation Notes

- **Keep existing functionality:** Anonymous users can still use the home page form
- **Brand consistency:** Use existing colors, Button component, typography
- **Error handling:** Show friendly error messages, not technical stack traces
- **Loading states:** Show loading indicators during auth and API calls
- **TypeScript:** All new code should be properly typed

---

## Testing Checklist

After implementation, verify:
1. Can sign up with email (magic link)
2. Can log in
3. Header shows user menu when logged in
4. "My Recipes" page accessible when logged in
5. Can save recipe after generating schedule
6. Saved recipe appears in "My Recipes" list
7. Anonymous users can still use home page form

---

## Files to Create/Modify

**New Files:**
- `apps/web/src/lib/supabase.ts`
- `apps/web/src/components/auth/AuthProvider.tsx`
- `apps/web/src/components/auth/LoginButton.tsx`
- `apps/web/src/app/recipes/page.tsx`
- `apps/web/src/components/recipes/RecipeCard.tsx`

**Modified Files:**
- `apps/web/src/app/layout.tsx`
- `apps/web/src/components/Header.tsx`
- `apps/web/src/components/RecipeForm.tsx`
- `apps/api/main.py`
- `apps/api/dependencies.py`
- `apps/web/package.json` (add @supabase/supabase-js)

---

## After Implementation

1. Run `npm run lint --prefix apps/web` and fix any errors
2. Run `npm run build --prefix apps/web` and ensure it succeeds
3. Provide summary of:
   - Files created/modified
   - Any design decisions made
   - Environment variables needed
   - Next steps for user

---

**Begin implementation now.**

