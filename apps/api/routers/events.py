from typing import Optional
from uuid import UUID
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from ..dependencies import require_auth, Settings, get_settings

router = APIRouter(prefix="/events", tags=["events"])


# Request/Response models for API
class EventCreateRequest(BaseModel):
    name: str
    event_type: str  # 'prep_week' | 'event'
    event_date: Optional[str] = None  # ISO datetime string
    headcount: Optional[int] = None
    location: Optional[str] = None
    vibe: Optional[str] = None  # 'chill' | 'formal' | 'family_chaos'
    notes: Optional[str] = None


class EventUpdateRequest(BaseModel):
    name: Optional[str] = None
    event_type: Optional[str] = None
    event_date: Optional[str] = None
    headcount: Optional[int] = None
    location: Optional[str] = None
    vibe: Optional[str] = None
    notes: Optional[str] = None


class EventRecipeAttachRequest(BaseModel):
    recipe_id: str
    target_headcount: int
    course_order: int = 0
    is_primary: bool = False


class EventResponse(BaseModel):
    id: str
    user_id: str
    name: str
    event_type: str
    event_date: Optional[str] = None
    headcount: Optional[int] = None
    location: Optional[str] = None
    vibe: Optional[str] = None
    notes: Optional[str] = None
    created_at: str
    updated_at: str


class EventWithRecipesResponse(EventResponse):
    recipes: list[dict]  # List of attached recipes with event_recipe details


@router.get("", response_model=list[EventResponse])
async def list_events(
    user_id: str = Depends(require_auth),
    settings: Settings = Depends(get_settings),
):
    """
    List all events for the current user.
    """
    # TODO: Query Supabase events table
    return []


@router.post("", response_model=EventResponse, status_code=201)
async def create_event(
    request: EventCreateRequest,
    user_id: str = Depends(require_auth),
    settings: Settings = Depends(get_settings),
):
    """
    Create a new event.
    """
    # TODO: Insert into Supabase events table
    raise HTTPException(
        status_code=501,
        detail="Event creation not yet fully implemented. Supabase client integration needed."
    )


@router.get("/{event_id}", response_model=EventWithRecipesResponse)
async def get_event(
    event_id: str,
    user_id: str = Depends(require_auth),
    settings: Settings = Depends(get_settings),
):
    """
    Get a specific event by ID with attached recipes.
    Only returns events owned by the current user.
    """
    # TODO: Query Supabase events and event_recipes tables
    raise HTTPException(
        status_code=501,
        detail="Event retrieval not yet fully implemented. Supabase client integration needed."
    )


@router.put("/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: str,
    request: EventUpdateRequest,
    user_id: str = Depends(require_auth),
    settings: Settings = Depends(get_settings),
):
    """
    Update an event.
    Only allows updating events owned by the current user.
    """
    # TODO: Update Supabase events table
    raise HTTPException(
        status_code=501,
        detail="Event update not yet fully implemented. Supabase client integration needed."
    )


@router.delete("/{event_id}", status_code=204)
async def delete_event(
    event_id: str,
    user_id: str = Depends(require_auth),
    settings: Settings = Depends(get_settings),
):
    """
    Delete an event.
    Only allows deleting events owned by the current user.
    """
    # TODO: Delete from Supabase events table (cascade will handle event_recipes)
    raise HTTPException(
        status_code=501,
        detail="Event deletion not yet fully implemented. Supabase client integration needed."
    )


@router.post("/{event_id}/recipes", response_model=dict)
async def attach_recipe_to_event(
    event_id: str,
    request: EventRecipeAttachRequest,
    user_id: str = Depends(require_auth),
    settings: Settings = Depends(get_settings),
):
    """
    Attach a recipe to an event.
    """
    # TODO: Insert into event_recipes table
    raise HTTPException(
        status_code=501,
        detail="Recipe attachment not yet fully implemented. Supabase client integration needed."
    )


@router.delete("/{event_id}/recipes/{recipe_id}", status_code=204)
async def detach_recipe_from_event(
    event_id: str,
    recipe_id: str,
    user_id: str = Depends(require_auth),
    settings: Settings = Depends(get_settings),
):
    """
    Remove a recipe from an event.
    """
    # TODO: Delete from event_recipes table
    raise HTTPException(
        status_code=501,
        detail="Recipe detachment not yet fully implemented. Supabase client integration needed."
    )


@router.post("/{event_id}/plan", response_model=dict)
async def generate_event_plan(
    event_id: str,
    serve_time: Optional[str] = None,  # ISO datetime, optional override
    user_id: str = Depends(require_auth),
    settings: Settings = Depends(get_settings),
):
    """
    Generate a cooking schedule from an event's attached recipes.
    Uses event.event_date as serve_time unless serve_time is provided.
    """
    # TODO: Fetch event and attached recipes
    # TODO: Load normalized recipe data
    # TODO: Call scheduler service
    # TODO: Return schedule
    raise HTTPException(
        status_code=501,
        detail="Event plan generation not yet fully implemented. Supabase client integration needed."
    )

