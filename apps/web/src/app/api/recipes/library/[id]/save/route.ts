import { NextRequest } from "next/server";
import {
  getSupabaseServerClient,
  requireAuth,
  errorResponse,
  successResponse,
} from "@/lib/api-server";

/**
 * Save a library recipe to the user's collection
 * POST /api/recipes/library/[id]/save
 * Requires: Authorization header
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth(request);
    const supabase = getSupabaseServerClient();

    // Get the library recipe
    const libraryResponse = await supabase
      .from("recipe_library")
      .select("*")
      .eq("id", params.id)
      .single();

    if (libraryResponse.error) {
      return errorResponse("Library recipe not found", 404);
    }

    if (!libraryResponse.data) {
      return errorResponse("Library recipe not found", 404);
    }

    const libraryRecipe = libraryResponse.data;

    // Create a copy in user's recipes table
    const recipeData: any = {
      user_id: userId,
      title: libraryRecipe.title,
      category: libraryRecipe.category,
      base_headcount: libraryRecipe.base_headcount,
      prep_time_minutes: libraryRecipe.prep_time_minutes || 0,
      cook_time_minutes: libraryRecipe.cook_time_minutes || 0,
      method: libraryRecipe.method,
      day_before_ok: libraryRecipe.day_before_ok || false,
      source_type: "library",
      source_raw: libraryRecipe.source_raw,
      normalized: libraryRecipe.normalized,
      notes: `Saved from recipe library: ${libraryRecipe.description || ""}`,
    };

    const response = await supabase
      .from("recipes")
      .insert(recipeData)
      .select()
      .single();

    if (response.error) {
      return errorResponse("Failed to save recipe", 500);
    }

    if (!response.data) {
      return errorResponse("Failed to save recipe", 500);
    }

    return successResponse(
      {
        id: response.data.id,
        message: "Recipe saved to your collection",
      },
      201
    );
  } catch (error: any) {
    if (error.message === "Authentication required") {
      return errorResponse("Authentication required", 401);
    }
    return errorResponse(`Failed to save recipe: ${error.message}`, 500);
  }
}

