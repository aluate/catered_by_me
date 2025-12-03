# CateredByMe Fixes Plan

**Date:** November 30, 2025  
**Issues to Address:**
1. Login flow requires email verification (user finds it "ridiculous")
2. Need recipe library with search functionality

---

## Issue 1: Login Flow

### Current Behavior
- User enters email
- Supabase sends magic link
- User must check email and click link
- User finds this "ridiculous"

### Options to Fix

**Option A: Add Password-Based Auth** (Most User-Friendly)
- Add password field to sign-in
- Allow users to choose: password or magic link
- More traditional login experience

**Option B: Add OAuth Providers** (Fastest Login)
- Add "Sign in with Google"
- One-click authentication
- No email verification needed

**Option C: Keep Magic Link but Improve UX**
- Better messaging about magic link
- "We've sent you a magic link" with auto-check
- Remember device option

### Recommendation
**Implement Option A + B**: Password auth for returning users, OAuth for quick access.

---

## Issue 2: Recipe Library

### What's Needed
- Public recipe library (available to all users)
- Search functionality
- 20+ public domain recipes
- Users can browse and save recipes to their collection

### Implementation Plan

1. **Database Schema**
   - Add `recipe_library` table for public recipes
   - Flag recipes as public vs. user-specific
   - Add search index

2. **Backend API**
   - `GET /recipes/library` - List public recipes
   - `GET /recipes/library/search` - Search public recipes
   - `POST /recipes/library/:id/save` - Save to user's collection

3. **Frontend**
   - Recipe library page
   - Search component
   - Browse categories
   - Save to "My Recipes"

4. **Seed Data**
   - Add 20+ public domain recipes
   - Include classics (public domain works well here)

---

## Implementation Priority

1. **Recipe Library** (Higher Value)
   - Adds immediate value to site
   - Can be done without auth changes
   - Users can discover recipes

2. **Login Flow** (UX Improvement)
   - Improves onboarding experience
   - Requires auth system changes

---

**Starting with Recipe Library implementation...**

