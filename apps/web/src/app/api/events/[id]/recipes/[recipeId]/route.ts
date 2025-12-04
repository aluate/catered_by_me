import { NextRequest } from "next/server";
import {
  getSupabaseServerClient,
  requireAuth,
  errorResponse,
} from "@/lib/api-server";

/**
 * Remove a recipe from an event
 * DELETE /api/events/[id]/recipes/[recipeId]
 * Requires: Authorization header
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; recipeId: string } }
) {
  try {
    const userId = await requireAuth(request);
    const supabase = getSupabaseServerClient();

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

    const response = await supabase
      .from("event_recipes")
      .delete()
      .eq("event_id", params.id)
      .eq("recipe_id", params.recipeId);

    if (response.error) {
      return errorResponse(`Failed to detach recipe: ${response.error.message}`, 500);
    }

    return new Response(null, { status: 204 });
  } catch (error: any) {
    if (error.message === "Authentication required") {
      return errorResponse("Authentication required", 401);
    }
    return errorResponse(`Failed to detach recipe: ${error.message}`, 500);
  }
}

