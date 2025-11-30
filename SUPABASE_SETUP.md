# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: `catered-by-me` (or your choice)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine to start

5. Click "Create new project"
6. Wait 2-3 minutes for project to initialize

## Step 2: Get Your Credentials

Once your project is ready:

1. Go to **Settings** → **API**
2. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (long string)
   - **service_role key**: `eyJhbGc...` (⚠️ Keep this secret!)

3. Go to **Settings** → **API** → **JWT Settings**
4. Copy the **JWT Secret** (used for token verification)

## Step 3: Run Database Schema

1. Go to **SQL Editor** in Supabase dashboard
2. Click "New query"
3. Copy the entire contents of `supabase/schema.sql`
4. Paste into the SQL editor
5. Click "Run" (or press Ctrl+Enter)
6. Verify tables were created:
   - Go to **Table Editor**
   - You should see: `profiles`, `recipes`, `events`, `event_recipes`, `waitlist`, `gift_codes`

## Step 4: Set Environment Variables in Render

1. Go to your Render dashboard
2. Select your service (`catered-by-me-api`)
3. Go to **Environment** tab
4. Add these variables:

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (the service_role key)
SUPABASE_JWT_SECRET=your-jwt-secret-here
```

5. Click "Save Changes"
6. Render will automatically redeploy

## Step 5: Set Environment Variables in Vercel (Frontend)

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... (the anon/public key)
NEXT_PUBLIC_API_BASE_URL=https://your-render-url.onrender.com
```

5. Click "Save"
6. Vercel will automatically redeploy

## Step 6: Verify Connection

### Backend (Render)
1. Check Render logs for startup errors
2. Visit `https://your-api.onrender.com/health`
3. Should return: `{"status": "ok"}`

### Frontend (Vercel)
1. Visit your Vercel URL
2. Try signing in (magic link)
3. Check browser console for errors

## Step 7: Test Database Connection

1. Go to Supabase **Table Editor**
2. Try creating a test profile manually
3. Or use the API to create a recipe/event
4. Verify data appears in Supabase

## Troubleshooting

### "Supabase not configured" errors
- **Cause**: Environment variables not set or incorrect
- **Fix**: Double-check all 3 variables in Render dashboard

### "JWT verification not configured"
- **Cause**: `SUPABASE_JWT_SECRET` missing
- **Fix**: Add JWT secret from Supabase Settings → API → JWT Settings

### "Table does not exist"
- **Cause**: Schema not run
- **Fix**: Run `supabase/schema.sql` in SQL Editor

### "Permission denied"
- **Cause**: RLS policies blocking access
- **Fix**: Verify RLS policies in schema.sql were created

### CORS errors
- **Cause**: Frontend URL not in backend CORS origins
- **Fix**: Add Vercel URL to `origins` list in `apps/api/main.py`

## Security Notes

⚠️ **Never commit these to git:**
- `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS - very powerful!)
- `SUPABASE_JWT_SECRET`
- Database password

✅ **Safe to commit:**
- `SUPABASE_URL` (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public, has RLS restrictions)

## Next Steps

After Supabase is connected:
1. Test user sign-up (magic link)
2. Test creating a recipe
3. Test creating an event
4. Test gift code creation/redeem
5. Verify data appears in Supabase Table Editor

