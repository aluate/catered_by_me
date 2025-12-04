import { NextRequest } from "next/server";
import {
  getSupabaseServerClient,
  requireAuth,
  errorResponse,
  successResponse,
} from "@/lib/api-server";

/**
 * Get a specific recipe
 * GET /api/recipes/[id]
 * Requires: Authorization header
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth(request);
    const supabase = getSupabaseServerClient();

    const response = await supabase
      .from("recipes")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", userId)
      .single();

    if (!response.data) {
      return errorResponse("Recipe not found", 404);
    }

    const row = response.data;
    return successResponse({
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      category: row.category,
      base_headcount: row.base_headcount,
      prep_time_minutes: row.prep_time_minutes,
      cook_time_minutes: row.cook_time_minutes,
      method: row.method,
      day_before_ok: row.day_before_ok,
      source_type: row.source_type,
      source_raw: row.source_raw,
      normalized: row.normalized,
      notes: row.notes,
      created_at: row.created_at,
      updated_at: row.updated_at,
    });
  } catch (error: any) {
    if (error.message === "Authentication required") {
      return errorResponse("Authentication required", 401);
    }
    return errorResponse(`Failed to fetch recipe: ${error.message}`, 500);
  }
}

/**
 * Update a recipe
 * PUT /api/recipes/[id]
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

    // Verify recipe exists and belongs to user
    const checkResponse = await supabase
      .from("recipes")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", userId)
      .single();

    if (!checkResponse.data) {
      return errorResponse("Recipe not found", 404);
    }

    // Validate enums if provided
    const validCategories = ["main", "side", "dessert", "app", "other"];
    const validMethods = ["oven", "stovetop", "no_cook", "mixed"];
    const validSourceTypes = ["text", "url", "pdf", "image"];

    if (body.category && !validCategories.includes(body.category)) {
      return errorResponse("Invalid category", 400);
    }
    if (body.method && !validMethods.includes(body.method)) {
      return errorResponse("Invalid method", 400);
    }
    if (body.source_type && !validSourceTypes.includes(body.source_type)) {
      return errorResponse("Invalid source_type", 400);
    }

    // Build update dict
    const updateData: any = {};
    if (body.title !== undefined) {
      updateData.title = body.title;
    }
    if (body.category !== undefined) {
      updateData.category = body.category;
    }
    if (body.base_headcount !== undefined) {
      updateData.base_headcount = body.base_headcount;
    }
    if (body.prep_time_minutes !== undefined) {
      updateData.prep_time_minutes = body.prep_time_minutes;
    }
    if (body.cook_time_minutes !== undefined) {
      updateData.cook_time_minutes = body.cook_time_minutes;
    }
    if (body.method !== undefined) {
      updateData.method = body.method;
    }
    if (body.day_before_ok !== undefined) {
      updateData.day_before_ok = body.day_before_ok;
    }
    if (body.source_type !== undefined) {
      updateData.source_type = body.source_type;
    }
    if (body.source_raw !== undefined) {
      updateData.source_raw = body.source_raw;
    }
    if (body.normalized !== undefined) {
      updateData.normalized = body.normalized;
    }
    if (body.notes !== undefined) {
      updateData.notes = body.notes;
    }

    if (Object.keys(updateData).length === 0) {
      // No fields to update, return existing recipe
      return GET(request, { params });
    }

    const response = await supabase
      .from("recipes")
      .update(updateData)
      .eq("id", params.id)
      .eq("user_id", userId)
      .select()
      .single();

    if (!response.data) {
      return errorResponse("Failed to update recipe", 500);
    }

    const row = response.data;
    return successResponse({
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      category: row.category,
      base_headcount: row.base_headcount,
      prep_time_minutes: row.prep_time_minutes,
      cook_time_minutes: row.cook_time_minutes,
      method: row.method,
      day_before_ok: row.day_before_ok,
      source_type: row.source_type,
      source_raw: row.source_raw,
      normalized: row.normalized,
      notes: row.notes,
      created_at: row.created_at,
      updated_at: row.updated_at,
    });
  } catch (error: any) {
    if (error.message === "Authentication required") {
      return errorResponse("Authentication required", 401);
    }
    return errorResponse(`Failed to update recipe: ${error.message}`, 500);
  }
}

/**
 * Delete a recipe
 * DELETE /api/recipes/[id]
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
      .from("recipes")
      .delete()
      .eq("id", params.id)
      .eq("user_id", userId);

    if (response.error) {
      return errorResponse(`Failed to delete recipe: ${response.error.message}`, 500);
    }

    return new Response(null, { status: 204 });
  } catch (error: any) {
    if (error.message === "Authentication required") {
      return errorResponse("Authentication required", 401);
    }
    return errorResponse(`Failed to delete recipe: ${error.message}`, 500);
  }
}

