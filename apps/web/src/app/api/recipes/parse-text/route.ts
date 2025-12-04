import { NextRequest } from "next/server";
import { parseTextRecipe } from "@/lib/recipe-parsing";
import { scaleRecipe } from "@/lib/recipe-scaling";
import { errorResponse, successResponse } from "@/lib/api-server";

/**
 * Parse recipe from text
 * POST /api/recipes/parse-text
 * No auth required (public endpoint)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, base_headcount, target_headcount, raw_text } = body;

    if (!raw_text || typeof base_headcount !== "number") {
      return errorResponse("Missing required fields: raw_text, base_headcount", 400);
    }

    // Parse the recipe
    let recipe = parseTextRecipe(title, base_headcount, raw_text);

    // Scale if target_headcount is provided and different
    if (
      target_headcount !== undefined &&
      target_headcount !== null &&
      target_headcount !== base_headcount
    ) {
      recipe = scaleRecipe(recipe, target_headcount);
    }

    return successResponse(recipe);
  } catch (error: any) {
    return errorResponse(`Failed to parse recipe: ${error.message}`, 500);
  }
}

