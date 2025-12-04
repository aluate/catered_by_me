import { NextRequest } from "next/server";
import { getSupabaseServerClient, errorResponse, successResponse } from "@/lib/api-server";

/**
 * Add email to waitlist
 * POST /api/waitlist
 * No auth required
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, wants_tips = false, source } = body;

    if (!email) {
      return errorResponse("Missing email", 400);
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse("Invalid email format", 400);
    }

    const supabase = getSupabaseServerClient();

    // Check if email already exists
    const existing = await supabase
      .from("waitlist")
      .select("email")
      .eq("email", email)
      .single();

    if (existing.data) {
      // Already exists, update preferences
      await supabase
        .from("waitlist")
        .update({
          wants_tips: wants_tips,
          source: source || null,
          updated_at: new Date().toISOString(),
        })
        .eq("email", email)
        .execute();
    } else {
      // New entry
      await supabase
        .from("waitlist")
        .insert({
          email,
          wants_tips: wants_tips,
          source: source || "landing_page",
        })
        .execute();
    }

    return successResponse(
      { success: true, message: "Added to waitlist" },
      201
    );
  } catch (error: any) {
    return errorResponse(`Failed to add to waitlist: ${error.message}`, 500);
  }
}

