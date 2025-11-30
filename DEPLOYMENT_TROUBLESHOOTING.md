# Render Deployment Troubleshooting

## Common Deployment Failures

### 1. Port Binding Error
**Error**: `Address already in use` or `Port 8000 not available`

**Fix**: ✅ Already fixed - `render.yaml` now uses `$PORT`

**Verify**: Check `render.yaml` has:
```yaml
startCommand: uvicorn apps.api.main:app --host 0.0.0.0 --port $PORT
```

---

### 2. Module Import Errors
**Error**: `ModuleNotFoundError: No module named 'X'`

**Possible Causes**:
- Missing dependency in `requirements.txt`
- Python path issues
- Import path incorrect

**Fix**:
1. Check `requirements.txt` has all packages
2. Verify imports use relative paths (`.routers`, `.services`, etc.)
3. Check `apps/api/__init__.py` exists

**Current Dependencies** (should all be in `requirements.txt`):
- fastapi
- uvicorn
- pydantic
- pydantic-settings
- pyjwt
- supabase
- postgrest

---

### 3. Supabase Connection Errors
**Error**: `Supabase not configured` or `RuntimeError: Supabase not configured`

**Fix**:
1. Set environment variables in Render:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_JWT_SECRET`
2. Verify values are correct (no extra spaces)
3. Redeploy after setting variables

---

### 4. Database Schema Errors
**Error**: `relation "profiles" does not exist` or `column "tier" does not exist`

**Fix**:
1. Run `supabase/schema.sql` in Supabase SQL Editor
2. Run `SUPABASE_MIGRATION_ADD_PROFILE_FIELDS.sql` for subscription fields
3. Verify tables exist in Supabase Table Editor

---

### 5. CORS Errors (Frontend can't call backend)
**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Fix**:
1. Add your Vercel frontend URL to `origins` in `apps/api/main.py`:
```python
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://cateredby.me",
    "https://www.cateredby.me",
    "https://your-app.vercel.app",  # ADD THIS
]
```
2. Redeploy backend

---

### 6. Health Check Failing
**Error**: Health check returns 500 or times out

**Debug Steps**:
1. Check Render logs for startup errors
2. Verify `/health` endpoint exists (it does - line 91 in `main.py`)
3. Check if app is actually starting (look for "Application startup complete" in logs)

---

### 7. Build Command Issues
**Error**: `pip install` fails or can't find `requirements.txt`

**Fix**:
1. Verify `requirements.txt` is in repo root (it is)
2. Check `render.yaml` build command:
```yaml
buildCommand: pip install -r requirements.txt
```
3. If using a different Python version, ensure it's set in `render.yaml`:
```yaml
envVars:
  - key: PYTHON_VERSION
    value: 3.11.11
```

---

### 8. Router Import Errors
**Error**: `ImportError: cannot import name 'gift_codes'`

**Fix**: ✅ Already fixed - `apps/api/routers/__init__.py` exports `gift_codes`

**Verify**: Check `apps/api/routers/__init__.py` has:
```python
from . import recipes, events, waitlist, gift_codes
__all__ = ["recipes", "events", "waitlist", "gift_codes"]
```

---

## Debugging Checklist

When deployment fails, check:

1. **Render Logs**:
   - Go to Render Dashboard → Your Service → **Logs**
   - Look for error messages
   - Check if app starts (look for "Uvicorn running on")

2. **Environment Variables**:
   - Render Dashboard → Your Service → **Environment**
   - Verify all 3 Supabase vars are set
   - Check for typos or extra spaces

3. **Database Schema**:
   - Supabase Dashboard → **Table Editor**
   - Verify tables exist: `profiles`, `recipes`, `events`, `event_recipes`, `waitlist`, `gift_codes`

4. **Code Issues**:
   - Check `render.yaml` uses `$PORT` (not 8000)
   - Verify all imports are correct
   - Check for syntax errors

5. **Dependencies**:
   - Verify `requirements.txt` has all packages
   - Check Python version matches (3.11.11)

---

## Quick Test After Deployment

1. **Health Check**: `GET https://your-api.onrender.com/health`
   - Should return: `{"status": "ok"}`

2. **API Docs**: `GET https://your-api.onrender.com/docs`
   - Should show Swagger UI

3. **Test Endpoint**: Try a simple endpoint like `/waitlist` (POST)
   - Should work even without Supabase (will fail gracefully)

---

## Still Not Working?

1. **Check Render Logs** - Most errors show up here
2. **Test Locally** - Run `uvicorn apps.api.main:app` locally to catch errors
3. **Verify Environment Variables** - Double-check all values
4. **Check Supabase** - Verify project is active and schema is deployed

---

## Next Steps After Successful Deployment

1. ✅ Health check works
2. ✅ Set Supabase environment variables
3. ✅ Run database schema
4. ✅ Test API endpoints
5. ✅ Connect frontend to backend
6. ✅ Test full user flow

