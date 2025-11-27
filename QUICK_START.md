# ⚡ Quick Start - Get cateredby.me Live in 30 Minutes

## ✅ What's Ready

- ✅ CORS configured for production
- ✅ API endpoint updated to match frontend (base_headcount + target_headcount)
- ✅ All deployment configs created
- ✅ .gitignore set up

## 🚀 Deployment Steps

### 1. Push to GitHub (5 min)

**If Git is not installed:**
- Download from: https://git-scm.com/download/win
- Or use GitHub Desktop: https://desktop.github.com/

**In PowerShell (from project folder):**

```powershell
git init
git add .
git commit -m "Initial MVP - ready for deployment"
git branch -M main
```

**Then:**
1. Go to https://github.com/new
2. Create repo: `catered_by_me`
3. **Don't** initialize with README
4. Copy the commands GitHub shows you, run in PowerShell:

```powershell
git remote add origin https://github.com/YOURUSERNAME/catered_by_me.git
git push -u origin main
```

---

### 2. Deploy Backend to Render (10 min)

1. **Go to:** https://render.com → Sign up with GitHub
2. **Click:** "New +" → "Web Service"
3. **Select:** `catered_by_me` repository
4. **Configure:**
   - Name: `catered-by-me-api`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn apps.api.main:app --host 0.0.0.0 --port 8000`
5. **Click:** "Create Web Service"
6. **Wait 5 min** → Copy URL: `https://catered-by-me-api.onrender.com`
7. **Test:** Open URL + `/health` → Should see `{"status":"ok"}`

**✅ Save this URL: _________________________**

---

### 3. Deploy Frontend to Vercel (5 min)

1. **Go to:** https://vercel.com → Sign up with GitHub
2. **Click:** "Add New Project"
3. **Select:** `catered_by_me` repository
4. **Important Settings:**
   - **Root Directory:** Click "Edit" → Change to `apps/web`
   - **Framework:** Next.js (auto-detected)
5. **Environment Variable:**
   - Name: `NEXT_PUBLIC_API_BASE_URL`
   - Value: Your Render URL from Step 2
6. **Click:** "Deploy"
7. **Wait 2 min** → Copy URL: `https://catered-by-me-web.vercel.app`
8. **Test:** Open URL → "Try sample recipe" → "Generate Game Plan"

**✅ Save this URL: _________________________**

---

### 4. Connect cateredby.me Domain (5 min)

#### A. In Vercel:
1. Project → **Settings** → **Domains**
2. Click **"Add"** → Type: `cateredby.me`
3. **Copy the DNS record** Vercel shows (usually CNAME to `cname.vercel-dns.com`)

#### B. In Cloudflare:
1. Go to https://dash.cloudflare.com
2. Select `cateredby.me`
3. **DNS** → **Records** → **Add record**
4. **Type:** CNAME
5. **Name:** `@` (or blank for root)
6. **Target:** Paste from Vercel (e.g., `cname.vercel-dns.com`)
7. **Proxy:** Start with **DNS only** (gray cloud)
8. **Save**

#### C. Wait & Verify:
- Wait 2-5 minutes
- Back in Vercel → Refresh Domains page
- When it shows ✅ "Valid Configuration" → **You're live!**

---

### 5. Test Live Site (2 min)

1. Go to: **https://cateredby.me**
2. Click: **"Try sample recipe"**
3. Click: **"Generate Game Plan"**
4. ✅ Should see swim lanes with tasks!

---

## 🎉 You're Live!

Text your sister:
> "Go to cateredby.me - paste a recipe, pick dinner time, get a game plan!"

---

## 🆘 Troubleshooting

**Backend not working?**
- Check Render **Logs** tab
- Test `/health` endpoint directly

**Frontend can't reach API?**
- Check Vercel **Environment Variables** are set
- Open browser **Console** (F12) for errors

**Domain not working?**
- Wait 10 minutes for DNS
- Check Cloudflare DNS matches Vercel exactly
- Try turning off Cloudflare proxy (gray cloud)

---

## 📋 Files Created

- `DEPLOY_CHECKLIST.md` - Detailed step-by-step guide
- `render.yaml` - Optional Render config
- `vercel.json` - Vercel deployment config
- `.gitignore` - Excludes unnecessary files

All set! Follow the steps above and you'll be live in ~30 minutes. 🚀

