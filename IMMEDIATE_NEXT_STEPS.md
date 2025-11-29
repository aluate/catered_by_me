# Immediate Next Steps (Do Before First Deployment)

## 🚨 Critical: Must Do Before Production

### 1. Disable Demo Mode
**File**: `apps/web/src/lib/demo.ts`  
**Change**: Set `DEMO_MODE = false`  
**Why**: Demo mode prevents real data from being saved  
**Impact**: Without this, no user data will persist

```typescript
// Change this:
export const DEMO_MODE = true;

// To this:
export const DEMO_MODE = false;
```

### 2. Set Environment Variables in Render
**Where**: Render Dashboard → Service → Environment  
**Variables Needed**:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET`

**Why**: Backend will start but all endpoints will fail without these  
**Impact**: App will appear to work but won't save any data

### 3. Set Environment Variables in Vercel
**Where**: Vercel Dashboard → Project → Settings → Environment Variables  
**Variables Needed**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_BASE_URL`

**Why**: Frontend needs these to connect to Supabase and backend  
**Impact**: Authentication and API calls will fail

### 4. Update CORS Origins
**File**: `apps/api/main.py` (line ~27)  
**Change**: Add your Vercel frontend URL to the `origins` list  
**Why**: Browser will block API calls without proper CORS  
**Impact**: All API calls from frontend will fail

```python
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://cateredby.me",
    "https://www.cateredby.me",
    "https://your-app.vercel.app",  # ADD THIS
]
```

### 5. Verify Database Schema
**Where**: Supabase Dashboard → SQL Editor  
**Action**: Run `supabase/schema.sql` if not already done  
**Why**: Tables and RLS policies must exist  
**Impact**: All database operations will fail

---

## ⚠️ High Priority: Do Soon After Launch

### 6. Add Environment Variable Validation
**File**: `apps/api/main.py`  
**Action**: Add startup check that fails if env vars missing  
**Why**: Better to fail at startup than silently at runtime  
**Impact**: Catch configuration errors immediately

### 7. Add Health Check for Dependencies
**File**: `apps/api/main.py` (health endpoint)  
**Action**: Check Supabase connection in `/health`  
**Why**: Monitoring tools need to know if database is down  
**Impact**: Better observability

### 8. Set Up Error Tracking
**Service**: Sentry (recommended) or similar  
**Action**: Integrate into both frontend and backend  
**Why**: Need to know about production errors  
**Impact**: Will miss critical issues without this

---

## 📋 Deployment Checklist

Use this checklist when deploying:

### Pre-Deployment
- [ ] Demo mode disabled (`DEMO_MODE = false`)
- [ ] All code committed and pushed
- [ ] Database schema deployed to Supabase
- [ ] Environment variables documented

### Backend (Render)
- [ ] Service created in Render
- [ ] Environment variables set (3 Supabase vars)
- [ ] Build command: `pip install -r requirements.txt`
- [ ] Start command: `uvicorn apps.api.main:app --host 0.0.0.0 --port $PORT`
- [ ] Health check passes: `GET /health`
- [ ] API docs accessible: `GET /docs`

### Frontend (Vercel)
- [ ] Project created in Vercel
- [ ] Root directory set to `apps/web`
- [ ] Environment variables set (3 vars)
- [ ] Build succeeds
- [ ] Frontend URL noted

### Post-Deployment
- [ ] CORS origins updated in backend
- [ ] Backend redeployed with new CORS
- [ ] Frontend can call backend API
- [ ] Authentication works (can sign in)
- [ ] Can create recipe
- [ ] Can create event
- [ ] Schedule generation works
- [ ] Grocery list works

---

## 🔍 Testing After Deployment

### Smoke Tests
1. **Landing Page**: Loads without errors
2. **Sign In**: Can request magic link
3. **Dashboard**: Loads after authentication
4. **Create Recipe**: Can create and save recipe
5. **Create Event**: Can create and save event
6. **Generate Schedule**: Schedule generates successfully
7. **Grocery List**: Can view and print grocery list

### Error Scenarios
1. **Invalid Auth**: Unauthenticated requests return 401
2. **Invalid Data**: Bad requests return 400
3. **Not Found**: Missing resources return 404
4. **Rate Limiting**: Too many requests return 429

---

## 🐛 Common Issues & Quick Fixes

### Issue: "Supabase not configured"
**Fix**: Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Render

### Issue: CORS errors in browser
**Fix**: Add frontend URL to `origins` list in `apps/api/main.py`

### Issue: "ModuleNotFoundError"
**Fix**: Ensure all dependencies in `requirements.txt` and push

### Issue: Frontend shows "API Error"
**Fix**: Check `NEXT_PUBLIC_API_BASE_URL` is set correctly in Vercel

### Issue: Authentication not working
**Fix**: Verify Supabase env vars are set in Vercel (with `NEXT_PUBLIC_` prefix)

---

## 📞 Support Resources

- **Deployment Guide**: `DEPLOYMENT_GUIDE.md`
- **Project Audit**: `PROJECT_AUDIT.md`
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs

---

**Remember**: Test in staging/preview before production!

