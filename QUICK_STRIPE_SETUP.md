# ⚡ Quick Stripe Setup - Copy & Paste

## 🔗 Direct Links

### Step 1: Render Environment Variables
**Link:** https://dashboard.render.com/web/catered-by-me-api/environment

**Action:**
- Click "Add Environment Variable"
- Key: `STRIPE_SECRET_KEY`
- Value: `sk_test_...` (Get from Stripe Dashboard → Developers → API Keys)
- Save

---

### Step 2: Stripe Webhook
**Link:** https://dashboard.stripe.com/test/webhooks

**Action:**
1. Click "+ Add endpoint"
2. URL: `https://catered-by-me-api.onrender.com/billing/webhook`
3. Select events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the signing secret (starts with `whsec_...`)
5. Go back to Render (link above)
6. Add variable:
   - Key: `STRIPE_WEBHOOK_SECRET`
   - Value: *(paste the `whsec_...` secret)*
7. Save

---

## ✅ Done!

That's it! Your Stripe integration is ready.

