import { NextRequest } from "next/server";
import { getSupabaseServerClient, errorResponse, successResponse } from "@/lib/api-server";

/**
 * Get event details by public token (no auth required)
 * GET /api/events/public/[token]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const supabase = getSupabaseServerClient();

    // Find event by public token
    const eventResponse = await supabase
      .from("events")
      .select("*")
      .eq("public_token", params.token)
      .single();

    if (eventResponse.error) {
      return errorResponse("Event not found or link expired", 404);
    }

    if (!eventResponse.data) {
      return errorResponse("Event not found or link expired", 404);
    }

    const eventRow = eventResponse.data;

    // Get attached recipes
    const recipesResponse = await supabase
      .from("event_recipes")
      .select(
        "recipe_id, target_headcount, course_order, is_primary, recipes!inner(title, normalized, base_headcount)"
      )
      .eq("event_id", eventRow.id);

    const recipes: any[] = [];
    if (recipesResponse.data) {
      for (const erRow of recipesResponse.data) {
        recipes.push({
          recipe_id: erRow.recipe_id,
          recipe_title: (erRow.recipes as any).title,
          target_headcount: erRow.target_headcount,
          course_order: erRow.course_order,
          is_primary: erRow.is_primary,
        });
      }
    }

    // Return public event data (no sensitive info)
    return successResponse({
      id: eventRow.id,
      name: eventRow.name,
      event_type: eventRow.event_type,
      event_date: eventRow.event_date,
      headcount: eventRow.headcount,
      location: eventRow.location,
      vibe: eventRow.vibe,
      notes: eventRow.notes,
      recipes,
    });
  } catch (error: any) {
    return errorResponse(`Failed to fetch event: ${error.message}`, 500);
  }
}

