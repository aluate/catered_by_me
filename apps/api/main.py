from datetime import datetime
from typing import Optional
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .dependencies import get_settings, Settings
from .models.recipes import Recipe
from .models.schedule import Schedule
from .services.parsing import parse_text_recipe
from .services.scheduler import build_schedule

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

