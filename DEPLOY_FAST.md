# 🚀 Fastest Path to Live (Next Hour)

## Step 1: Push to GitHub (5 min)

If you haven't already:

```bash
cd catered_by_me
git init
git add .
git commit -m "Initial MVP with CORS"
git branch -M main
git remote add origin https://github.com/YOURUSERNAME/catered_by_me.git
git push -u origin main
```

## Step 2: Deploy Backend to Render (10 min)

1. Go to **render.com** → Sign up/Login
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub → Select `catered_by_me` repo
4. Configure:
   - **Name:** `catered-by-me-api`
   - **Root Directory:** `/` (leave blank)
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn apps.api.main:app --host 0.0.0.0 --port 8000`
5. Click **"Create Web Service"**
6. Wait ~5 minutes for first deploy
7. Copy the URL: `https://catered-by-me-api.onrender.com`
8. Test: `https://catered-by-me-api.onrender.com/health` → should return `{"status":"ok"}`

## Step 3: Deploy Frontend to Vercel (5 min)

1. Go to **vercel.com** → Sign up/Login (use GitHub)
2. Click **"Add New Project"**
3. Import `catered_by_me` repo
4. Configure:
   - **Root Directory:** Click "Edit" → Change to `apps/web`
   - **Framework Preset:** Next.js (auto-detected)
5. **Environment Variables:**
   - Click "Environment Variables"
   - Add: `NEXT_PUBLIC_API_BASE_URL` = `https://catered-by-me-api.onrender.com`
6. Click **"Deploy"**
7. Wait ~2 minutes
8. Copy the URL: `https://catered-by-me-web.vercel.app`
9. Test: Open the URL, click "Try sample recipe", generate plan

## Step 4: Point Domain to Vercel (5 min)

### In Vercel:
1. Go to your project → **Settings** → **Domains**
2. Click **"Add"** → Type: `cateredby.me`
3. Vercel will show you DNS records to add

### In Cloudflare:
1. Go to **Cloudflare Dashboard** → Select `cateredby.me`
2. Go to **DNS** → **Records**
3. Add CNAME record:
   - **Type:** CNAME
   - **Name:** `@` (or root)
   - **Target:** `cname.vercel-dns.com` (or whatever Vercel shows)
   - **Proxy status:** DNS only (gray cloud) or Proxied (orange) - try DNS only first
4. Save
5. Wait 2-5 minutes for DNS to propagate

### Back in Vercel:
- Refresh the Domains page
- Once it shows "Valid Configuration", you're live!

## Step 5: Test Live Site (2 min)

1. Go to `https://cateredby.me`
2. Click **"Try sample recipe"**
3. Click **"Generate Game Plan"**
4. You should see swim lanes with tasks!

## If Something Breaks:

### Backend not responding?
- Check Render logs: Project → Logs
- Make sure CORS origins include your Vercel URL temporarily

### Frontend can't reach API?
- Check Vercel environment variable is set correctly
- Check browser console for CORS errors
- Temporarily add Vercel URL to CORS origins in `main.py`

### Domain not working?
- Check Cloudflare DNS records match Vercel's instructions
- Try turning off Cloudflare proxy (gray cloud)
- Wait 10 minutes for DNS propagation

## Total Time: ~30 minutes

You're live! 🎉

