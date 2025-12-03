# Stripe is Optional

**Important:** Stripe payment features are **disabled by default** during development and testing.

## How It Works

- **Stripe is enabled** when:
  - `STRIPE_ENABLED` is not set (or set to `true`) **AND**
  - `STRIPE_SECRET_KEY` is provided

- **Stripe is disabled** when:
  - `STRIPE_ENABLED=false` is set in `.env`, **OR**
  - `STRIPE_SECRET_KEY` is not provided

## Behavior When Disabled

- **Checkout endpoint** (`POST /billing/checkout`) returns: `503 - Stripe is currently disabled`
- **Webhook endpoint** (`POST /billing/webhook`) returns: `200 - Stripe disabled` (silently ignored)
- **Frontend** will show error messages when attempting payment actions

## Enabling Stripe Later

When you're ready to enable Stripe:

1. Set in `.env`:
   ```env
   STRIPE_ENABLED=true
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

2. Create Stripe products in Stripe Dashboard:
   - "Pro Annual" ($15/year)
   - "Founding Host" ($10/year) - optional

3. Restart the API server

4. Configure Stripe webhook endpoint in Stripe Dashboard:
   - URL: `https://your-api-url.onrender.com/billing/webhook`
   - Events: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.updated`, `customer.subscription.deleted`

The app will automatically start using Stripe once these variables are set.

