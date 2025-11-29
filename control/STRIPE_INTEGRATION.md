# STRIPE INTEGRATION CONTROL DOCUMENT — CATEREDBY.ME

## Goal

Implement a fully working billing system supporting:

* **Pro Annual ($15/year)**
* **Founding Host ($10/year, optional wave for early adopters)**

Stripe handles:
* Checking out
* Webhook receipts
* Subscription lifecycle

Supabase stores:
* user tier
* renewal date
* active/inactive billing status

The frontend handles:
* Gated features
* Upgrade flows
* Toast messaging
* Post-checkout onboarding

---

## Architecture

### Frontend

```
frontend/
  /pricing
  /app/account/billing
  lib/stripeClient.ts
  components/UpgradePrompt.tsx (already exists)
```

### Backend

```
backend/
  /billing/
    createCheckoutSession.py
    handleWebhook.py
```

### Supabase

Add fields to `profiles` table:

```
tier TEXT DEFAULT 'free'
stripe_customer_id TEXT
stripe_subscription_id TEXT
subscription_status TEXT
renewal_date TIMESTAMP
```

---

## Stripe Products

1. **Pro Annual**
   * price: $15/year
   * recurring

2. **Founding Host**
   * price: $10/year
   * recurring
   * manually assigned through Stripe dashboard
   * optional

---

## API Endpoints

### POST /billing/checkout

Params:

```
{ userId: string, plan: "pro" | "founding" }
```

Returns:

```
{ url: string }
```

### POST /billing/webhook

* Handles:
  * checkout.session.completed
  * invoice.payment_succeeded
  * customer.subscription.updated
  * customer.subscription.deleted

Updates `profiles` accordingly.

---

## Flows

### Upgrade Flow

```
User → UpgradePrompt → POST checkout → Stripe checkout → redirect back with success
```

### Webhook Flow

Stripe → webhook → backend → Supabase update → reflect tier in UI

---

## Test Cases

* Free user tries to exceed limit → UpgradePrompt appears
* User upgrades → Stripe checkout works
* Webhook updates `profiles.tier`
* User can now:
  * create unlimited events
  * export PDF
  * share events
* Cancelling subscription updates in `profiles`

---

## Success Criteria

* Users can pay
* Billing status persists
* Gated features unlock
* No manual intervention needed

---

# 💡 Cursor MUST follow this exact control doc when implementing billing.

