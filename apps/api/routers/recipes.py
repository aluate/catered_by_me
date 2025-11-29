from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime

from ..dependencies import require_auth, Settings, get_settings
from ..models.recipes import Recipe as RecipeModel
from ..lib.supabase_client import require_supabase

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
    try:
        supabase = require_supabase()
        response = supabase.table("recipes").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        
        return [
            RecipeResponse(
                id=str(row["id"]),
                user_id=str(row["user_id"]),
                title=row["title"],
                category=row["category"],
                base_headcount=row["base_headcount"],
                prep_time_minutes=row["prep_time_minutes"],
                cook_time_minutes=row["cook_time_minutes"],
                method=row["method"],
                day_before_ok=row["day_before_ok"],
                source_type=row["source_type"],
                source_raw=row.get("source_raw"),
                normalized=row.get("normalized"),
                notes=row.get("notes"),
                created_at=row["created_at"],
                updated_at=row["updated_at"],
            )
            for row in response.data
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch recipes: {str(e)}")


@router.post("", response_model=RecipeResponse, status_code=201)
async def create_recipe(
    request: RecipeCreateRequest,
    user_id: str = Depends(require_auth),
    settings: Settings = Depends(get_settings),
):
    """
    Create a new recipe.
    """
    try:
        supabase = require_supabase()
        
        # Validate category and method enums
        if request.category not in ["main", "side", "dessert", "app", "other"]:
            raise HTTPException(status_code=400, detail="Invalid category")
        if request.method not in ["oven", "stovetop", "no_cook", "mixed"]:
            raise HTTPException(status_code=400, detail="Invalid method")
        if request.source_type not in ["text", "url", "pdf", "image"]:
            raise HTTPException(status_code=400, detail="Invalid source_type")
        
        response = supabase.table("recipes").insert({
            "user_id": user_id,
            "title": request.title,
            "category": request.category,
            "base_headcount": request.base_headcount,
            "prep_time_minutes": request.prep_time_minutes,
            "cook_time_minutes": request.cook_time_minutes,
            "method": request.method,
            "day_before_ok": request.day_before_ok,
            "source_type": request.source_type,
            "source_raw": request.source_raw,
            "normalized": request.normalized,
            "notes": request.notes,
        }).execute()
        
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create recipe")
        
        row = response.data[0]
        return RecipeResponse(
            id=str(row["id"]),
            user_id=str(row["user_id"]),
            title=row["title"],
            category=row["category"],
            base_headcount=row["base_headcount"],
            prep_time_minutes=row["prep_time_minutes"],
            cook_time_minutes=row["cook_time_minutes"],
            method=row["method"],
            day_before_ok=row["day_before_ok"],
            source_type=row["source_type"],
            source_raw=row.get("source_raw"),
            normalized=row.get("normalized"),
            notes=row.get("notes"),
            created_at=row["created_at"],
            updated_at=row["updated_at"],
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create recipe: {str(e)}")


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
    try:
        supabase = require_supabase()
        response = supabase.table("recipes").select("*").eq("id", recipe_id).eq("user_id", user_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Recipe not found")
        
        row = response.data[0]
        return RecipeResponse(
            id=str(row["id"]),
            user_id=str(row["user_id"]),
            title=row["title"],
            category=row["category"],
            base_headcount=row["base_headcount"],
            prep_time_minutes=row["prep_time_minutes"],
            cook_time_minutes=row["cook_time_minutes"],
            method=row["method"],
            day_before_ok=row["day_before_ok"],
            source_type=row["source_type"],
            source_raw=row.get("source_raw"),
            normalized=row.get("normalized"),
            notes=row.get("notes"),
            created_at=row["created_at"],
            updated_at=row["updated_at"],
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch recipe: {str(e)}")


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
    try:
        supabase = require_supabase()
        
        # First verify the recipe exists and belongs to the user
        check_response = supabase.table("recipes").select("id").eq("id", recipe_id).eq("user_id", user_id).execute()
        if not check_response.data:
            raise HTTPException(status_code=404, detail="Recipe not found")
        
        # Build update dict from non-None fields
        update_data = {}
        if request.title is not None:
            update_data["title"] = request.title
        if request.category is not None:
            if request.category not in ["main", "side", "dessert", "app", "other"]:
                raise HTTPException(status_code=400, detail="Invalid category")
            update_data["category"] = request.category
        if request.base_headcount is not None:
            update_data["base_headcount"] = request.base_headcount
        if request.prep_time_minutes is not None:
            update_data["prep_time_minutes"] = request.prep_time_minutes
        if request.cook_time_minutes is not None:
            update_data["cook_time_minutes"] = request.cook_time_minutes
        if request.method is not None:
            if request.method not in ["oven", "stovetop", "no_cook", "mixed"]:
                raise HTTPException(status_code=400, detail="Invalid method")
            update_data["method"] = request.method
        if request.day_before_ok is not None:
            update_data["day_before_ok"] = request.day_before_ok
        if request.source_type is not None:
            if request.source_type not in ["text", "url", "pdf", "image"]:
                raise HTTPException(status_code=400, detail="Invalid source_type")
            update_data["source_type"] = request.source_type
        if request.source_raw is not None:
            update_data["source_raw"] = request.source_raw
        if request.normalized is not None:
            update_data["normalized"] = request.normalized
        if request.notes is not None:
            update_data["notes"] = request.notes
        
        if not update_data:
            # No fields to update, just return the existing recipe
            return await get_recipe(recipe_id, user_id, settings)
        
        response = supabase.table("recipes").update(update_data).eq("id", recipe_id).eq("user_id", user_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to update recipe")
        
        row = response.data[0]
        return RecipeResponse(
            id=str(row["id"]),
            user_id=str(row["user_id"]),
            title=row["title"],
            category=row["category"],
            base_headcount=row["base_headcount"],
            prep_time_minutes=row["prep_time_minutes"],
            cook_time_minutes=row["cook_time_minutes"],
            method=row["method"],
            day_before_ok=row["day_before_ok"],
            source_type=row["source_type"],
            source_raw=row.get("source_raw"),
            normalized=row.get("normalized"),
            notes=row.get("notes"),
            created_at=row["created_at"],
            updated_at=row["updated_at"],
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update recipe: {str(e)}")


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
    try:
        supabase = require_supabase()
        response = supabase.table("recipes").delete().eq("id", recipe_id).eq("user_id", user_id).execute()
        
        # Supabase returns empty data on successful delete
        # We can't easily check if it existed, but RLS will prevent unauthorized deletes
        return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete recipe: {str(e)}")

