import { NextRequest } from "next/server";
import { getSupabaseServerClient, errorResponse, successResponse } from "@/lib/api-server";

/**
 * List public recipes from the library
 * GET /api/recipes/library?category=...&search=...&limit=...&offset=...
 * No auth required
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");

    const supabase = getSupabaseServerClient();

    let query = supabase.from("recipe_library").select("*", { count: "exact" });

    // Apply filters
    if (category) {
      query = query.eq("category", category);
    }

    if (search) {
      // Use PostgreSQL full-text search (ilike for case-insensitive)
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply pagination
    query = query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);

    const response = await query;

    if (response.error) {
      return errorResponse(`Failed to fetch library recipes: ${response.error.message}`, 500);
    }

    const recipes = (response.data || []).map((row) => ({
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
    }));

    const total = (response as any).count || recipes.length;

    return successResponse({
      recipes,
      total,
      limit,
      offset,
    });
  } catch (error: any) {
    return errorResponse(`Failed to fetch library recipes: ${error.message}`, 500);
  }
}

