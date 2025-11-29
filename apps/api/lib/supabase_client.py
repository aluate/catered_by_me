"""
Supabase client for backend database operations.
"""
from functools import lru_cache
from typing import Optional
from supabase import create_client, Client
from ..dependencies import get_settings, Settings


@lru_cache()
def get_supabase_client() -> Optional[Client]:
    """
    Get a Supabase client instance.
    Returns None if Supabase is not configured (for development).
    """
    settings = get_settings()
    
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        return None
    
    return create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_SERVICE_ROLE_KEY
    )


def require_supabase() -> Client:
    """
    Get Supabase client or raise an error if not configured.
    """
    client = get_supabase_client()
    if not client:
        raise RuntimeError(
            "Supabase not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
        )
    return client

