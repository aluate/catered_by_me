from datetime import datetime
from typing import Optional
import logging
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .dependencies import get_settings, Settings, require_auth

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)
from .models.recipes import Recipe
from .models.schedule import Schedule
from .services.parsing import parse_text_recipe
from .services.scheduler import build_schedule
from .routers import recipes, events

app = FastAPI(title="Catered By Me API", version="0.1.0")

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://cateredby.me",
    "https://www.cateredby.me",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(recipes.router)
app.include_router(events.router)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


# Recipe endpoints

class ParseTextRequest(BaseModel):
    title: Optional[str] = None
    base_headcount: int
    target_headcount: Optional[int] = None
    raw_text: str


@app.post("/recipes/parse-text", response_model=Recipe)
async def parse_recipe_text(
    request: ParseTextRequest,
    settings: Settings = Depends(get_settings)
):
    """
    Parse a raw text recipe into a structured Recipe object.
    Optionally scales to target_headcount if provided.
    """
    from .services.scaling import scale_recipe
    
    # Parse the recipe with base headcount
    recipe = parse_text_recipe(
        title=request.title,
        headcount=request.base_headcount,
        raw_text=request.raw_text
    )
    
    # Scale if target_headcount is provided and different
    if request.target_headcount is not None and request.target_headcount != request.base_headcount:
        recipe = scale_recipe(recipe, request.target_headcount)
    
    return recipe


# Schedule endpoints

class GenerateScheduleRequest(BaseModel):
    recipes: list[Recipe]
    serve_time: datetime


@app.post("/schedule/generate", response_model=Schedule)
async def generate_schedule(
    request: GenerateScheduleRequest,
    settings: Settings = Depends(get_settings)
):
    """
    Generate a cooking schedule from one or more recipes.
    """
    # Anonymous endpoint - no user profile available
    return build_schedule(
        recipes=request.recipes,
        serve_time=request.serve_time,
        user_profile=None
    )


# User endpoints

class ProfileResponse(BaseModel):
    id: str
    email: str
    display_name: Optional[str] = None
    default_headcount: Optional[int] = None
    oven_capacity_lbs: Optional[int] = None
    burner_count: Optional[int] = None
    created_at: str
    updated_at: str


class ProfileUpdateRequest(BaseModel):
    display_name: Optional[str] = None
    default_headcount: Optional[int] = None
    oven_capacity_lbs: Optional[int] = None
    burner_count: Optional[int] = None


@app.get("/users/me", response_model=ProfileResponse)
async def get_current_user_profile(
    user_id: str = Depends(require_auth),
    settings: Settings = Depends(get_settings)
):
    """
    Get the current user's profile.
    Requires authentication.
    """
    try:
        from .lib.supabase_client import require_supabase
        supabase = require_supabase()
        
        response = supabase.table("profiles").select("*").eq("id", user_id).execute()
        
        if not response.data:
            # Profile might not exist yet (shouldn't happen due to trigger, but handle gracefully)
            raise HTTPException(status_code=404, detail="Profile not found")
        
        row = response.data[0]
        return ProfileResponse(
            id=str(row["id"]),
            email=row["email"],
            display_name=row.get("display_name"),
            default_headcount=row.get("default_headcount"),
            oven_capacity_lbs=row.get("oven_capacity_lbs"),
            burner_count=row.get("burner_count"),
            created_at=row["created_at"],
            updated_at=row["updated_at"],
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch profile: {str(e)}")


@app.put("/users/me", response_model=ProfileResponse)
async def update_current_user_profile(
    request: ProfileUpdateRequest,
    user_id: str = Depends(require_auth),
    settings: Settings = Depends(get_settings)
):
    """
    Update the current user's profile.
    Requires authentication.
    """
    try:
        from .lib.supabase_client import require_supabase
        supabase = require_supabase()
        
        # Build update dict
        update_data = {}
        if request.display_name is not None:
            update_data["display_name"] = request.display_name
        if request.default_headcount is not None:
            update_data["default_headcount"] = request.default_headcount
        if request.oven_capacity_lbs is not None:
            update_data["oven_capacity_lbs"] = request.oven_capacity_lbs
        if request.burner_count is not None:
            update_data["burner_count"] = request.burner_count
        
        if not update_data:
            # No fields to update, return existing profile
            return await get_current_user_profile(user_id, settings)
        
        response = supabase.table("profiles").update(update_data).eq("id", user_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to update profile")
        
        row = response.data[0]
        return ProfileResponse(
            id=str(row["id"]),
            email=row["email"],
            display_name=row.get("display_name"),
            default_headcount=row.get("default_headcount"),
            oven_capacity_lbs=row.get("oven_capacity_lbs"),
            burner_count=row.get("burner_count"),
            created_at=row["created_at"],
            updated_at=row["updated_at"],
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")

