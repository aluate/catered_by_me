# Phase 3 Setup Guide - User Accounts & Recipe Bank

**This document is your checklist for setting up Phase 3 as Cursor builds it.**

---

## 1. Supabase Setup (Auth + Database)

### Create Supabase Project

1. Go to https://supabase.com
2. Sign up / Log in
3. Click **"New Project"**
4. Fill in:
   - **Name:** `catered-by-me` (or your choice)
   - **Database Password:** (save this securely)
   - **Region:** Choose closest to you
5. Click **"Create new project"**
6. Wait 2-3 minutes for project to initialize

### Get Your Keys

Once project is ready:

1. Go to **Settings** → **API**
2. Copy these values:

   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")
   - **service_role** key (under "Project API keys" - keep this secret!)

3. Go to **Settings** → **Auth** → **JWT Settings**
   - Copy the **JWT Secret** (or note where to find it)

---

## 2. Environment Variables

### Local Development

Create `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=https://catered-by-me.onrender.com
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Vercel (Frontend)

1. Go to https://vercel.com/dashboard
2. Select your `catered_by_me` project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = (your Supabase URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (your anon key)
   - Make sure they're set for **Production**, **Preview**, and **Development**

### Render (Backend)

1. Go to https://render.com/dashboard
2. Select your `catered-by-me` API service
3. Go to **Environment**
4. Add:
   - `SUPABASE_URL` = (your Supabase URL)
   - `SUPABASE_SERVICE_ROLE_KEY` = (your service_role key - keep secret!)
   - `SUPABASE_JWT_SECRET` = (your JWT secret)

---

## 3. Database Tables

When Cursor generates SQL migrations, you'll need to run them in Supabase:

1. Go to your Supabase project
2. Click **SQL Editor** in the left sidebar
3. Paste the SQL that Cursor generated
4. Click **Run** (or press Ctrl+Enter)
5. Verify tables were created:
   - Go to **Table Editor**
   - You should see: `users`, `recipes`, `events`, `event_recipes`

### Expected Tables

- **users** (or profile table) - user profiles with default headcount, oven capacity
- **recipes** - saved recipes with name, category, times, method
- **events** - saved events with name, date, headcount, vibe
- **event_recipes** - join table linking events to recipes with portions

---

## 4. Testing Checklist

Once Cursor finishes Phase 3, test these flows:

### ✅ Home Page (Anonymous)
- [ ] Still works without login
- [ ] "Try sample recipe" → "Generate Game Plan" shows schedule
- [ ] No errors in console

### ✅ Sign Up / Login
- [ ] Click "Log in / Sign up" in header
- [ ] Enter email, receive magic link (or use password if implemented)
- [ ] After login, see profile menu in header
- [ ] Can log out and log back in

### ✅ My Recipes Page
- [ ] Navigate to "My Recipes"
- [ ] See empty state (if no recipes yet)
- [ ] Click "Add recipe"
- [ ] Fill in form: name, category, headcount, prep/cook times, method
- [ ] Save recipe
- [ ] See it appear in list
- [ ] Refresh page → recipe still there (persisted to database)
- [ ] Can edit recipe
- [ ] Can delete recipe

### ✅ My Events Page
- [ ] Navigate to "My Events"
- [ ] See empty state (if no events yet)
- [ ] Click "Create event"
- [ ] Fill in: name, date, headcount, vibe
- [ ] Save event
- [ ] See it appear in list

### ✅ Event Detail Page
- [ ] Open an event
- [ ] See event basics (name, date, headcount, vibe)
- [ ] Click "Add recipe"
- [ ] Select from your saved recipes
- [ ] Set portion/headcount for each recipe
- [ ] Click "Generate Game Plan"
- [ ] See schedule appear
- [ ] If capacity issues, see personality warning messages

### ✅ Capacity Warnings
- [ ] Create event with too many oven dishes for one oven
- [ ] Generate plan
- [ ] See warning message from `messages.ts` (e.g., "Eyes a bit bigger than all those stomachs...")
- [ ] Warning is helpful, not harsh

---

## 5. Common Issues & Fixes

### "Invalid API key" error
- **Fix:** Double-check environment variables are set correctly in Vercel/Render
- Make sure you're using the right key (anon for frontend, service_role for backend)

### "Table does not exist" error
- **Fix:** Run the SQL migrations in Supabase SQL Editor
- Check Table Editor to verify tables were created

### "JWT verification failed"
- **Fix:** Make sure `SUPABASE_JWT_SECRET` is set in Render backend
- Verify the secret matches what's in Supabase Settings → Auth → JWT Settings

### CORS errors
- **Fix:** Make sure backend CORS includes your Vercel domain
- Check `apps/api/main.py` CORS origins list

---

## 6. What to Share with Frat

When Cursor finishes, share:

1. **The control document** (`control/WEB_PHASE3.md`) if Cursor created it
2. **Any SQL migrations** Cursor generated
3. **New API routes** Cursor added to FastAPI
4. **New pages/components** Cursor created
5. **Any errors** you encounter during testing
6. **Screenshots** of the new pages (if helpful)

---

## 7. Quick Reference: Supabase Keys Location

- **Project URL:** Settings → API → Project URL
- **anon public key:** Settings → API → Project API keys → `anon` `public`
- **service_role key:** Settings → API → Project API keys → `service_role` `secret` (keep this private!)
- **JWT Secret:** Settings → Auth → JWT Settings → JWT Secret

---

**Remember:** Don't commit `.env.local` or service_role keys to git. They should only exist in your local file and in Vercel/Render environment variables.

