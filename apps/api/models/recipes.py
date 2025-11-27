from pydantic import BaseModel, Field
from typing import Optional


class Ingredient(BaseModel):
    """Represents a single ingredient with quantity and unit information."""
    name: str
    quantity: Optional[float] = None  # numeric quantity if known
    unit: Optional[str] = None  # "g", "cup", "tbsp", etc.
    notes: Optional[str] = None  # e.g., "finely diced", "softened"
    normalized_grams: Optional[float] = None  # filled in by scaling later


class AtomicTask(BaseModel):
    """Represents a single atomic cooking task."""
    id: str
    label: str  # e.g., "Dice onions"
    duration_minutes: int
    station: str  # "prep", "oven", "stove", "counter", "passive"
    depends_on: list[str] = Field(default_factory=list)  # ids of other tasks
    notes: Optional[str] = None


class Recipe(BaseModel):
    """Represents a complete recipe with ingredients and tasks."""
    id: str
    title: str
    headcount: int  # original yield this recipe is written for
    ingredients: list[Ingredient]
    tasks: list[AtomicTask]
    source: Optional[str] = None  # url, "manual", etc.

