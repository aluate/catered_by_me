# 🚀 Deploy Frontend to Vercel

This guide walks you through deploying the Next.js frontend (`apps/web`) to Vercel.

## Prerequisites

- ✅ Backend deployed on Render at `https://catered-by-me.onrender.com`
- ✅ Backend health check passing: `https://catered-by-me.onrender.com/health` returns `{"status":"ok"}`
- ✅ GitHub repo `aluate/catered_by_me` is up to date with frontend code

---

## Step 1: Import Project to Vercel

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Sign in with GitHub (if not already signed in)
3. Click **"Import Git Repository"**
4. Select the repository: **`aluate/catered_by_me`**
5. Click **"Import"**

---

## Step 2: Configure Project Settings

### Root Directory

**⚠️ CRITICAL:** You must set the root directory to `apps/web`:

1. On the project configuration page, find **"Root Directory"**
2. Click **"Edit"** next to it
3. Change from `/` to **`apps/web`**
4. Click **"Continue"**

This tells Vercel to treat `apps/web` as the Next.js project root.

### Framework Preset

- Should auto-detect as **Next.js**
- If it doesn't, manually select **Next.js**

### Build Settings

Vercel should auto-detect these, but verify:

- **Build Command**: `npm run build` (or `cd apps/web && npm run build` if root dir isn't set)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

---

## Step 3: Add Environment Variable

1. On the project configuration page, scroll to **"Environment Variables"**
2. Click **"Add"** or **"Add Variable"**
3. Add:
   - **Name**: `NEXT_PUBLIC_API_BASE_URL`
   - **Value**: `https://catered-by-me.onrender.com`
4. Make sure it's set for **Production**, **Preview**, and **Development** environments
5. Click **"Save"**

---

## Step 4: Deploy

1. Review all settings:
   - ✅ Root Directory: `apps/web`
   - ✅ Framework: Next.js
   - ✅ Environment Variable: `NEXT_PUBLIC_API_BASE_URL = https://catered-by-me.onrender.com`
2. Click **"Deploy"**
3. Wait 2-3 minutes for the build to complete

---

## Step 5: Verify Deployment

### Check Build Logs

1. On the deployment page, watch the build logs
2. Look for:
   - ✅ "Installing dependencies"
   - ✅ "Building application"
   - ✅ "Build completed"

### Test the Site

1. Once deployment completes, Vercel will show you a URL like:
   ```
   https://catered-by-me-web.vercel.app
   ```
2. Open that URL in your browser
3. You should see the "Catered By Me" homepage

### Test the Full Flow

1. Click **"Try sample recipe"** button
2. Click **"Generate Game Plan"**
3. You should see:
   - Loading state: "Cooking up your plan..."
   - Then a schedule with swim lanes showing tasks by station
   - If you see an error, check the browser console (F12) for API errors

---

## Troubleshooting

### Build Fails

**Error: "Cannot find module" or "File not found"**
- ✅ Verify Root Directory is set to `apps/web`
- ✅ Check that `apps/web/package.json` exists in the repo

**Error: "Build command failed"**
- ✅ Check build logs for specific error
- ✅ Verify `npm run build` works locally in `apps/web`

### Runtime Errors

**"API error: 404" or "Failed to fetch"**
- ✅ Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly in Vercel
- ✅ Check that backend is live: `https://catered-by-me.onrender.com/health`
- ✅ Check browser console (F12) for CORS errors

**CORS Error**
- ✅ Backend CORS is configured to allow Vercel domains
- ✅ If using custom domain, add it to backend CORS origins in `apps/api/main.py`

### Environment Variable Not Working

- ✅ Variable name must be exactly: `NEXT_PUBLIC_API_BASE_URL`
- ✅ Must be set for all environments (Production, Preview, Development)
- ✅ Redeploy after adding/changing environment variables

---

## Post-Deployment

### Custom Domain (Optional)

1. In Vercel project settings, go to **"Domains"**
2. Add your custom domain (e.g., `cateredby.me`)
3. Follow DNS configuration instructions
4. Update backend CORS to include your custom domain

### Monitor Deployments

- Vercel automatically deploys on every push to `main` branch
- Check deployment status in Vercel dashboard
- View build logs if deployments fail

---

## Quick Reference

| Setting | Value |
|---------|-------|
| **Repository** | `aluate/catered_by_me` |
| **Root Directory** | `apps/web` |
| **Framework** | Next.js |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |
| **Environment Variable** | `NEXT_PUBLIC_API_BASE_URL = https://catered-by-me.onrender.com` |

---

## Next Steps

Once the frontend is live:

1. ✅ Test the full user flow (paste recipe → generate schedule)
2. ✅ Share the Vercel URL with users
3. ✅ Set up custom domain if desired
4. ✅ Monitor backend health on Render

---

**Backend URL**: `https://catered-by-me.onrender.com`  
**Frontend URL**: `https://[your-vercel-project].vercel.app`

