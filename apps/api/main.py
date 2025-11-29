from datetime import datetime
from typing import Optional
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .dependencies import get_settings, Settings, require_auth
from .models.recipes import Recipe
from .models.schedule import Schedule
from .services.parsing import parse_text_recipe
from .services.scheduler import build_schedule
from .routers import recipes
from .routers import recipes

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
    return build_schedule(
        recipes=request.recipes,
        serve_time=request.serve_time
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


@app.get("/users/me", response_model=ProfileResponse)
async def get_current_user_profile(
    user_id: str = Depends(require_auth),
    settings: Settings = Depends(get_settings)
):
    """
    Get the current user's profile.
    Requires authentication.
    """
    # For now, we'll need to query Supabase directly
    # In a full implementation, you'd use the Supabase Python client
    # For Phase 3A, we'll return a placeholder that indicates the endpoint works
    # The actual Supabase query will be added when we have the client set up
    
    # TODO: Query Supabase profiles table using service_role key
    # For now, return a response indicating auth is working
    # This will be fully implemented in Phase 3D when we add Supabase client to backend
    
    raise HTTPException(
        status_code=501,
        detail="Profile endpoint not yet fully implemented. JWT verification is working. Supabase client integration needed."
    )

