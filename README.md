# Catered By Me

Backend API for a cooking "day-of execution" planner that:
- accepts recipes
- normalizes ingredients
- scales to a headcount
- converts steps to tasks
- generates a time-based schedule by working backwards from a desired serve time

## Getting Started

### Prerequisites

- Python 3.11+

### Installation

```bash
pip install -r requirements.txt
```

### Environment Variables

**Minimum required:**
- Supabase credentials (for auth/database)

**Optional (to enable Stripe payments):**
- `STRIPE_SECRET_KEY` - Stripe API secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `STRIPE_ENABLED=true` (or leave unset, defaults to true if keys are present)

**Note:** Stripe is **optional** for initial development. Set `STRIPE_ENABLED=false` to explicitly disable Stripe. The `/billing/checkout` and `/billing/webhook` endpoints will return appropriate errors when Stripe is disabled.

### Running the Development Server

```bash
uvicorn apps.api.main:app --reload
```

The API will be available at `http://localhost:8000` by default.

### API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

