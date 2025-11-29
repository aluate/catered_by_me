from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from ..dependencies import require_auth, Settings, get_settings
from ..models.recipes import Recipe as RecipeModel

router = APIRouter(prefix="/recipes", tags=["recipes"])


# Request/Response models for API
class RecipeCreateRequest(BaseModel):
    title: str
    category: str  # 'main', 'side', 'dessert', 'app', 'other'
    base_headcount: int
    prep_time_minutes: int = 0
    cook_time_minutes: int = 0
    method: str  # 'oven', 'stovetop', 'no_cook', 'mixed'
    day_before_ok: bool = False
    source_type: str = "text"  # 'text', 'url', 'pdf', 'image'
    source_raw: Optional[dict] = None
    normalized: Optional[dict] = None  # The parsed Recipe model as JSON
    notes: Optional[str] = None


class RecipeUpdateRequest(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    base_headcount: Optional[int] = None
    prep_time_minutes: Optional[int] = None
    cook_time_minutes: Optional[int] = None
    method: Optional[str] = None
    day_before_ok: Optional[bool] = None
    source_type: Optional[str] = None
    source_raw: Optional[dict] = None
    normalized: Optional[dict] = None
    notes: Optional[str] = None


class RecipeResponse(BaseModel):
    id: str
    user_id: str
    title: str
    category: str
    base_headcount: int
    prep_time_minutes: int
    cook_time_minutes: int
    method: str
    day_before_ok: bool
    source_type: str
    source_raw: Optional[dict] = None
    normalized: Optional[dict] = None
    notes: Optional[str] = None
    created_at: str
    updated_at: str


@router.get("", response_model=list[RecipeResponse])
async def list_recipes(
    user_id: str = Depends(require_auth),
    settings: Settings = Depends(get_settings),
):
    """
    List all recipes for the current user.
    """
    # TODO: Query Supabase recipes table
    # For now, return empty list until Supabase client is set up in Phase 3D
    # This endpoint structure is ready for Supabase integration
    return []


@router.post("", response_model=RecipeResponse, status_code=201)
async def create_recipe(
    request: RecipeCreateRequest,
    user_id: str = Depends(require_auth),
    settings: Settings = Depends(get_settings),
):
    """
    Create a new recipe.
    """
    # TODO: Insert into Supabase recipes table
    # For now, return a placeholder response
    raise HTTPException(
        status_code=501,
        detail="Recipe creation not yet fully implemented. Supabase client integration needed."
    )


@router.get("/{recipe_id}", response_model=RecipeResponse)
async def get_recipe(
    recipe_id: str,
    user_id: str = Depends(require_auth),
    settings: Settings = Depends(get_settings),
):
    """
    Get a specific recipe by ID.
    Only returns recipes owned by the current user.
    """
    # TODO: Query Supabase recipes table with user_id check
    raise HTTPException(
        status_code=501,
        detail="Recipe retrieval not yet fully implemented. Supabase client integration needed."
    )


@router.put("/{recipe_id}", response_model=RecipeResponse)
async def update_recipe(
    recipe_id: str,
    request: RecipeUpdateRequest,
    user_id: str = Depends(require_auth),
    settings: Settings = Depends(get_settings),
):
    """
    Update a recipe.
    Only allows updating recipes owned by the current user.
    """
    # TODO: Update Supabase recipes table with user_id check
    raise HTTPException(
        status_code=501,
        detail="Recipe update not yet fully implemented. Supabase client integration needed."
    )


@router.delete("/{recipe_id}", status_code=204)
async def delete_recipe(
    recipe_id: str,
    user_id: str = Depends(require_auth),
    settings: Settings = Depends(get_settings),
):
    """
    Delete a recipe.
    Only allows deleting recipes owned by the current user.
    """
    # TODO: Delete from Supabase recipes table with user_id check
    raise HTTPException(
        status_code=501,
        detail="Recipe deletion not yet fully implemented. Supabase client integration needed."
    )

