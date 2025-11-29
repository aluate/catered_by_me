# Prompt for Frat: Create Final Implementation Prompt for Cursor

**Context:** We need Frat to create a comprehensive, final Cursor prompt that will implement the complete "Hannah MVP" - turning Catered By Me from a prototype into a full-featured app.

---

## What Cursor Needs to Know

### Current State (What's Done)
- ✅ Backend API deployed on Render (recipe parsing + schedule generation)
- ✅ Frontend deployed on Vercel (Next.js 14, Phase 1+2 UI complete)
- ✅ Brand system in place (colors, logo, voice, taglines)
- ✅ Control docs exist: `WEB_PHASE1.md`, `WEB_PHASE2.md`, `WEB_PHASE3.md`, `BRAND_GUIDE.md`
- ✅ Supabase schema ready (`supabase/schema.sql`)
- ✅ Mock data created (`mockData.ts` with Hannah's recipes/events)
- ✅ Setup guides exist (`PHASE3_SETUP.md`, `CURSOR_PROMPT_PHASE3_SLICE1.md`)
- ✅ Grocery list design spec exists (screen + 8.5×11 print)
- ✅ Project status doc (`PROJECT_STATUS.md`)

### What's Missing (What Needs to Be Built)
1. **Auth system** - Supabase integration, login/signup, user sessions
2. **"My Recipes" page** - Save, edit, delete recipes tied to user account
3. **"My Events" page** - Create, manage events with attached recipes
4. **Grocery list view** - Screen view with store sections or by recipe
5. **Grocery print/PDF** - 8.5×11 print-ready layout
6. **Dashboard** - `/app` home page showing next event, weekly prep, recent activity
7. **Kitchen profile** - User settings for ovens, burners, counter space
8. **Soft coaching** - Capacity warnings using `messages.ts` personality
9. **Monetization prep** - Pricing page, soft paywall messaging (no Stripe yet)

---

## Key Requirements for Frat's Prompt

### 1. Emphasize Control Docs as Source of Truth
The prompt should:
- **Start by instructing Cursor to READ all control docs first**
- List them explicitly: `BRAND_GUIDE.md`, `WEB_PHASE1.md`, `WEB_PHASE2.md`, `WEB_PHASE3.md`, `PROJECT_STATUS.md`, etc.
- Tell Cursor: "If something is missing or unclear, CREATE or UPDATE a control doc first, then implement"
- Make it clear: **Don't guess - check the docs first**

### 2. Implementation Order (6 Slices)
The prompt should implement in this order:
1. **Slice 1:** Auth + "My Stuff" (recipes + events CRUD)
2. **Slice 2:** Grocery list screen view
3. **Slice 3:** Grocery print/PDF (8.5×11)
4. **Slice 4:** Dashboard (`/app` home)
5. **Slice 5:** Kitchen profile + coaching warnings
6. **Slice 6:** Monetization prep (pricing page, soft limits)

### 3. Technical Constraints
- Don't break existing deployment (Render/Vercel configs)
- Use existing design system (Tailwind tokens, Button component, colors)
- Keep TypeScript strict, no `any` types
- All new code must pass `npm run build` and linting
- Reuse existing components where possible

### 4. Data Flow
- Start with Supabase for auth + database
- Use `mockData.ts` as fallback during development
- Eventually wire real Supabase queries
- Keep the anonymous "quick try" flow working on home page

### 5. Brand Consistency
- Use `messages.ts` for all personality messages
- Follow voice guidelines from `BRAND_GUIDE.md`
- Use existing taglines: "Host the meal. We've got the rest."
- Keep colors: sage (#4F7C63), apricot (#F4A87A), ink (#1E2220)

### 6. Documentation Updates
- Update `PROJECT_STATUS.md` as each slice completes
- Create new control docs if needed (e.g., `WEB_GROCERY.md`, `WEB_DASHBOARD.md`)
- Don't leave gaps - if Cursor adds behavior, document it

---

## What Frat Should Include in His Prompt

### Opening Section
- Clear instruction: "Read all control docs in `control/` folder first"
- List of specific files to read
- Instruction: "If behavior is unclear, create/update a control doc before implementing"

### Implementation Philosophy
- Work in small, testable slices
- Each slice should be independently deployable
- Don't break existing functionality
- Update docs as you go

### Slice-by-Slice Breakdown
For each of the 6 slices, include:
- **Goal** - What this slice achieves
- **Files to create/modify** - Specific paths
- **Key features** - What must work
- **Integration points** - How it connects to existing code
- **Testing checklist** - How to verify it works

### Quality Gates
- TypeScript must compile
- ESLint must pass
- Build must succeed
- No breaking changes to existing routes
- Brand consistency maintained

### Final Deliverables
- All 6 slices implemented
- `PROJECT_STATUS.md` updated
- New control docs created where needed
- Ready for user testing

---

## Special Instructions for Frat

1. **Reference the existing roadmap** - The prompt Frat already wrote (`WEB_PHASE_ROADMAP.md` or similar) is good, but make sure it:
   - Explicitly tells Cursor to read control docs FIRST
   - Has clear slice boundaries
   - Includes file paths and specific implementation details
   - References existing components/utilities to reuse

2. **Make it actionable** - Each slice should have:
   - Clear acceptance criteria
   - Specific file paths
   - Code examples where helpful
   - Integration instructions

3. **Emphasize documentation** - Cursor should:
   - Update `PROJECT_STATUS.md` after each slice
   - Create control docs for new features
   - Not leave implementation details only in code

4. **Include safety checks** - The prompt should tell Cursor:
   - Don't modify deployment configs
   - Don't break existing API endpoints
   - Don't change brand colors/voice
   - Test that anonymous flow still works

---

## Expected Outcome

After Cursor completes this prompt, the app should have:

✅ **Full user accounts** - Login, profiles, saved data
✅ **Recipe management** - Save, edit, organize recipes
✅ **Event planning** - Create events, attach recipes, generate plans
✅ **Grocery lists** - Screen view + print-ready PDF
✅ **Dashboard** - Home base showing upcoming events and prep
✅ **Smart coaching** - Capacity warnings with personality
✅ **Monetization path** - Pricing page and soft limits visible

**The app should feel like a complete product, not a prototype.**

---

## What Frat Should Do

1. **Review the existing roadmap prompt** he created
2. **Enhance it with:**
   - Explicit "read control docs first" instruction
   - Clear slice boundaries with acceptance criteria
   - Specific file paths and component names
   - Integration instructions for each slice
   - Documentation requirements

3. **Save it as:**
   - `CURSOR_PROMPT_HANNAH_MVP.md` or
   - `control/WEB_PHASE_ROADMAP_FINAL.md`

4. **Make it ready for Karl to paste into Cursor**

---

**Frat, use this as your guide to create the final, comprehensive prompt that will get Cursor to ship the complete Hannah MVP.**

