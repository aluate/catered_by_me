import { NextRequest } from "next/server";
import { buildSchedule } from "@/lib/schedule-builder";
import { errorResponse, successResponse } from "@/lib/api-server";
import type { Recipe } from "@/lib/recipe-parsing";

/**
 * Generate cooking schedule from recipes
 * POST /api/schedule/generate
 * No auth required (public endpoint)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipes, serve_time } = body;

    if (!recipes || !Array.isArray(recipes) || recipes.length === 0) {
      return errorResponse("Missing or invalid recipes array", 400);
    }

    if (!serve_time) {
      return errorResponse("Missing serve_time", 400);
    }

    const serveTime = new Date(serve_time);
    if (isNaN(serveTime.getTime())) {
      return errorResponse("Invalid serve_time format", 400);
    }

    // Build schedule (no user profile for anonymous endpoint)
    const schedule = buildSchedule(recipes as Recipe[], serveTime, null);

    return successResponse(schedule);
  } catch (error: any) {
    return errorResponse(`Failed to generate schedule: ${error.message}`, 500);
  }
}

