import { NextRequest } from "next/server";
import {
  getSupabaseServerClient,
  requireAuth,
  errorResponse,
  successResponse,
} from "@/lib/api-server";

/**
 * Get current user profile
 * GET /api/users/me
 * Requires: Authorization header with Bearer token
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth(request);
    const supabase = getSupabaseServerClient();

    const response = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (!response.data) {
      return errorResponse("Profile not found", 404);
    }

    const row = response.data;
    return successResponse({
      id: row.id,
      email: row.email,
      display_name: row.display_name,
      default_headcount: row.default_headcount,
      oven_capacity_lbs: row.oven_capacity_lbs,
      burner_count: row.burner_count,
      created_at: row.created_at,
      updated_at: row.updated_at,
    });
  } catch (error: any) {
    if (error.message === "Authentication required") {
      return errorResponse("Authentication required", 401);
    }
    return errorResponse(`Failed to fetch profile: ${error.message}`, 500);
  }
}

/**
 * Update current user profile
 * PUT /api/users/me
 * Requires: Authorization header with Bearer token
 */
export async function PUT(request: NextRequest) {
  try {
    const userId = await requireAuth(request);
    const supabase = getSupabaseServerClient();
    const body = await request.json();

    // Build update dict from non-null fields
    const updateData: any = {};
    if (body.display_name !== undefined) {
      updateData.display_name = body.display_name;
    }
    if (body.default_headcount !== undefined) {
      updateData.default_headcount = body.default_headcount;
    }
    if (body.oven_capacity_lbs !== undefined) {
      updateData.oven_capacity_lbs = body.oven_capacity_lbs;
    }
    if (body.burner_count !== undefined) {
      updateData.burner_count = body.burner_count;
    }

    if (Object.keys(updateData).length === 0) {
      // No fields to update, return existing profile
      return GET(request);
    }

    const response = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();

    if (!response.data) {
      return errorResponse("Failed to update profile", 500);
    }

    const row = response.data;
    return successResponse({
      id: row.id,
      email: row.email,
      display_name: row.display_name,
      default_headcount: row.default_headcount,
      oven_capacity_lbs: row.oven_capacity_lbs,
      burner_count: row.burner_count,
      created_at: row.created_at,
      updated_at: row.updated_at,
    });
  } catch (error: any) {
    if (error.message === "Authentication required") {
      return errorResponse("Authentication required", 401);
    }
    return errorResponse(`Failed to update profile: ${error.message}`, 500);
  }
}

