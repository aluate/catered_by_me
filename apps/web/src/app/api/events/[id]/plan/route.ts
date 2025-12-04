import { NextRequest } from "next/server";
import {
  getSupabaseServerClient,
  requireAuth,
  errorResponse,
  successResponse,
} from "@/lib/api-server";
import { buildSchedule } from "@/lib/schedule-builder";
import { scaleRecipe } from "@/lib/recipe-scaling";
import type { Recipe } from "@/lib/recipe-parsing";

/**
 * Generate a cooking schedule from an event's attached recipes
 * POST /api/events/[id]/plan?serve_time=...
 * Requires: Authorization header
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth(request);
    const supabase = getSupabaseServerClient();

    // Get serve_time from query params if provided
    const { searchParams } = new URL(request.url);
    const serveTimeOverride = searchParams.get("serve_time");

    // Get event
    const eventResponse = await supabase
      .from("events")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", userId)
      .single();

    if (eventResponse.error) {
      return errorResponse("Event not found", 404);
    }

    if (!eventResponse.data) {
      return errorResponse("Event not found", 404);
    }

    const eventRow = eventResponse.data;

    // Determine serve time
    let serveTime: Date;
    if (serveTimeOverride) {
      serveTime = new Date(serveTimeOverride);
    } else if (eventRow.event_date) {
      serveTime = new Date(eventRow.event_date);
    } else {
      return errorResponse("Event has no date and serve_time not provided", 400);
    }

    if (isNaN(serveTime.getTime())) {
      return errorResponse("Invalid serve_time format", 400);
    }

    // Get attached recipes with their normalized data
    const recipesResponse = await supabase
      .from("event_recipes")
      .select("recipe_id, target_headcount, recipes!inner(normalized, base_headcount)")
      .eq("event_id", params.id);

    if (recipesResponse.error) {
      return errorResponse("Event has no recipes attached", 400);
    }

    if (!recipesResponse.data || recipesResponse.data.length === 0) {
      return errorResponse("Event has no recipes attached", 400);
    }

    // Load and scale recipes
    const recipeModels: Recipe[] = [];
    for (const erRow of recipesResponse.data) {
      const normalized = (erRow.recipes as any).normalized;
      if (!normalized) {
        return errorResponse(
          `Recipe ${erRow.recipe_id} has no normalized data. Please save the recipe first.`,
          400
        );
      }

      // Convert normalized dict back to Recipe
      const recipeDict = normalized as Recipe;
      const targetHeadcount = erRow.target_headcount;
      const baseHeadcount = (erRow.recipes as any).base_headcount;

      // Scale if needed
      let recipe: Recipe;
      if (targetHeadcount !== baseHeadcount) {
        recipe = scaleRecipe(recipeDict, targetHeadcount);
      } else {
        recipe = recipeDict;
      }

      recipeModels.push(recipe);
    }

    // Get user profile for capacity checks
    const profileResponse = await supabase
      .from("profiles")
      .select("oven_capacity_lbs, burner_count")
      .eq("id", userId)
      .single();

    const userProfile = profileResponse.data
      ? {
          oven_capacity_lbs: profileResponse.data.oven_capacity_lbs,
          burner_count: profileResponse.data.burner_count,
        }
      : null;

    // Generate schedule
    const schedule = buildSchedule(recipeModels, serveTime, userProfile);

    return successResponse({
      serve_time: schedule.serve_time,
      lanes: schedule.lanes,
      notes: schedule.notes,
      warnings: schedule.warnings,
    });
  } catch (error: any) {
    if (error.message === "Authentication required") {
      return errorResponse("Authentication required", 401);
    }
    return errorResponse(`Failed to generate plan: ${error.message}`, 500);
  }
}

