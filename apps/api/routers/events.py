from typing import Optional
from uuid import UUID
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from ..dependencies import require_auth, Settings, get_settings
from ..lib.supabase_client import require_supabase
from ..services.scheduler import build_schedule
from ..models.recipes import Recipe as RecipeModel

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
    try:
        supabase = require_supabase()
        response = supabase.table("events").select("*").eq("user_id", user_id).order("event_date", desc=True, nulls_last=True).execute()
        
        return [
            EventResponse(
                id=str(row["id"]),
                user_id=str(row["user_id"]),
                name=row["name"],
                event_type=row["event_type"],
                event_date=row.get("event_date"),
                headcount=row.get("headcount"),
                location=row.get("location"),
                vibe=row.get("vibe"),
                notes=row.get("notes"),
                created_at=row["created_at"],
                updated_at=row["updated_at"],
            )
            for row in response.data
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch events: {str(e)}")


@router.post("", response_model=EventResponse, status_code=201)
async def create_event(
    request: EventCreateRequest,
    user_id: str = Depends(require_auth),
    settings: Settings = Depends(get_settings),
):
    """
    Create a new event.
    """
    try:
        supabase = require_supabase()
        
        # Validate enums
        if request.event_type not in ["prep_week", "event"]:
            raise HTTPException(status_code=400, detail="Invalid event_type")
        if request.vibe and request.vibe not in ["chill", "formal", "family_chaos"]:
            raise HTTPException(status_code=400, detail="Invalid vibe")
        
        insert_data = {
            "user_id": user_id,
            "name": request.name,
            "event_type": request.event_type,
        }
        if request.event_date:
            insert_data["event_date"] = request.event_date
        if request.headcount is not None:
            insert_data["headcount"] = request.headcount
        if request.location:
            insert_data["location"] = request.location
        if request.vibe:
            insert_data["vibe"] = request.vibe
        if request.notes:
            insert_data["notes"] = request.notes
        
        response = supabase.table("events").insert(insert_data).execute()
        
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create event")
        
        row = response.data[0]
        return EventResponse(
            id=str(row["id"]),
            user_id=str(row["user_id"]),
            name=row["name"],
            event_type=row["event_type"],
            event_date=row.get("event_date"),
            headcount=row.get("headcount"),
            location=row.get("location"),
            vibe=row.get("vibe"),
            notes=row.get("notes"),
            created_at=row["created_at"],
            updated_at=row["updated_at"],
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create event: {str(e)}")


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
    try:
        supabase = require_supabase()
        
        # Get event
        event_response = supabase.table("events").select("*").eq("id", event_id).eq("user_id", user_id).execute()
        if not event_response.data:
            raise HTTPException(status_code=404, detail="Event not found")
        
        event_row = event_response.data[0]
        
        # Get attached recipes
        recipes_response = supabase.table("event_recipes").select(
            "recipe_id, target_headcount, course_order, is_primary, recipes!inner(title)"
        ).eq("event_id", event_id).execute()
        
        recipes = []
        for er_row in recipes_response.data:
            recipes.append({
                "recipe_id": str(er_row["recipe_id"]),
                "recipe_title": er_row["recipes"]["title"],
                "target_headcount": er_row["target_headcount"],
                "course_order": er_row["course_order"],
                "is_primary": er_row["is_primary"],
            })
        
        return EventWithRecipesResponse(
            id=str(event_row["id"]),
            user_id=str(event_row["user_id"]),
            name=event_row["name"],
            event_type=event_row["event_type"],
            event_date=event_row.get("event_date"),
            headcount=event_row.get("headcount"),
            location=event_row.get("location"),
            vibe=event_row.get("vibe"),
            notes=event_row.get("notes"),
            created_at=event_row["created_at"],
            updated_at=event_row["updated_at"],
            recipes=recipes,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch event: {str(e)}")


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
    try:
        supabase = require_supabase()
        
        # Verify event exists and belongs to user
        check_response = supabase.table("events").select("id").eq("id", event_id).eq("user_id", user_id).execute()
        if not check_response.data:
            raise HTTPException(status_code=404, detail="Event not found")
        
        # Build update dict
        update_data = {}
        if request.name is not None:
            update_data["name"] = request.name
        if request.event_type is not None:
            if request.event_type not in ["prep_week", "event"]:
                raise HTTPException(status_code=400, detail="Invalid event_type")
            update_data["event_type"] = request.event_type
        if request.event_date is not None:
            update_data["event_date"] = request.event_date if request.event_date else None
        if request.headcount is not None:
            update_data["headcount"] = request.headcount
        if request.location is not None:
            update_data["location"] = request.location
        if request.vibe is not None:
            if request.vibe and request.vibe not in ["chill", "formal", "family_chaos"]:
                raise HTTPException(status_code=400, detail="Invalid vibe")
            update_data["vibe"] = request.vibe
        if request.notes is not None:
            update_data["notes"] = request.notes
        
        if not update_data:
            # Return existing event
            return await get_event(event_id, user_id, settings)
        
        response = supabase.table("events").update(update_data).eq("id", event_id).eq("user_id", user_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to update event")
        
        row = response.data[0]
        return EventResponse(
            id=str(row["id"]),
            user_id=str(row["user_id"]),
            name=row["name"],
            event_type=row["event_type"],
            event_date=row.get("event_date"),
            headcount=row.get("headcount"),
            location=row.get("location"),
            vibe=row.get("vibe"),
            notes=row.get("notes"),
            created_at=row["created_at"],
            updated_at=row["updated_at"],
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update event: {str(e)}")


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
    try:
        supabase = require_supabase()
        supabase.table("events").delete().eq("id", event_id).eq("user_id", user_id).execute()
        return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete event: {str(e)}")


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
    try:
        supabase = require_supabase()
        
        # Verify event belongs to user
        event_check = supabase.table("events").select("id").eq("id", event_id).eq("user_id", user_id).execute()
        if not event_check.data:
            raise HTTPException(status_code=404, detail="Event not found")
        
        # Verify recipe belongs to user
        recipe_check = supabase.table("recipes").select("id").eq("id", request.recipe_id).eq("user_id", user_id).execute()
        if not recipe_check.data:
            raise HTTPException(status_code=404, detail="Recipe not found")
        
        # Insert into event_recipes (unique constraint will prevent duplicates)
        response = supabase.table("event_recipes").insert({
            "event_id": event_id,
            "recipe_id": request.recipe_id,
            "target_headcount": request.target_headcount,
            "course_order": request.course_order,
            "is_primary": request.is_primary,
        }).execute()
        
        return {"success": True, "id": str(response.data[0]["id"])}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to attach recipe: {str(e)}")


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
    try:
        supabase = require_supabase()
        
        # Verify event belongs to user (via join check)
        event_check = supabase.table("events").select("id").eq("id", event_id).eq("user_id", user_id).execute()
        if not event_check.data:
            raise HTTPException(status_code=404, detail="Event not found")
        
        supabase.table("event_recipes").delete().eq("event_id", event_id).eq("recipe_id", recipe_id).execute()
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to detach recipe: {str(e)}")


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
    try:
        supabase = require_supabase()
        
        # Get event
        event_response = supabase.table("events").select("*").eq("id", event_id).eq("user_id", user_id).execute()
        if not event_response.data:
            raise HTTPException(status_code=404, detail="Event not found")
        
        event_row = event_response.data[0]
        
        # Determine serve time
        if serve_time:
            serve_time_dt = datetime.fromisoformat(serve_time.replace("Z", "+00:00"))
        elif event_row.get("event_date"):
            serve_time_dt = datetime.fromisoformat(event_row["event_date"].replace("Z", "+00:00"))
        else:
            raise HTTPException(status_code=400, detail="Event has no date and serve_time not provided")
        
        # Get attached recipes with their normalized data
        recipes_response = supabase.table("event_recipes").select(
            "recipe_id, target_headcount, recipes!inner(normalized, base_headcount)"
        ).eq("event_id", event_id).execute()
        
        if not recipes_response.data:
            raise HTTPException(status_code=400, detail="Event has no recipes attached")
        
        # Load and scale recipes
        recipe_models = []
        for er_row in recipes_response.data:
            normalized = er_row["recipes"].get("normalized")
            if not normalized:
                raise HTTPException(
                    status_code=400,
                    detail=f"Recipe {er_row['recipe_id']} has no normalized data. Please save the recipe first."
                )
            
            # Convert normalized dict back to Recipe model
            # This is a simplified version - in production you'd want better validation
            recipe_dict = normalized
            target_headcount = er_row["target_headcount"]
            base_headcount = er_row["recipes"]["base_headcount"]
            
            # Scale if needed
            if target_headcount != base_headcount:
                from ..services.scaling import scale_recipe
                recipe_model = RecipeModel(**recipe_dict)
                recipe_model = scale_recipe(recipe_model, target_headcount)
            else:
                recipe_model = RecipeModel(**recipe_dict)
            
            recipe_models.append(recipe_model)
        
        # Get user profile for capacity checks
        profile_response = supabase.table("profiles").select("oven_capacity_lbs, burner_count").eq("id", user_id).execute()
        user_profile = profile_response.data[0] if profile_response.data else None
        
        # Generate schedule
        schedule = build_schedule(recipe_models, serve_time_dt, user_profile)
        
        # Convert to dict for JSON response
        return {
            "serve_time": schedule.serve_time.isoformat(),
            "lanes": [
                {
                    "station": lane.station,
                    "tasks": [
                        {
                            "id": task.id,
                            "label": task.label,
                            "start_time": task.start_time.isoformat(),
                            "end_time": task.end_time.isoformat(),
                            "notes": task.notes,
                        }
                        for task in lane.tasks
                    ],
                }
                for lane in schedule.lanes
            ],
            "notes": schedule.notes,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate plan: {str(e)}")

