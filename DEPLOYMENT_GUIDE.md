# Deployment Guide - Catered By Me

## Overview
This document covers deployment for both the FastAPI backend (Render) and Next.js frontend (Vercel).

---

## Backend Deployment (Render)

### Prerequisites
- Render account connected to GitHub
- Supabase project with database schema deployed
- Environment variables ready

### Step 1: Create Render Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository: `catered_by_me`
5. Configure:
   - **Name**: `catered-by-me-api`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn apps.api.main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: Leave empty (uses repo root)

### Step 2: Environment Variables
Add these in Render Dashboard → Environment:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret

# Python Version (optional, set in render.yaml)
PYTHON_VERSION=3.11.11
```

**Where to find Supabase credentials:**
- `SUPABASE_URL`: Supabase Dashboard → Settings → API → Project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase Dashboard → Settings → API → service_role key (⚠️ Keep secret!)
- `SUPABASE_JWT_SECRET`: Supabase Dashboard → Settings → API → JWT Secret

### Step 3: Deploy
1. Click "Create Web Service"
2. Render will:
   - Clone the repo
   - Install dependencies from `requirements.txt`
   - Start the FastAPI app
3. Monitor logs for errors
4. Once healthy, note the service URL (e.g., `https://catered-by-me-api.onrender.com`)

### Step 4: Verify Deployment
- Health check: `GET https://your-api-url.onrender.com/health`
- Should return: `{"status": "ok"}`
- API docs: `https://your-api-url.onrender.com/docs`

### Troubleshooting Backend

**Issue: ModuleNotFoundError**
- **Cause**: Missing dependency in `requirements.txt`
- **Fix**: Add missing package to root `requirements.txt` and push

**Issue: ImportError with relative imports**
- **Cause**: Python path issues
- **Fix**: Ensure `uvicorn apps.api.main:app` uses the correct module path

**Issue: Supabase connection errors**
- **Cause**: Missing or incorrect environment variables
- **Fix**: Verify all three Supabase env vars are set correctly in Render

**Issue: Port binding errors**
- **Cause**: Render uses dynamic `$PORT` environment variable
- **Fix**: Start command must use `--port $PORT` (not hardcoded 8000)

---

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account connected to GitHub
- Backend API URL from Render deployment

### Step 1: Create Vercel Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository: `catered_by_me`
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

### Step 2: Environment Variables
Add these in Vercel Dashboard → Project Settings → Environment Variables:

```bash
# Supabase (Public - safe to expose)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Backend API
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.onrender.com

# Backend-only (for API routes if you add them later)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
```

**Where to find Supabase credentials:**
- `NEXT_PUBLIC_SUPABASE_URL`: Same as backend `SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase Dashboard → Settings → API → anon/public key

### Step 3: Deploy
1. Click "Deploy"
2. Vercel will:
   - Install dependencies
   - Build the Next.js app
   - Deploy to production
3. Monitor build logs
4. Once deployed, note the production URL (e.g., `https://catered-by-me.vercel.app`)

### Step 4: Update CORS (Backend)
After frontend is deployed, update backend CORS origins in `apps/api/main.py`:

```python
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://cateredby.me",
    "https://www.cateredby.me",
    "https://your-frontend-url.vercel.app",  # Add this
]
```

Then redeploy the backend.

### Troubleshooting Frontend

**Issue: Build fails with module errors**
- **Cause**: Missing dependencies or TypeScript errors
- **Fix**: Run `npm install` and `npm run build` locally to catch errors

**Issue: API calls fail (CORS errors)**
- **Cause**: Backend CORS not configured for frontend URL
- **Fix**: Add frontend URL to backend `origins` list and redeploy

**Issue: Environment variables not working**
- **Cause**: Variables not prefixed with `NEXT_PUBLIC_` for client-side access
- **Fix**: Ensure client-side variables start with `NEXT_PUBLIC_`

---

## Post-Deployment Checklist

### Backend (Render)
- [ ] Health check endpoint returns `{"status": "ok"}`
- [ ] API docs accessible at `/docs`
- [ ] Can create a test user profile via API
- [ ] Can create a test recipe via API
- [ ] Logs show no errors on startup

### Frontend (Vercel)
- [ ] Landing page loads
- [ ] Sign-in page works
- [ ] Can create account (magic link)
- [ ] Dashboard loads after sign-in
- [ ] Can create recipe
- [ ] Can create event
- [ ] API calls succeed (check browser console)

### Integration
- [ ] Frontend can authenticate with Supabase
- [ ] Frontend can call backend API
- [ ] Data persists in Supabase database
- [ ] Share links work (if implemented)

---

## Database Setup (Supabase)

### Schema Deployment
1. Go to Supabase Dashboard → SQL Editor
2. Run the schema from `supabase/schema.sql`
3. Verify tables created: `profiles`, `recipes`, `events`, `event_recipes`, `waitlist`

### Row Level Security (RLS)
The schema includes RLS policies. Verify they're active:
- Users can only read/write their own data
- Public endpoints (waitlist, share links) have appropriate access

---

## Monitoring & Maintenance

### Backend Logs (Render)
- View in Render Dashboard → Service → Logs
- Watch for:
  - 500 errors (application errors)
  - 429 errors (rate limiting working)
  - Database connection issues

### Frontend Logs (Vercel)
- View in Vercel Dashboard → Project → Deployments → Logs
- Check browser console for client-side errors

### Database Monitoring (Supabase)
- Monitor in Supabase Dashboard → Database → Table Editor
- Check for unexpected data or missing records

---

## Rollback Procedures

### Backend (Render)
1. Go to Render Dashboard → Service → Deployments
2. Find previous successful deployment
3. Click "..." → "Rollback to this deploy"

### Frontend (Vercel)
1. Go to Vercel Dashboard → Project → Deployments
2. Find previous successful deployment
3. Click "..." → "Promote to Production"

---

## Common Issues & Solutions

### Issue: "ModuleNotFoundError: No module named 'jwt'"
**Solution**: Ensure `pyjwt>=2.8.0` is in root `requirements.txt`

### Issue: "Supabase not configured" errors
**Solution**: Verify all three Supabase environment variables are set in Render

### Issue: Frontend shows "API Error" for all requests
**Solution**: 
1. Check `NEXT_PUBLIC_API_BASE_URL` is set correctly
2. Verify backend CORS includes frontend URL
3. Check backend logs for errors

### Issue: Authentication not working
**Solution**:
1. Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
2. Check Supabase Dashboard → Authentication → Settings
3. Verify redirect URLs are configured

---

## Next Steps After Deployment

1. **Test all user flows** as "Hannah" persona
2. **Monitor error logs** for first 24 hours
3. **Set up error tracking** (Sentry, LogRocket, etc.)
4. **Configure custom domain** (if desired)
5. **Set up CI/CD** for automatic deployments
6. **Enable Stripe** (when ready for monetization)

---

## Support Resources

- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Next.js Docs](https://nextjs.org/docs)

