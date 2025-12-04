# Catered-by-Me Backend Migration: Render → Vercel

**Date:** December 4, 2025  
**Status:** 🚧 In Progress

## 🎯 Goal

Completely remove dependency on Render by migrating all FastAPI backend functionality to Next.js Route Handlers on Vercel.

**Target Architecture:**
- ✅ Frontend: Next.js on Vercel
- ✅ Backend: Next.js API Routes on Vercel (replacing FastAPI)
- ✅ Database: Supabase (unchanged)
- ⚠️ Stripe: Disabled (keep disabled for now)

---

## 📋 Phase 1: Endpoint Inventory

### FastAPI Endpoints to Migrate

#### Main App Endpoints (`apps/api/main.py`)
- `GET /health` - Health check
- `POST /recipes/parse-text` - Parse recipe from text
- `POST /schedule/generate` - Generate cooking schedule
- `GET /users/me` - Get user profile
- `PUT /users/me` - Update user profile

#### Recipes Router (`apps/api/routers/recipes.py`)
- `GET /recipes` - List user's recipes (auth required)
- `POST /recipes` - Create recipe (auth required)
- `GET /recipes/{id}` - Get recipe (auth required)
- `PUT /recipes/{id}` - Update recipe (auth required)
- `DELETE /recipes/{id}` - Delete recipe (auth required)

#### Events Router (`apps/api/routers/events.py`)
- `GET /events` - List user's events (auth required)
- `POST /events` - Create event (auth required)
- `GET /events/{id}` - Get event with recipes (auth required)
- `PUT /events/{id}` - Update event (auth required)
- `DELETE /events/{id}` - Delete event (auth required)
- `POST /events/{id}/recipes` - Attach recipe to event (auth required)
- `DELETE /events/{id}/recipes/{recipe_id}` - Detach recipe from event (auth required)
- `POST /events/{id}/plan` - Generate event plan/schedule (auth required)
- `POST /events/{id}/share` - Create share link (auth required)
- `GET /events/public/{token}` - Get public event by token (no auth)

#### Gift Codes Router (`apps/api/routers/gift_codes.py`)
- `POST /gift-codes` - Create gift code (no auth)
- `POST /gift-codes/redeem` - Redeem gift code (auth required)
- `GET /gift-codes/{code}` - Get gift code details (public)

#### Recipe Library Router (`apps/api/routers/recipe_library.py`)
- `GET /recipes/library` - List public library recipes (no auth)
- `GET /recipes/library/{id}` - Get library recipe (no auth)
- `POST /recipes/library/{id}/save` - Save library recipe to user collection (auth required)

#### Billing Router (`apps/api/routers/billing.py`) - **DISABLED**
- `POST /billing/checkout` - Create Stripe checkout (auth required) - **KEEP DISABLED**
- `POST /billing/webhook` - Stripe webhook handler - **KEEP DISABLED**

#### Waitlist Router (`apps/api/routers/waitlist.py`)
- Need to check this router

---

## 🏗️ Phase 2: Next.js API Route Structure

All routes will be created under `apps/web/src/app/api/`:

```
apps/web/src/app/api/
├── health/
│   └── route.ts                    # GET /api/health
├── recipes/
│   ├── route.ts                    # GET, POST /api/recipes
│   ├── parse-text/
│   │   └── route.ts                # POST /api/recipes/parse-text
│   └── [id]/
│       └── route.ts                # GET, PUT, DELETE /api/recipes/[id]
├── schedule/
│   └── generate/
│       └── route.ts                # POST /api/schedule/generate
├── events/
│   ├── route.ts                    # GET, POST /api/events
│   ├── [id]/
│   │   ├── route.ts                # GET, PUT, DELETE /api/events/[id]
│   │   ├── recipes/
│   │   │   ├── route.ts            # POST /api/events/[id]/recipes
│   │   │   └── [recipeId]/
│   │   │       └── route.ts        # DELETE /api/events/[id]/recipes/[recipeId]
│   │   ├── plan/
│   │   │   └── route.ts            # POST /api/events/[id]/plan
│   │   └── share/
│   │       └── route.ts            # POST /api/events/[id]/share
│   └── public/
│       └── [token]/
│           └── route.ts            # GET /api/events/public/[token]
├── gift-codes/
│   ├── route.ts                    # POST /api/gift-codes
│   ├── redeem/
│   │   └── route.ts                # POST /api/gift-codes/redeem
│   └── [code]/
│       └── route.ts                # GET /api/gift-codes/[code]
├── recipes/
│   └── library/
│       ├── route.ts                # GET /api/recipes/library
│       └── [id]/
│           ├── route.ts            # GET /api/recipes/library/[id]
│           └── save/
│               └── route.ts        # POST /api/recipes/library/[id]/save
└── users/
    └── me/
        └── route.ts                # GET, PUT /api/users/me
```

---

## 🔧 Phase 3: Implementation Strategy

### Shared Utilities
- Create `apps/web/src/lib/api-server.ts` for:
  - Supabase server client initialization
  - Auth token extraction from headers
  - Common error handling
  - Response formatting

### Porting Logic
1. **Copy business logic** from FastAPI services to TypeScript
2. **Keep same request/response shapes** (or update frontend if needed)
3. **Use Supabase server client** with service role key (server-side only)
4. **Maintain auth semantics** - extract JWT from Authorization header

### Key Dependencies to Port
- Recipe parsing: `apps/api/services/parsing.py` → TypeScript
- Schedule generation: `apps/api/services/scheduler.py` → TypeScript
- Recipe scaling: `apps/api/services/scaling.py` → TypeScript
- Gift code logic: `apps/api/services/gift_codes.py` → TypeScript

---

## 🔄 Phase 4: Frontend Updates

### Update `apps/web/src/lib/api.ts`
- Change `API_BASE_URL` to use relative paths: `/api` instead of `NEXT_PUBLIC_API_BASE_URL`
- Remove `NEXT_PUBLIC_API_BASE_URL` env var requirement
- All API calls become relative (e.g., `fetch("/api/recipes")`)

### Update Public Event Page
- `apps/web/src/app/share/e/[token]/page.tsx` - Update to use `/api/events/public/[token]`

---

## 🧹 Phase 5: Cleanup

### Files to Remove/Deprecate
- `render.yaml` - Delete
- `apps/api/` - Mark as deprecated (keep for reference, add deprecation notice)
- All references to `render.com`, `onrender.com`, `RENDER_` env vars

### Documentation Updates
- Update `README.md` with new architecture
- Update deployment guides
- Remove Render setup instructions

---

## ✅ Phase 6: Testing Checklist

- [ ] Health check endpoint works
- [ ] Recipe parsing works
- [ ] Schedule generation works
- [ ] User profile CRUD works
- [ ] Recipe CRUD works
- [ ] Event CRUD works
- [ ] Event plan generation works
- [ ] Event sharing works
- [ ] Gift code creation/redeem works
- [ ] Recipe library browsing works
- [ ] No calls to Render URLs in network tab
- [ ] All auth-protected routes require valid JWT
- [ ] Public routes work without auth

---

## 📝 Notes

- **Stripe**: Keep disabled. Billing endpoints can be added later when Stripe is re-enabled.
- **Auth**: Using Supabase JWT tokens. Extract from `Authorization: Bearer <token>` header.
- **Database**: All endpoints use Supabase. Service role key needed for server-side operations.
- **CORS**: Not needed for same-origin requests (Vercel handles this).

---

## 🚀 Deployment

Once migration is complete:
1. Push to GitHub
2. Vercel auto-deploys (includes API routes)
3. Verify all endpoints work
4. Delete Render service
5. Remove `NEXT_PUBLIC_API_BASE_URL` from Vercel env vars

---

**Status:** ✅ **COMPLETE** - All endpoints migrated to Next.js API routes

## ✅ Completed Implementation

All FastAPI endpoints have been successfully migrated to Next.js API routes:

### Core Infrastructure
- ✅ Server-side Supabase client (`lib/api-server.ts`)
- ✅ Auth utilities (JWT extraction from headers)
- ✅ Recipe parsing logic (TypeScript port)
- ✅ Recipe scaling logic (TypeScript port)
- ✅ Schedule builder logic (TypeScript port)

### API Routes Implemented
- ✅ `GET /api/health` - Health check
- ✅ `GET/PUT /api/users/me` - User profile
- ✅ `GET/POST /api/recipes` - List/create recipes
- ✅ `GET/PUT/DELETE /api/recipes/[id]` - Recipe CRUD
- ✅ `POST /api/recipes/parse-text` - Parse recipe from text
- ✅ `POST /api/schedule/generate` - Generate schedule
- ✅ `GET/POST /api/events` - List/create events
- ✅ `GET/PUT/DELETE /api/events/[id]` - Event CRUD
- ✅ `POST /api/events/[id]/recipes` - Attach recipe to event
- ✅ `DELETE /api/events/[id]/recipes/[recipeId]` - Detach recipe
- ✅ `POST /api/events/[id]/plan` - Generate event plan
- ✅ `POST /api/events/[id]/share` - Create share link
- ✅ `GET /api/events/public/[token]` - Get public event
- ✅ `POST /api/gift-codes` - Create gift code
- ✅ `POST /api/gift-codes/redeem` - Redeem gift code
- ✅ `GET /api/gift-codes/[code]` - Get gift code
- ✅ `POST /api/waitlist` - Add to waitlist
- ✅ `GET /api/recipes/library` - List library recipes
- ✅ `GET /api/recipes/library/[id]` - Get library recipe
- ✅ `POST /api/recipes/library/[id]/save` - Save library recipe

### Frontend Updates
- ✅ Updated `lib/api.ts` to use relative `/api/*` URLs
- ✅ Updated share page to use new API route
- ✅ Removed dependency on `NEXT_PUBLIC_API_BASE_URL`

### Next Steps
1. Test all endpoints locally
2. Deploy to Vercel
3. Verify all functionality works
4. Delete Render service
5. Remove `NEXT_PUBLIC_API_BASE_URL` from Vercel env vars

