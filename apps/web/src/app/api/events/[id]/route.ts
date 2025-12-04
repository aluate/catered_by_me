import { NextRequest } from "next/server";
import {
  getSupabaseServerClient,
  requireAuth,
  errorResponse,
  successResponse,
} from "@/lib/api-server";

/**
 * Get a specific event with attached recipes
 * GET /api/events/[id]
 * Requires: Authorization header
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth(request);
    const supabase = getSupabaseServerClient();

    // Get event
    const eventResponse = await supabase
      .from("events")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", userId)
      .single();

    if (eventResponse.error || !eventResponse.data) {
      return errorResponse("Event not found", 404);
    }

    const eventRow = eventResponse.data;

    // Get attached recipes
    const recipesResponse = await supabase
      .from("event_recipes")
      .select(
        "recipe_id, target_headcount, course_order, is_primary, recipes!inner(title)"
      )
      .eq("event_id", params.id);

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

    return successResponse({
      id: eventRow.id,
      user_id: eventRow.user_id,
      name: eventRow.name,
      event_type: eventRow.event_type,
      event_date: eventRow.event_date,
      headcount: eventRow.headcount,
      location: eventRow.location,
      vibe: eventRow.vibe,
      notes: eventRow.notes,
      created_at: eventRow.created_at,
      updated_at: eventRow.updated_at,
      recipes,
    });
  } catch (error: any) {
    if (error.message === "Authentication required") {
      return errorResponse("Authentication required", 401);
    }
    return errorResponse(`Failed to fetch event: ${error.message}`, 500);
  }
}

/**
 * Update an event
 * PUT /api/events/[id]
 * Requires: Authorization header
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth(request);
    const supabase = getSupabaseServerClient();
    const body = await request.json();

    // Verify event exists and belongs to user
    const checkResponse = await supabase
      .from("events")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", userId)
      .single();

    if (checkResponse.error || !checkResponse.data) {
      return errorResponse("Event not found", 404);
    }

    // Validate enums if provided
    const validEventTypes = ["prep_week", "event"];
    const validVibes = ["chill", "formal", "family_chaos"];

    if (body.event_type && !validEventTypes.includes(body.event_type)) {
      return errorResponse("Invalid event_type", 400);
    }
    if (body.vibe && body.vibe !== null && !validVibes.includes(body.vibe)) {
      return errorResponse("Invalid vibe", 400);
    }

    // Build update dict
    const updateData: any = {};
    if (body.name !== undefined) {
      updateData.name = body.name;
    }
    if (body.event_type !== undefined) {
      updateData.event_type = body.event_type;
    }
    if (body.event_date !== undefined) {
      updateData.event_date = body.event_date || null;
    }
    if (body.headcount !== undefined) {
      updateData.headcount = body.headcount;
    }
    if (body.location !== undefined) {
      updateData.location = body.location;
    }
    if (body.vibe !== undefined) {
      updateData.vibe = body.vibe;
    }
    if (body.notes !== undefined) {
      updateData.notes = body.notes;
    }

    if (Object.keys(updateData).length === 0) {
      // No fields to update, return existing event
      return GET(request, { params });
    }

    const response = await supabase
      .from("events")
      .update(updateData)
      .eq("id", params.id)
      .eq("user_id", userId)
      .select()
      .single();

    if (response.error || !response.data) {
      return errorResponse("Failed to update event", 500);
    }

    const row = response.data;
    return successResponse({
      id: row.id,
      user_id: row.user_id,
      name: row.name,
      event_type: row.event_type,
      event_date: row.event_date,
      headcount: row.headcount,
      location: row.location,
      vibe: row.vibe,
      notes: row.notes,
      created_at: row.created_at,
      updated_at: row.updated_at,
    });
  } catch (error: any) {
    if (error.message === "Authentication required") {
      return errorResponse("Authentication required", 401);
    }
    return errorResponse(`Failed to update event: ${error.message}`, 500);
  }
}

/**
 * Delete an event
 * DELETE /api/events/[id]
 * Requires: Authorization header
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth(request);
    const supabase = getSupabaseServerClient();

    const response = await supabase
      .from("events")
      .delete()
      .eq("id", params.id)
      .eq("user_id", userId);

    if (response.error) {
      return errorResponse(`Failed to delete event: ${response.error.message}`, 500);
    }

    return new Response(null, { status: 204 });
  } catch (error: any) {
    if (error.message === "Authentication required") {
      return errorResponse("Authentication required", 401);
    }
    return errorResponse(`Failed to delete event: ${error.message}`, 500);
  }
}

