import logging
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional

from ..dependencies import Settings, get_settings
from ..lib.supabase_client import require_supabase

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/waitlist", tags=["waitlist"])


class WaitlistRequest(BaseModel):
    email: EmailStr
    wants_tips: bool = False
    source: Optional[str] = None  # "landing_page", "signup", etc.


@router.post("", status_code=201)
async def add_to_waitlist(
    request: WaitlistRequest,
    settings: Settings = Depends(get_settings),
):
    """
    Add email to waitlist (no auth required).
    Used for marketing email capture.
    """
    try:
        supabase = require_supabase()
        
        # Check if email already exists
        existing = supabase.table("waitlist").select("email").eq("email", request.email).execute()
        
        if existing.data:
            # Already exists, update preferences
            supabase.table("waitlist").update({
                "wants_tips": request.wants_tips,
                "source": request.source,
                "updated_at": "now()",
            }).eq("email", request.email).execute()
            
            logger.info(f"Waitlist updated for {request.email}")
        else:
            # New entry
            supabase.table("waitlist").insert({
                "email": request.email,
                "wants_tips": request.wants_tips,
                "source": request.source or "landing_page",
            }).execute()
            
            logger.info(f"New waitlist signup: {request.email}")
        
        return {"success": True, "message": "Added to waitlist"}
    except Exception as e:
        logger.error(f"Failed to add to waitlist: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to add to waitlist")

