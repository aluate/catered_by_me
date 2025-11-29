"""
Simple in-memory rate limiting middleware.
For production, consider using Redis or a dedicated rate limiting service.
"""
import time
from collections import defaultdict
from typing import Dict, Tuple

# In-memory store: {user_id: [(timestamp, endpoint), ...]}
_request_history: Dict[str, list[Tuple[float, str]]] = defaultdict(list)

# Rate limits per endpoint (requests per window)
RATE_LIMITS = {
    "/schedule/generate": (10, 60),  # 10 requests per 60 seconds
    "/recipes": (20, 3600),  # 20 requests per hour
    "/events": (20, 3600),  # 20 requests per hour
    "/events/{id}/plan": (10, 60),  # 10 requests per minute
}

# Default limit
DEFAULT_LIMIT = (100, 3600)  # 100 requests per hour


def check_rate_limit(user_id: str, endpoint: str) -> Tuple[bool, int]:
    """
    Check if user has exceeded rate limit for endpoint.
    Returns (allowed, retry_after_seconds)
    """
    # Normalize endpoint (remove IDs)
    normalized = endpoint.split("/")[0] + "/" + endpoint.split("/")[1] if "/" in endpoint else endpoint
    
    # Get limit for this endpoint
    limit, window = RATE_LIMITS.get(normalized, DEFAULT_LIMIT)
    
    now = time.time()
    user_history = _request_history[user_id]
    
    # Clean old entries (outside window)
    cutoff = now - window
    user_history[:] = [(ts, ep) for ts, ep in user_history if ts > cutoff]
    
    # Count requests in window for this endpoint
    count = sum(1 for ts, ep in user_history if ep == normalized)
    
    if count >= limit:
        # Find oldest request in window to calculate retry_after
        oldest = min((ts for ts, ep in user_history if ep == normalized), default=now)
        retry_after = int(window - (now - oldest)) + 1
        return False, retry_after
    
    # Add this request
    user_history.append((now, normalized))
    
    return True, 0


def clear_rate_limit(user_id: str):
    """Clear rate limit history for a user (useful for testing)"""
    if user_id in _request_history:
        del _request_history[user_id]

