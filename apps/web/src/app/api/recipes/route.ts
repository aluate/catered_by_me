import { NextRequest } from "next/server";
import {
  getSupabaseServerClient,
  requireAuth,
  errorResponse,
  successResponse,
} from "@/lib/api-server";

/**
 * List user's recipes
 * GET /api/recipes
 * Requires: Authorization header
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth(request);
    const supabase = getSupabaseServerClient();

    const response = await supabase
      .from("recipes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (response.error) {
      return errorResponse(`Failed to fetch recipes: ${response.error.message}`, 500);
    }

    const recipes = (response.data || []).map((row) => ({
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
    }));

    return successResponse(recipes);
  } catch (error: any) {
    if (error.message === "Authentication required") {
      return errorResponse("Authentication required", 401);
    }
    return errorResponse(`Failed to fetch recipes: ${error.message}`, 500);
  }
}

/**
 * Create a new recipe
 * POST /api/recipes
 * Requires: Authorization header
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth(request);
    const supabase = getSupabaseServerClient();
    const body = await request.json();

    // Validate enums
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

    const insertData: any = {
      user_id: userId,
      title: body.title,
      category: body.category,
      base_headcount: body.base_headcount,
      prep_time_minutes: body.prep_time_minutes ?? 0,
      cook_time_minutes: body.cook_time_minutes ?? 0,
      method: body.method,
      day_before_ok: body.day_before_ok ?? false,
      source_type: body.source_type ?? "text",
    };

    if (body.source_raw !== undefined) {
      insertData.source_raw = body.source_raw;
    }
    if (body.normalized !== undefined) {
      insertData.normalized = body.normalized;
    }
    if (body.notes !== undefined) {
      insertData.notes = body.notes;
    }

    const response = await supabase
      .from("recipes")
      .insert(insertData)
      .select()
      .single();

    if (response.error) {
      return errorResponse("Failed to create recipe", 500);
    }

    if (!response.data) {
      return errorResponse("Failed to create recipe", 500);
    }

    const row = response.data;
    return successResponse(
      {
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
      },
      201
    );
  } catch (error: any) {
    if (error.message === "Authentication required") {
      return errorResponse("Authentication required", 401);
    }
    return errorResponse(`Failed to create recipe: ${error.message}`, 500);
  }
}

