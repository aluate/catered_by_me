# 🎯 Stripe Final Steps - Quick Guide

**Only 2 steps left!** Follow these links and instructions.

---

## Step 1: Set Stripe Secret Key in Render

### Direct Link to Your Service:
🔗 **https://dashboard.render.com/web/catered-by-me-api**

*(If that doesn't work, go to: https://dashboard.render.com → Click "catered-by-me-api" service)*

### Instructions:
1. Click the link above (or navigate to your Render dashboard)
2. Click on **"catered-by-me-api"** service
3. Click the **"Environment"** tab (left sidebar)
4. Scroll down to **"Environment Variables"** section
5. Click **"Add Environment Variable"**
6. Fill in:
   - **Key:** `STRIPE_SECRET_KEY`
   - **Value:** `sk_test_***REDACTED***51SZH87K3XMzVSHTYch1UKiYYaVPM854xAj79kN2x7nFGKv3vjTbNhT7UxuebSycU0mWMZLrzeaeF8oJdgdjhwIao00yzGZB0AY`
7. Click **"Save Changes"**
8. ✅ **Done!** Render will automatically redeploy

---

## Step 2: Set Up Stripe Webhook

### Direct Link:
🔗 **https://dashboard.stripe.com/test/webhooks**

*(Make sure you're in **Test Mode** - toggle in top right if needed)*

### Instructions:
1. Click the link above (or go to Stripe Dashboard → Developers → Webhooks)
2. Click **"+ Add endpoint"** button
3. Fill in:
   - **Endpoint URL:** `https://catered-by-me-api.onrender.com/billing/webhook`
4. Under **"Select events to listen to"**, click **"+ Select events"**
5. Check these events:
   - ✅ `checkout.session.completed`
   - ✅ `invoice.payment_succeeded`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
6. Click **"Add events"**
7. Click **"Add endpoint"** (bottom right)
8. **Copy the "Signing secret"** - it starts with `whsec_...`
   - Click **"Reveal"** next to "Signing secret"
   - Copy the entire secret

### Then Set the Webhook Secret in Render:
9. Go back to Render: 🔗 **https://dashboard.render.com/web/catered-by-me-api/environment**
10. Click **"Add Environment Variable"**
11. Fill in:
    - **Key:** `STRIPE_WEBHOOK_SECRET`
    - **Value:** *(paste the `whsec_...` secret you copied)*
12. Click **"Save Changes"**
13. ✅ **Done!**

---

## 🎉 That's It!

Once you've completed both steps:
- Stripe secret key will be available to your API
- Webhook will automatically handle payment events
- Your billing system will be fully functional!

---

## Quick Reference

### Render Service Environment Page:
🔗 https://dashboard.render.com/web/catered-by-me-api/environment

### Stripe Webhooks Page:
🔗 https://dashboard.stripe.com/test/webhooks

### Values to Copy:

**Stripe Secret Key:**
```
sk_test_***REDACTED***51SZH87K3XMzVSHTYch1UKiYYaVPM854xAj79kN2x7nFGKv3vjTbNhT7UxuebSycU0mWMZLrzeaeF8oJdgdjhwIao00yzGZB0AY
```

**Webhook URL:**
```
https://catered-by-me-api.onrender.com/billing/webhook
```

**Webhook Events:**
- `checkout.session.completed`
- `invoice.payment_succeeded`
- `customer.subscription.updated`
- `customer.subscription.deleted`

---

**After completing both steps, your Stripe integration will be 100% ready!** 🚀

