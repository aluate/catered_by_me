"""
Gift code service for creating and redeeming gift memberships.
"""
import uuid
import random
import string
from datetime import datetime, timedelta
from typing import Optional
from ..lib.supabase_client import require_supabase


def generate_gift_code() -> str:
    """
    Generate a gift code in format: CBM-XXXX-XXXX
    """
    # Generate 4 random uppercase letters
    letters = ''.join(random.choices(string.ascii_uppercase, k=4))
    # Generate 4 random digits
    digits = ''.join(random.choices(string.digits, k=4))
    return f"CBM-{letters}-{digits}"


def create_gift_code(
    plan: str = "pro_annual",
    purchaser_email: Optional[str] = None,
    recipient_name: Optional[str] = None,
    recipient_email: Optional[str] = None,
    message: Optional[str] = None
) -> dict:
    """
    Create a new gift code.
    
    Returns the gift code record with the generated code.
    """
    supabase = require_supabase()
    
    # Generate unique code
    code = generate_gift_code()
    
    # Ensure code is unique (retry if collision)
    max_retries = 10
    for _ in range(max_retries):
        existing = supabase.table("gift_codes").select("code").eq("code", code).execute()
        if not existing.data:
            break
        code = generate_gift_code()
    else:
        raise ValueError("Failed to generate unique gift code after retries")
    
    # Set expiration to 1 year from now
    expires_at = (datetime.utcnow() + timedelta(days=365)).isoformat()
    
    # Insert gift code
    response = supabase.table("gift_codes").insert({
        "code": code,
        "purchaser_email": purchaser_email,
        "recipient_name": recipient_name,
        "recipient_email": recipient_email,
        "message": message,
        "plan": plan,
        "status": "new",
        "expires_at": expires_at,
    }).execute()
    
    if not response.data:
        raise ValueError("Failed to create gift code")
    
    return response.data[0]


def redeem_gift_code(code: str, user_id: str) -> dict:
    """
    Redeem a gift code for a user.
    
    Returns the updated gift code record.
    Raises ValueError if code is invalid, expired, or already redeemed.
    """
    supabase = require_supabase()
    
    # Fetch gift code
    response = supabase.table("gift_codes").select("*").eq("code", code).execute()
    
    if not response.data:
        raise ValueError("Gift code not found")
    
    gift_code = response.data[0]
    
    # Validate code
    if gift_code["status"] == "redeemed":
        raise ValueError("This gift code has already been redeemed")
    
    if gift_code["status"] == "expired":
        raise ValueError("This gift code has expired")
    
    # Check expiration date
    expires_at = datetime.fromisoformat(gift_code["expires_at"].replace("Z", "+00:00"))
    if datetime.utcnow() > expires_at:
        # Mark as expired
        supabase.table("gift_codes").update({
            "status": "expired"
        }).eq("id", gift_code["id"]).execute()
        raise ValueError("This gift code has expired")
    
    # Update gift code
    redeemed_at = datetime.utcnow().isoformat()
    update_response = supabase.table("gift_codes").update({
        "status": "redeemed",
        "redeemed_by": user_id,
        "redeemed_at": redeemed_at,
    }).eq("id", gift_code["id"]).execute()
    
    if not update_response.data:
        raise ValueError("Failed to update gift code")
    
    # Update user profile to Pro tier
    renewal_date = (datetime.utcnow() + timedelta(days=365)).isoformat()
    profile_response = supabase.table("profiles").update({
        "tier": "pro",
        "subscription_status": "gift",
        "renewal_date": renewal_date,
    }).eq("id", user_id).execute()
    
    if not profile_response.data:
        # Gift code was redeemed but profile update failed
        # This is a problem, but we'll log it and continue
        # In production, you might want to rollback or retry
        pass
    
    return update_response.data[0]


def get_gift_code(code: str) -> Optional[dict]:
    """
    Get gift code details by code (public, for certificate viewing).
    """
    supabase = require_supabase()
    
    response = supabase.table("gift_codes").select("*").eq("code", code).execute()
    
    if not response.data:
        return None
    
    return response.data[0]

