# Vercel Deployment Checklist

## 1. Check Build Status

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Check the **Deployments** tab
4. Look at the latest deployment:
   - ✅ **Ready** = Successfully deployed
   - ⏳ **Building** = Still building
   - ❌ **Error** = Build failed (check logs)

## 2. Verify Environment Variables

Go to **Settings** → **Environment Variables** and ensure these are set:

```
NEXT_PUBLIC_SUPABASE_URL=https://hmumvzefougsiejvlxqi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_API_BASE_URL=https://your-render-api.onrender.com
```

**Important**: 
- All variables must start with `NEXT_PUBLIC_` to be available in the browser
- After adding/changing variables, **redeploy** (Vercel won't auto-redeploy)

## 3. Force a New Deployment

If build succeeded but site isn't updating:

1. Go to **Deployments** tab
2. Click the **⋯** menu on latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger auto-deploy

## 4. Clear Browser Cache

1. **Hard refresh**: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Or open in **Incognito/Private** window
3. Or clear browser cache manually

## 5. Check Browser Console

1. Open your site
2. Press `F12` to open DevTools
3. Go to **Console** tab
4. Look for errors (especially API connection errors)
5. Go to **Network** tab
6. Check if API calls are going to the right URL

## 6. Verify Backend is Running

1. Visit your Render API health endpoint:
   `https://your-api.onrender.com/health`
2. Should return: `{"status": "ok"}`
3. If it fails, check Render logs

## 7. Common Issues

### Issue: "API error: Failed to fetch"
**Cause**: Frontend can't reach backend
**Fix**: 
- Check `NEXT_PUBLIC_API_BASE_URL` is set correctly
- Verify backend is running on Render
- Check CORS settings in backend

### Issue: "Supabase not configured"
**Cause**: Missing Supabase environment variables
**Fix**: Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Issue: Build succeeds but site shows old version
**Cause**: Browser cache or deployment not propagated
**Fix**: 
- Hard refresh browser
- Wait 1-2 minutes for CDN to update
- Check Vercel deployment is "Ready" (not "Building")

## 8. Quick Test

1. Visit your Vercel URL
2. Open browser console (`F12`)
3. Type: `console.log(process.env.NEXT_PUBLIC_API_BASE_URL)`
4. Should show your Render API URL
5. If it shows `undefined`, environment variables aren't set

## 9. Force Redeploy

If nothing works, force a new deployment:

```bash
# Make a small change and push
git commit --allow-empty -m "Force redeploy"
git push
```

This will trigger a fresh build and deployment.

