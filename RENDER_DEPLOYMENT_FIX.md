# Render Deployment Fixes

## Issue: Port Configuration

**Problem**: Render uses a dynamic `$PORT` environment variable, but `render.yaml` hardcodes port 8000.

**Fix**: Update `render.yaml` to use `$PORT`:

```yaml
startCommand: uvicorn apps.api.main:app --host 0.0.0.0 --port $PORT
```

## Issue: Missing Database Schema Fields

**Problem**: Gift code redemption tries to update `tier`, `subscription_status`, and `renewal_date` on profiles table, but these fields don't exist in the schema.

**Fix**: Add these fields to the profiles table in Supabase.

## Issue: Unused Import

**Problem**: `apps/api/services/gift_codes.py` imports `uuid` but doesn't use it.

**Fix**: Remove unused import.

## Quick Fixes Checklist

- [ ] Update `render.yaml` to use `$PORT`
- [ ] Add missing profile fields to Supabase schema
- [ ] Remove unused imports
- [ ] Verify all environment variables are set in Render

