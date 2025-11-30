# Quick Supabase Setup (5 Minutes)

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → Sign up/Login
2. Click **"New Project"**
3. Fill in:
   - Name: `catered-by-me`
   - Password: (create strong password, save it!)
   - Region: (choose closest)
4. Click **"Create new project"**
5. Wait 2-3 minutes

## 2. Get Your Keys

1. In Supabase dashboard → **Settings** → **API**
2. Copy these 3 values:

```
Project URL: https://xxxxx.supabase.co
anon/public key: eyJhbGc... (long string)
service_role key: eyJhbGc... (⚠️ SECRET - don't share!)


import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://hmumvzefougsiejvlxqi.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const SUPABASE_KEY = 'SUPABASE_CLIENT_API_KEY'

const SUPABASE_URL = "https://hmumvzefougsiejvlxqi.supabase.co"
const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_KEY);

const SERVICE_KEY = 'SUPABASE_SERVICE_KEY'


const SUPABASE_URL = "https://hmumvzefougsiejvlxqi.supabase.co"
const supabase = createClient(SUPABASE_URL, process.env.SERVICE_KEY);



let { data, error } = await supabase.auth.signUp({
  email: 'someone@email.com',
  password: 'BBCuENctxZSmzudysHfm'
})


let { data, error } = await supabase.auth.signInWithPassword({
  email: 'someone@email.com',
  password: 'BBCuENctxZSmzudysHfm'
})


let { data, error } = await supabase.auth.signInWithOtp({
  email: 'someone@email.com'
})



let { data, error } = await supabase.auth.signUp({
  phone: '+13334445555',
  password: 'some-password'
})



let { data, error } = await supabase.auth.signUp({
  phone: '+13334445555',
  password: 'some-password'
})



let { data, error } = await supabase.auth.verifyOtp({
  phone: '+13334445555',
  token: '123456',
  type: 'sms'
})


let { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'github'
})


const { data: { user } } = await supabase.auth.getUser()


let { data, error } = await supabase.auth.resetPasswordForEmail(email)




const { data, error } = await supabase.auth.updateUser({
  email: "new@email.com",
  password: "new-password",
  data: { hello: 'world' }
})



let { error } = await supabase.auth.signOut()


let { data, error } = await supabase.auth.admin.inviteUserByEmail('someone@email.com')



```

3. Go to **Settings** → **API** → **JWT Settings**
4. Copy **JWT Secret**

0uOWrELcDD/EU65qszh4e4uk3dID/HUMqsJjT8wanLOAF7xI+dVcwUGHKbC+UhmQ9QLaON+ZyT29hIDgCqcypA==

## 3. Run Database Schema

1. In Supabase → **SQL Editor** → **New query**
2. Open `supabase/schema.sql` from your repo
3. Copy ALL the SQL
4. Paste into SQL Editor
5. Click **"Run"** (or Ctrl+Enter)
6. Then run `SUPABASE_MIGRATION_ADD_PROFILE_FIELDS.sql` (same way)

## 4. Set Environment Variables

### In Render (Backend):
1. Render Dashboard → Your Service → **Environment**
2. Add these:

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (service_role key)
SUPABASE_JWT_SECRET=your-jwt-secret
```

3. Click **"Save Changes"**

### In Vercel (Frontend):
1. Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add these:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... (anon key)
NEXT_PUBLIC_API_BASE_URL=https://your-render-url.onrender.com
```

3. Click **"Save"**

## 5. Verify It Works

1. **Backend**: Visit `https://your-api.onrender.com/health` → Should return `{"status": "ok"}`
2. **Frontend**: Visit your Vercel URL → Try signing in
3. **Database**: Supabase → **Table Editor** → Should see your tables

## Common Issues

- **"Supabase not configured"**: Check environment variables are set correctly
- **"Table does not exist"**: Run the SQL schema files
- **CORS errors**: Add your Vercel URL to `origins` in `apps/api/main.py`

Done! 🎉

