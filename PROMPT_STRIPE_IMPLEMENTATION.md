# CURSOR — IMPLEMENT STRIPE BILLING (FULL IMPLEMENTATION)

Use the control document `control/STRIPE_INTEGRATION.md` and the Phase 5/6 code already in the repo.

## Tasks:

### 1. Backend

* Create `/billing/createCheckoutSession.py`
* Create `/billing/handleWebhook.py`
* Install Stripe Python SDK
* Add webhook validation with signing secret
* Update profiles in Supabase

### 2. Supabase

* Modify `profiles` table:
  * `tier`
  * `stripe_customer_id`
  * `stripe_subscription_id`
  * `subscription_status`
  * `renewal_date`

### 3. Frontend

* Add `lib/stripeClient.ts`
* Add `/account/billing` page
* Wire UpgradePrompt to POST checkout session
* Handle success redirects
* Show subscription status in account page
* Gated features:
  * Event limit?
  * Recipe limit?
  * PDF export?
  * Share links?

### 4. Testing

Implement test flows:

* Free → Pro
* Free → Founding
* Expired subscription
* Downgrades

### 5. Code Quality

* Follow project's code style
* Use existing toasts
* Use existing error handler
* Use plans from `featureFlags.ts`

Begin.

