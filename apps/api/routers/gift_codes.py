"""
Gift code API endpoints.
"""
import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr

from ..dependencies import require_auth, Settings, get_settings
from ..lib.supabase_client import require_supabase
from ..services.gift_codes import create_gift_code, redeem_gift_code, get_gift_code

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/gift-codes", tags=["gift-codes"])


# Request/Response models
class GiftCodeCreateRequest(BaseModel):
    purchaser_email: Optional[EmailStr] = None
    recipient_name: Optional[str] = None
    recipient_email: Optional[EmailStr] = None
    message: Optional[str] = None
    plan: str = "pro_annual"


class GiftCodeRedeemRequest(BaseModel):
    code: str


class GiftCodeResponse(BaseModel):
    id: str
    code: str
    purchaser_email: Optional[str] = None
    recipient_name: Optional[str] = None
    recipient_email: Optional[str] = None
    message: Optional[str] = None
    plan: str
    status: str
    redeemed_by: Optional[str] = None
    redeemed_at: Optional[str] = None
    expires_at: str
    created_at: str


@router.post("", response_model=GiftCodeResponse, status_code=201)
async def create_gift(
    request: GiftCodeCreateRequest,
    settings: Settings = Depends(get_settings),
):
    """
    Create a new gift code (no auth required for demo, but will require payment in production).
    """
    try:
        gift_code = create_gift_code(
            plan=request.plan,
            purchaser_email=request.purchaser_email,
            recipient_name=request.recipient_name,
            recipient_email=request.recipient_email,
            message=request.message,
        )
        
        logger.info(f"Gift code created: {gift_code['code']}")
        
        return GiftCodeResponse(
            id=str(gift_code["id"]),
            code=gift_code["code"],
            purchaser_email=gift_code.get("purchaser_email"),
            recipient_name=gift_code.get("recipient_name"),
            recipient_email=gift_code.get("recipient_email"),
            message=gift_code.get("message"),
            plan=gift_code["plan"],
            status=gift_code["status"],
            redeemed_by=str(gift_code["redeemed_by"]) if gift_code.get("redeemed_by") else None,
            redeemed_at=gift_code.get("redeemed_at"),
            expires_at=gift_code["expires_at"],
            created_at=gift_code["created_at"],
        )
    except Exception as e:
        logger.error(f"Failed to create gift code: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to create gift code: {str(e)}")


@router.post("/redeem", response_model=GiftCodeResponse)
async def redeem_gift(
    request: GiftCodeRedeemRequest,
    user_id: str = Depends(require_auth),
    settings: Settings = Depends(get_settings),
):
    """
    Redeem a gift code (requires authentication).
    """
    try:
        redeemed = redeem_gift_code(request.code, user_id)
        
        logger.info(f"Gift code redeemed: {request.code} by user {user_id}")
        
        return GiftCodeResponse(
            id=str(redeemed["id"]),
            code=redeemed["code"],
            purchaser_email=redeemed.get("purchaser_email"),
            recipient_name=redeemed.get("recipient_name"),
            recipient_email=redeemed.get("recipient_email"),
            message=redeemed.get("message"),
            plan=redeemed["plan"],
            status=redeemed["status"],
            redeemed_by=str(redeemed["redeemed_by"]) if redeemed.get("redeemed_by") else None,
            redeemed_at=redeemed.get("redeemed_at"),
            expires_at=redeemed["expires_at"],
            created_at=redeemed["created_at"],
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to redeem gift code: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to redeem gift code: {str(e)}")


@router.get("/{code}", response_model=GiftCodeResponse)
async def get_gift(
    code: str,
    settings: Settings = Depends(get_settings),
):
    """
    Get gift code details by code (public, for certificate viewing).
    """
    try:
        gift_code = get_gift_code(code)
        
        if not gift_code:
            raise HTTPException(status_code=404, detail="Gift code not found")
        
        return GiftCodeResponse(
            id=str(gift_code["id"]),
            code=gift_code["code"],
            purchaser_email=gift_code.get("purchaser_email"),
            recipient_name=gift_code.get("recipient_name"),
            recipient_email=gift_code.get("recipient_email"),
            message=gift_code.get("message"),
            plan=gift_code["plan"],
            status=gift_code["status"],
            redeemed_by=str(gift_code["redeemed_by"]) if gift_code.get("redeemed_by") else None,
            redeemed_at=gift_code.get("redeemed_at"),
            expires_at=gift_code["expires_at"],
            created_at=gift_code["created_at"],
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch gift code: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to fetch gift code: {str(e)}")

