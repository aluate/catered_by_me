"""
Billing API endpoints for Stripe integration.
"""
import logging
from typing import Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Request, Header
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import stripe

from ..dependencies import require_auth, Settings, get_settings
from ..lib.supabase_client import require_supabase

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/billing", tags=["billing"])

# Initialize Stripe (will be configured when settings are loaded)
stripe.api_key = None


def get_stripe_client(settings: Settings = Depends(get_settings)):
    """Get configured Stripe client."""
    if not settings.STRIPE_SECRET_KEY:
        raise HTTPException(
            status_code=500,
            detail="Stripe not configured. Please set STRIPE_SECRET_KEY."
        )
    stripe.api_key = settings.STRIPE_SECRET_KEY
    return stripe


# Request/Response models
class CheckoutRequest(BaseModel):
    plan: str  # "pro" or "founding"


class CheckoutResponse(BaseModel):
    url: str


def get_stripe_price_id(plan: str, stripe_client) -> str:
    """
    Get Stripe price ID for a plan by querying products.
    Plan can be "pro" or "founding".
    """
    plan_names = {
        "pro": "Pro Annual",
        "founding": "Founding Host"
    }
    
    product_name = plan_names.get(plan.lower())
    if not product_name:
        raise ValueError(f"Invalid plan: {plan}. Must be 'pro' or 'founding'.")
    
    try:
        # Search for products by name
        products = stripe_client.Product.list(limit=100, active=True)
        
        for product in products.data:
            if product.name == product_name:
                # Get the first active price for this product
                prices = stripe_client.Price.list(
                    product=product.id,
                    active=True,
                    limit=1
                )
                if prices.data:
                    return prices.data[0].id
                else:
                    raise HTTPException(
                        status_code=500,
                        detail=f"No active price found for {product_name}"
                    )
        
        raise HTTPException(
            status_code=500,
            detail=f"Stripe product '{product_name}' not found. Please create it in Stripe dashboard."
        )
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error getting price ID: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get Stripe price: {str(e)}"
        )


@router.post("/checkout", response_model=CheckoutResponse)
async def create_checkout_session(
    request: CheckoutRequest,
    user_id: str = Depends(require_auth),
    settings: Settings = Depends(get_settings),
):
    """
    Create a Stripe checkout session for subscription.
    Requires authentication.
    """
    try:
        stripe_client = get_stripe_client(settings)
        supabase = require_supabase()
        
        # Get user profile to check for existing Stripe customer ID
        profile_response = supabase.table("profiles").select(
            "email, stripe_customer_id"
        ).eq("id", user_id).execute()
        
        if not profile_response.data:
            raise HTTPException(status_code=404, detail="User profile not found")
        
        profile = profile_response.data[0]
        user_email = profile.get("email")
        stripe_customer_id = profile.get("stripe_customer_id")
        
        # Get or create Stripe customer
        if not stripe_customer_id:
            customer = stripe_client.Customer.create(
                email=user_email,
                metadata={"user_id": user_id}
            )
            stripe_customer_id = customer.id
            
            # Save customer ID to profile
            supabase.table("profiles").update({
                "stripe_customer_id": stripe_customer_id
            }).eq("id", user_id).execute()
        else:
            # Verify customer exists
            try:
                stripe_client.Customer.retrieve(stripe_customer_id)
            except stripe.error.InvalidRequestError:
                # Customer doesn't exist, create new one
                customer = stripe_client.Customer.create(
                    email=user_email,
                    metadata={"user_id": user_id}
                )
                stripe_customer_id = customer.id
                supabase.table("profiles").update({
                    "stripe_customer_id": stripe_customer_id
                }).eq("id", user_id).execute()
        
        # Get price ID for the plan
        price_id = get_stripe_price_id(request.plan, stripe_client)
        
        # Create checkout session
        checkout_session = stripe_client.checkout.Session.create(
            customer=stripe_customer_id,
            payment_method_types=["card"],
            line_items=[{
                "price": price_id,
                "quantity": 1,
            }],
            mode="subscription",
            success_url=f"{settings.FRONTEND_URL}/account/billing?success=true",
            cancel_url=f"{settings.FRONTEND_URL}/pricing?canceled=true",
            metadata={
                "user_id": user_id,
                "plan": request.plan,
            },
            subscription_data={
                "metadata": {
                    "user_id": user_id,
                    "plan": request.plan,
                }
            },
        )
        
        logger.info(f"Checkout session created for user {user_id}, plan {request.plan}")
        
        return CheckoutResponse(url=checkout_session.url)
        
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to create checkout session: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create checkout session: {str(e)}"
        )


@router.post("/webhook", include_in_schema=False)
async def handle_webhook(
    request: Request,
    stripe_signature: Optional[str] = Header(None, alias="stripe-signature"),
    settings: Settings = Depends(get_settings),
):
    """
    Handle Stripe webhook events.
    This endpoint doesn't require authentication as Stripe signs the requests.
    """
    if not stripe_signature:
        logger.warning("Webhook called without Stripe signature")
        raise HTTPException(status_code=400, detail="Missing Stripe signature")
    
    if not settings.STRIPE_WEBHOOK_SECRET:
        logger.error("Stripe webhook secret not configured")
        raise HTTPException(
            status_code=500,
            detail="Stripe webhook secret not configured"
        )
    
    try:
        stripe_client = get_stripe_client(settings)
        supabase = require_supabase()
        
        # Get raw body - read as bytes before FastAPI processes it
        payload = await request.body()
        
        if not payload:
            logger.warning("Webhook received empty payload")
            raise HTTPException(status_code=400, detail="Empty payload")
        
        # Verify webhook signature
        try:
            event = stripe_client.Webhook.construct_event(
                payload,
                stripe_signature,
                settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError as e:
            logger.error(f"Invalid webhook payload: {str(e)}")
            raise HTTPException(status_code=400, detail="Invalid payload")
        except stripe.error.SignatureVerificationError as e:
            logger.error(f"Invalid webhook signature: {str(e)}")
            raise HTTPException(status_code=400, detail="Invalid signature")
        
        # Handle the event
        event_type = event["type"]
        event_data = event["data"]["object"]
        
        logger.info(f"Received Stripe webhook: {event_type}")
        
        if event_type == "checkout.session.completed":
            await handle_checkout_completed(event_data, supabase, stripe_client)
        
        elif event_type == "invoice.payment_succeeded":
            await handle_invoice_payment_succeeded(event_data, supabase, stripe_client)
        
        elif event_type == "customer.subscription.updated":
            await handle_subscription_updated(event_data, supabase)
        
        elif event_type == "customer.subscription.deleted":
            await handle_subscription_deleted(event_data, supabase)
        
        else:
            logger.info(f"Unhandled webhook event type: {event_type}")
        
        return JSONResponse({"status": "success"})
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to handle webhook: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to handle webhook: {str(e)}"
        )


async def handle_checkout_completed(session_data: dict, supabase, stripe_client):
    """Handle checkout.session.completed event."""
    try:
        user_id = session_data.get("metadata", {}).get("user_id")
        plan = session_data.get("metadata", {}).get("plan", "pro")
        
        if not user_id:
            logger.warning("Checkout session completed without user_id in metadata")
            return
        
        customer_id = session_data.get("customer")
        subscription_id = session_data.get("subscription")
        
        # Determine tier based on plan
        tier = "pro" if plan == "pro" else "founding"
        
        # Get subscription to find renewal date
        renewal_date = None
        if subscription_id:
            try:
                subscription = stripe_client.Subscription.retrieve(subscription_id)
                renewal_date = datetime.fromtimestamp(
                    subscription.current_period_end
                ).isoformat()
            except Exception as e:
                logger.error(f"Failed to get subscription: {str(e)}")
        
        # Update profile
        update_data = {
            "tier": tier,
            "stripe_customer_id": customer_id,
            "stripe_subscription_id": subscription_id,
            "subscription_status": "active",
        }
        if renewal_date:
            update_data["renewal_date"] = renewal_date
        
        supabase.table("profiles").update(update_data).eq("id", user_id).execute()
        
        logger.info(f"Updated profile for user {user_id}: tier={tier}, subscription={subscription_id}")
        
    except Exception as e:
        logger.error(f"Error handling checkout completed: {str(e)}", exc_info=True)
        raise


async def handle_invoice_payment_succeeded(invoice_data: dict, supabase, stripe_client):
    """Handle invoice.payment_succeeded event."""
    try:
        subscription_id = invoice_data.get("subscription")
        customer_id = invoice_data.get("customer")
        
        if not subscription_id:
            return
        
        # Get subscription
        subscription = stripe_client.Subscription.retrieve(subscription_id)
        user_id = subscription.metadata.get("user_id")
        
        # Find user by customer ID if metadata doesn't have user_id
        if not user_id:
            profile_response = supabase.table("profiles").select("id").eq(
                "stripe_customer_id", customer_id
            ).execute()
            if profile_response.data:
                user_id = profile_response.data[0]["id"]
        
        if not user_id:
            logger.warning(f"Invoice payment succeeded but no user_id found for customer {customer_id}")
            return
        
        # Update renewal date
        renewal_date = datetime.fromtimestamp(
            subscription.current_period_end
        ).isoformat()
        
        supabase.table("profiles").update({
            "renewal_date": renewal_date,
            "subscription_status": "active",
        }).eq("id", user_id).execute()
        
        logger.info(f"Updated renewal date for user {user_id}")
        
    except Exception as e:
        logger.error(f"Error handling invoice payment succeeded: {str(e)}", exc_info=True)
        raise


async def handle_subscription_updated(subscription_data: dict, supabase):
    """Handle customer.subscription.updated event."""
    try:
        subscription_id = subscription_data.get("id")
        customer_id = subscription_data.get("customer")
        status = subscription_data.get("status")
        
        # Find user by customer ID
        profile_response = supabase.table("profiles").select("id").eq(
            "stripe_customer_id", customer_id
        ).execute()
        
        if not profile_response.data:
            logger.warning(f"Subscription updated but no user found for customer {customer_id}")
            return
        
        user_id = profile_response.data[0]["id"]
        
        # Determine tier from subscription metadata or default to pro
        plan = subscription_data.get("metadata", {}).get("plan", "pro")
        tier = "pro" if plan == "pro" else "founding"
        
        # Update profile
        update_data = {
            "subscription_status": status,
            "tier": tier if status == "active" else "free",
            "stripe_subscription_id": subscription_id,
        }
        
        # Update renewal date if subscription is active
        if status == "active" and subscription_data.get("current_period_end"):
            renewal_date = datetime.fromtimestamp(
                subscription_data["current_period_end"]
            ).isoformat()
            update_data["renewal_date"] = renewal_date
        
        supabase.table("profiles").update(update_data).eq("id", user_id).execute()
        
        logger.info(f"Updated subscription status for user {user_id}: status={status}")
        
    except Exception as e:
        logger.error(f"Error handling subscription updated: {str(e)}", exc_info=True)
        raise


async def handle_subscription_deleted(subscription_data: dict, supabase):
    """Handle customer.subscription.deleted event."""
    try:
        customer_id = subscription_data.get("customer")
        
        # Find user by customer ID
        profile_response = supabase.table("profiles").select("id").eq(
            "stripe_customer_id", customer_id
        ).execute()
        
        if not profile_response.data:
            logger.warning(f"Subscription deleted but no user found for customer {customer_id}")
            return
        
        user_id = profile_response.data[0]["id"]
        
        # Downgrade to free tier
        supabase.table("profiles").update({
            "tier": "free",
            "subscription_status": "canceled",
            "stripe_subscription_id": None,
            "renewal_date": None,
        }).eq("id", user_id).execute()
        
        logger.info(f"Downgraded user {user_id} to free tier")
        
    except Exception as e:
        logger.error(f"Error handling subscription deleted: {str(e)}", exc_info=True)
        raise

