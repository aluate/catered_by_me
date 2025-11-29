# Authentication & User Accounts

## Overview

Catered By Me uses Supabase for authentication and user management. Users sign in via email magic links (no passwords required).

## Frontend Implementation

### Supabase Client

**File:** `apps/web/src/lib/supabaseClient.ts`

- Creates a singleton Supabase client for browser use
- Reads `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from environment
- Uses `@supabase/supabase-js` for client creation

### Auth Provider & Context

**Files:**
- `apps/web/src/components/auth/AuthProvider.tsx` - React context provider
- `apps/web/src/hooks/useAuth.ts` - Hook (exported from AuthProvider)

**Features:**
- Manages user session state
- Provides `user`, `session`, and `loading` state
- Methods: `signInWithEmail(email)`, `signOut()`
- Automatically listens for auth state changes

**Usage:**
```tsx
import { useAuth } from "../components/auth/AuthProvider";

function MyComponent() {
  const { user, signOut, loading } = useAuth();
  // ...
}
```

### Auth Pages

**Sign In:** `apps/web/src/app/auth/sign-in/page.tsx`
- Email input form
- Sends magic link via Supabase
- Shows confirmation message after submission
- Brand-consistent UI with friendly microcopy

**Callback:** `apps/web/src/app/auth/callback/page.tsx`
- Handles OAuth callback from magic link
- Exchanges code for session
- Redirects to `/app` on success, `/auth/sign-in` on failure

### Protected Routes

**Layout:** `apps/web/src/app/app/layout.tsx`
- Wraps all `/app/**` routes with `AuthProvider`
- Ensures auth context is available in authenticated area

### Header Integration

**File:** `apps/web/src/components/Header.tsx`

- Shows "Sign in" button when user is not logged in
- Shows "My Kitchen" link and "Sign out" button when user is logged in
- Handles mobile menu state

## Backend Implementation

### JWT Verification

**File:** `apps/api/dependencies.py`

**Dependencies:**
- `get_current_user_id()` - Optional auth (returns `None` if no token)
- `require_auth()` - Required auth (raises 401 if no token)

**How it works:**
1. Reads `Authorization: Bearer <token>` header
2. Verifies JWT signature using `SUPABASE_JWT_SECRET`
3. Extracts `user_id` from `sub` claim
4. Returns `user_id` or raises `HTTPException` if invalid

**Usage:**
```python
from .dependencies import require_auth

@app.get("/protected")
async def protected_endpoint(user_id: str = Depends(require_auth)):
    # user_id is guaranteed to be present
    return {"user_id": user_id}
```

### User Profile Endpoint

**File:** `apps/api/main.py`

**Endpoint:** `GET /users/me`

- Requires authentication (`require_auth` dependency)
- Currently returns 501 (not yet implemented)
- Will query Supabase `profiles` table in Phase 3D

**Response Model:**
```python
class ProfileResponse(BaseModel):
    id: str
    email: str
    display_name: Optional[str] = None
    default_headcount: Optional[int] = None
    oven_capacity_lbs: Optional[int] = None
    burner_count: Optional[int] = None
    created_at: str
    updated_at: str
```

## Environment Variables

### Frontend (Vercel)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon/public key

### Backend (Render)
- `SUPABASE_URL` - Supabase project URL (for future Supabase client)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (for admin operations)
- `SUPABASE_JWT_SECRET` - JWT secret for token verification

## Database Schema

**Table:** `profiles` (see `supabase/schema.sql`)

- Auto-created via trigger when user signs up
- Extends `auth.users` table
- Stores user preferences (default headcount, oven capacity, etc.)

## Flow Diagram

1. **Sign Up:**
   - User enters email on `/auth/sign-in`
   - Supabase sends magic link
   - User clicks link → redirected to `/auth/callback`
   - Callback exchanges code for session
   - Profile auto-created in `profiles` table (via trigger)
   - User redirected to `/app`

2. **Sign In:**
   - Same flow as sign up (Supabase handles both)

3. **API Requests:**
   - Frontend includes JWT in `Authorization: Bearer <token>` header
   - Backend verifies JWT and extracts `user_id`
   - Endpoint uses `user_id` to query user-specific data

## Testing Checklist

- [ ] Can sign up with email
- [ ] Receives magic link email
- [ ] Can click magic link and sign in
- [ ] Redirects to `/app` after sign in
- [ ] Header shows "My Kitchen" and "Sign out" when logged in
- [ ] Can sign out
- [ ] Session persists across page refreshes
- [ ] Protected API endpoints require valid JWT
- [ ] Invalid/expired tokens return 401

## Notes

- Anonymous endpoints (`/recipes/parse-text`, `/schedule/generate`) still work without auth
- Profile endpoint (`GET /users/me`) is placeholder until Phase 3D
- Supabase client not yet integrated in backend (will be added in Phase 3D)

