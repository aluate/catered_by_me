# 🚀 Deployment Checklist for cateredby.me

## ✅ Pre-flight Check

- [x] CORS added to FastAPI
- [x] API client uses environment variable
- [x] All code committed locally

---

## Step 1: Initialize Git & Push to GitHub (5 min)

### If git is not initialized:

```powershell
git init
git add .
git commit -m "Initial Catered By Me MVP with CORS"
```

### Create GitHub repo:

1. Go to https://github.com/new
2. Repository name: `catered_by_me`
3. Make it **Public** or **Private** (your choice)
4. **DO NOT** initialize with README
5. Click "Create repository"

### Push to GitHub:

```powershell
git branch -M main
git remote add origin https://github.com/YOURUSERNAME/catered_by_me.git
git push -u origin main
```

**Replace `YOURUSERNAME` with your actual GitHub username.**

---

## Step 2: Deploy Backend to Render (10 min)

### A. Create Render Account

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign in with **GitHub** (recommended)

### B. Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect GitHub if prompted
3. Select repository: `catered_by_me`
4. Click **"Connect"**

### C. Configure Service

**Settings to fill:**

- **Name:** `catered-by-me-api`
- **Region:** Choose closest to you (e.g., `Oregon (US West)`)
- **Branch:** `main`
- **Root Directory:** Leave **blank** (or `/`)
- **Runtime:** `Python 3`
- **Build Command:** 
  ```
  pip install -r requirements.txt
  ```
- **Start Command:**
  ```
  uvicorn apps.api.main:app --host 0.0.0.0 --port 8000
  ```

### D. Deploy

1. Click **"Create Web Service"**
2. Wait ~5 minutes for first build
3. When done, copy the URL: `https://catered-by-me-api.onrender.com`

### E. Test Backend

Open in browser:
```
https://catered-by-me-api.onrender.com/health
```

Should return: `{"status":"ok"}`

**✅ Write down your Render API URL: _________________________**

---

## Step 3: Deploy Frontend to Vercel (5 min)

### A. Create Vercel Account

1. Go to https://vercel.com
2. Click "Sign Up"
3. Sign in with **GitHub** (recommended)

### B. Import Project

1. Click **"Add New Project"**
2. Select repository: `catered_by_me`
3. Click **"Import"**

### C. Configure Project

**Important Settings:**

1. **Framework Preset:** Should auto-detect "Next.js" ✅
2. **Root Directory:** 
   - Click **"Edit"**
   - Change from `/` to `apps/web`
   - Click **"Continue"**

3. **Environment Variables:**
   - Click **"Environment Variables"**
   - Add new variable:
     - **Name:** `NEXT_PUBLIC_API_BASE_URL`
     - **Value:** Your Render URL from Step 2
       (e.g., `https://catered-by-me-api.onrender.com`)
   - Click **"Add"**

### D. Deploy

1. Click **"Deploy"**
2. Wait ~2 minutes
3. When done, copy the URL: `https://catered-by-me-web.vercel.app`

### E. Test Frontend

1. Open the Vercel URL
2. Click **"Try sample recipe"**
3. Click **"Generate Game Plan"**
4. You should see swim lanes with tasks!

**✅ Write down your Vercel URL: _________________________**

---

## Step 4: Connect cateredby.me Domain (5 min)

### A. Add Domain in Vercel

1. In your Vercel project, go to **Settings** → **Domains**
2. Click **"Add"**
3. Type: `cateredby.me`
4. Click **"Add"**
5. Vercel will show DNS instructions - **keep this page open**

**You'll see something like:**
```
Add a CNAME record:
Name: @
Value: cname.vercel-dns.com
```

### B. Configure DNS in Cloudflare

1. Go to https://dash.cloudflare.com
2. Select your `cateredby.me` domain
3. Go to **DNS** → **Records**
4. Click **"Add record"**

**Add CNAME record:**
- **Type:** `CNAME`
- **Name:** `@` (or leave blank for root)
- **Target:** Copy from Vercel (e.g., `cname.vercel-dns.com`)
- **Proxy status:** 
  - Start with **DNS only** (gray cloud) - click to toggle
  - If issues, you can enable proxy later
- **TTL:** Auto
5. Click **"Save"**

### C. Optional: Add www subdomain

1. Click **"Add record"** again
2. **Type:** `CNAME`
3. **Name:** `www`
4. **Target:** `cateredby.me`
5. **Proxy status:** Same as above
6. Click **"Save"**

### D. Verify in Vercel

1. Go back to Vercel **Settings** → **Domains**
2. Wait 2-5 minutes
3. Click **"Refresh"** or wait for auto-verification
4. When it shows ✅ **"Valid Configuration"**, you're live!

---

## Step 5: Final Test (2 min)

1. Go to **https://cateredby.me**
2. Click **"Try sample recipe"**
3. Click **"Generate Game Plan"**
4. Verify you see:
   - ✅ Swim lanes (PREP, STOVE, OVEN, etc.)
   - ✅ Tasks with time ranges
   - ✅ No errors in browser console

**🎉 You're live!**

---

## Troubleshooting

### Backend not responding?
- Check Render **Logs** tab for errors
- Verify build command completed successfully
- Test `/health` endpoint directly

### Frontend can't reach API?
- Check Vercel **Environment Variables** are set
- Open browser **Developer Tools** → **Console** for errors
- Verify CORS origins in `apps/api/main.py` include your Vercel URL

### Domain not working?
- Wait 10 minutes for DNS propagation
- Check Cloudflare DNS records match Vercel exactly
- Try turning off Cloudflare proxy (gray cloud)
- Verify in Vercel Domains page shows "Valid Configuration"

### Still stuck?
- Check Render logs: Project → Logs
- Check Vercel logs: Project → Deployments → Click latest → View Function Logs
- Share the exact error message

---

## Next Steps (After Live)

- [ ] Test with real recipes
- [ ] Share with sister! 🎉
- [ ] Add multiple recipes support
- [ ] Add print/export feature
- [ ] Polish UI

