"""
Recipe Library Router
Public recipe library endpoints for browsing and searching recipes.
"""

from typing import Optional, List
from fastapi import APIRouter, Query, HTTPException, Depends
from pydantic import BaseModel

from ..dependencies import get_settings, Settings, require_auth_optional
from ..lib.supabase_client import require_supabase
from ..models.recipes import Recipe as RecipeModel

router = APIRouter(prefix="/recipes/library", tags=["recipe-library"])


class LibraryRecipeResponse(BaseModel):
    """Response model for library recipes."""
    id: str
    title: str
    category: str
    base_headcount: int
    prep_time_minutes: int
    cook_time_minutes: int
    method: str
    day_before_ok: bool
    description: Optional[str] = None
    image_url: Optional[str] = None
    tags: List[str] = []
    normalized: dict  # Full recipe data
    created_at: str


class LibraryRecipeListResponse(BaseModel):
    """Paginated list response."""
    recipes: List[LibraryRecipeResponse]
    total: int
    limit: int
    offset: int


@router.get("", response_model=LibraryRecipeListResponse)
async def list_library_recipes(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search query"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    settings: Settings = Depends(get_settings),
):
    """
    List public recipes from the library.
    No authentication required - this is public.
    """
    try:
        supabase = require_supabase()
        
        query = supabase.table("recipe_library").select("*", count="exact")
        
        # Apply filters
        if category:
            query = query.eq("category", category)
        
        if search:
            # Use PostgreSQL full-text search
            query = query.or_(f"title.ilike.%{search}%,description.ilike.%{search}%")
        
        # Apply pagination
        query = query.order("created_at", desc=True).range(offset, offset + limit - 1)
        
        response = query.execute()
        
        recipes = [
            LibraryRecipeResponse(
                id=str(row["id"]),
                title=row["title"],
                category=row["category"],
                base_headcount=row["base_headcount"],
                prep_time_minutes=row.get("prep_time_minutes", 0),
                cook_time_minutes=row.get("cook_time_minutes", 0),
                method=row["method"],
                day_before_ok=row.get("day_before_ok", False),
                description=row.get("description"),
                image_url=row.get("image_url"),
                tags=row.get("tags", []),
                normalized=row["normalized"],
                created_at=row["created_at"],
            )
            for row in response.data
        ]
        
        total = response.count if hasattr(response, 'count') and response.count else len(recipes)
        
        return LibraryRecipeListResponse(
            recipes=recipes,
            total=total,
            limit=limit,
            offset=offset,
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch library recipes: {str(e)}")


@router.get("/{recipe_id}", response_model=LibraryRecipeResponse)
async def get_library_recipe(
    recipe_id: str,
    settings: Settings = Depends(get_settings),
):
    """Get a single library recipe by ID. Public endpoint."""
    try:
        supabase = require_supabase()
        response = supabase.table("recipe_library").select("*").eq("id", recipe_id).single().execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Recipe not found")
        
        row = response.data
        return LibraryRecipeResponse(
            id=str(row["id"]),
            title=row["title"],
            category=row["category"],
            base_headcount=row["base_headcount"],
            prep_time_minutes=row.get("prep_time_minutes", 0),
            cook_time_minutes=row.get("cook_time_minutes", 0),
            method=row["method"],
            day_before_ok=row.get("day_before_ok", False),
            description=row.get("description"),
            image_url=row.get("image_url"),
            tags=row.get("tags", []),
            normalized=row["normalized"],
            created_at=row["created_at"],
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch recipe: {str(e)}")


@router.post("/{recipe_id}/save", status_code=201)
async def save_library_recipe(
    recipe_id: str,
    user_id: Optional[str] = Depends(require_auth_optional),
    settings: Settings = Depends(get_settings),
):
    """
    Save a library recipe to the user's collection.
    Requires authentication.
    """
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    try:
        supabase = require_supabase()
        
        # Get the library recipe
        library_response = supabase.table("recipe_library").select("*").eq("id", recipe_id).single().execute()
        
        if not library_response.data:
            raise HTTPException(status_code=404, detail="Library recipe not found")
        
        library_recipe = library_response.data
        
        # Create a copy in user's recipes table
        recipe_data = {
            "user_id": user_id,
            "title": library_recipe["title"],
            "category": library_recipe["category"],
            "base_headcount": library_recipe["base_headcount"],
            "prep_time_minutes": library_recipe.get("prep_time_minutes", 0),
            "cook_time_minutes": library_recipe.get("cook_time_minutes", 0),
            "method": library_recipe["method"],
            "day_before_ok": library_recipe.get("day_before_ok", False),
            "source_type": "library",
            "source_raw": library_recipe.get("source_raw"),
            "normalized": library_recipe["normalized"],
            "notes": f"Saved from recipe library: {library_recipe.get('description', '')}",
        }
        
        response = supabase.table("recipes").insert(recipe_data).execute()
        
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to save recipe")
        
        return {"id": str(response.data[0]["id"]), "message": "Recipe saved to your collection"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save recipe: {str(e)}")

