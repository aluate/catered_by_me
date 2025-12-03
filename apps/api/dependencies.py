from functools import lru_cache
from typing import Optional
import os
import jwt
from fastapi import HTTPException, Depends, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""
    APP_NAME: str = "Catered By Me API"
    DEBUG: bool = True
    
    # Supabase settings
    SUPABASE_URL: Optional[str] = None
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    SUPABASE_JWT_SECRET: Optional[str] = None
    
    # Stripe settings
    STRIPE_SECRET_KEY: Optional[str] = None
    STRIPE_WEBHOOK_SECRET: Optional[str] = None
    STRIPE_ENABLED: bool = True  # Set to False to disable Stripe
    
    # Frontend URL for redirects
    FRONTEND_URL: str = "https://cateredby.me"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


security = HTTPBearer(auto_error=False)


async def get_current_user_id(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    settings: Settings = Depends(get_settings),
) -> Optional[str]:
    """
    Verify Supabase JWT and extract user_id.
    Returns None if no token provided (for anonymous endpoints).
    Raises HTTPException if token is invalid.
    """
    if not credentials:
        return None
    
    token = credentials.credentials
    
    if not settings.SUPABASE_JWT_SECRET:
        # In development, if JWT secret is not set, we can't verify tokens
        # This allows the app to work without Supabase configured
        raise HTTPException(
            status_code=500,
            detail="JWT verification not configured. Please set SUPABASE_JWT_SECRET."
        )
    
    try:
        # Verify and decode the JWT
        # Supabase uses HS256 algorithm
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated",
        )
        
        # Extract user_id from the 'sub' claim (Supabase standard)
        user_id = payload.get("sub")
        
        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid token: missing user_id"
            )
        
        return user_id
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token has expired"
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid token: {str(e)}"
        )


async def require_auth(
    user_id: Optional[str] = Depends(get_current_user_id),
) -> str:
    """
    Dependency that requires authentication.
    Use this for endpoints that must have a logged-in user.
    """
    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Authentication required"
        )
    return user_id


async def require_auth_optional(
    user_id: Optional[str] = Depends(get_current_user_id),
) -> Optional[str]:
    """
    Dependency that allows optional authentication.
    Returns user_id if authenticated, None otherwise.
    Use this for endpoints that work with or without auth.
    """
    return user_id
