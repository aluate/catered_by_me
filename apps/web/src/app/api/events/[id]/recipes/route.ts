import { NextRequest } from "next/server";
import {
  getSupabaseServerClient,
  requireAuth,
  errorResponse,
  successResponse,
} from "@/lib/api-server";

/**
 * Attach a recipe to an event
 * POST /api/events/[id]/recipes
 * Requires: Authorization header
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth(request);
    const supabase = getSupabaseServerClient();
    const body = await request.json();

    const { recipe_id, target_headcount, course_order = 0, is_primary = false } = body;

    if (!recipe_id || typeof target_headcount !== "number") {
      return errorResponse("Missing required fields: recipe_id, target_headcount", 400);
    }

    // Verify event belongs to user
    const eventCheck = await supabase
      .from("events")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", userId)
      .single();

    if (eventCheck.error) {
      return errorResponse("Event not found", 404);
    }

    if (!eventCheck.data) {
      return errorResponse("Event not found", 404);
    }

    // Verify recipe belongs to user
    const recipeCheck = await supabase
      .from("recipes")
      .select("id")
      .eq("id", recipe_id)
      .eq("user_id", userId)
      .single();

    if (recipeCheck.error) {
      return errorResponse("Recipe not found", 404);
    }

    if (!recipeCheck.data) {
      return errorResponse("Recipe not found", 404);
    }

    // Insert into event_recipes (unique constraint will prevent duplicates)
    const response = await supabase
      .from("event_recipes")
      .insert({
        event_id: params.id,
        recipe_id,
        target_headcount,
        course_order,
        is_primary,
      } as any)
      .select()
      .single();

    if (response.error) {
      return errorResponse("Failed to attach recipe", 500);
    }

    if (!response.data) {
      return errorResponse("Failed to attach recipe", 500);
    }

    return successResponse({ success: true, id: response.data.id });
  } catch (error: any) {
    if (error.message === "Authentication required") {
      return errorResponse("Authentication required", 401);
    }
    return errorResponse(`Failed to attach recipe: ${error.message}`, 500);
  }
}

