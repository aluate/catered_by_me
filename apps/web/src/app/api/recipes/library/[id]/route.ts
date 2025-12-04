import { NextRequest } from "next/server";
import { getSupabaseServerClient, errorResponse, successResponse } from "@/lib/api-server";

/**
 * Get a single library recipe by ID
 * GET /api/recipes/library/[id]
 * No auth required (public endpoint)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseServerClient();

    const response = await supabase
      .from("recipe_library")
      .select("*")
      .eq("id", params.id)
      .single();

    if (response.error || !response.data) {
      return errorResponse("Recipe not found", 404);
    }

    const row = response.data;
    return successResponse({
      id: row.id,
      title: row.title,
      category: row.category,
      base_headcount: row.base_headcount,
      prep_time_minutes: row.prep_time_minutes || 0,
      cook_time_minutes: row.cook_time_minutes || 0,
      method: row.method,
      day_before_ok: row.day_before_ok || false,
      description: row.description,
      image_url: row.image_url,
      tags: row.tags || [],
      normalized: row.normalized,
      created_at: row.created_at,
    });
  } catch (error: any) {
    return errorResponse(`Failed to fetch recipe: ${error.message}`, 500);
  }
}

