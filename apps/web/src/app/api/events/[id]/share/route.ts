import { NextRequest } from "next/server";
import {
  getSupabaseServerClient,
  requireAuth,
  errorResponse,
  successResponse,
} from "@/lib/api-server";

/**
 * Generate a public share token for an event
 * POST /api/events/[id]/share
 * Requires: Authorization header
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth(request);
    const supabase = getSupabaseServerClient();

    // Verify event belongs to user
    const eventCheck = await supabase
      .from("events")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", userId)
      .single();

    if (eventCheck.error || !eventCheck.data) {
      return errorResponse("Event not found", 404);
    }

    // Generate public token
    const publicToken = crypto.randomUUID();

    // Update event with public token
    await supabase
      .from("events")
      .update({ public_token: publicToken })
      .eq("id", params.id)
      .execute();

    return successResponse({
      public_token: publicToken,
      share_url: `/share/e/${publicToken}`,
    });
  } catch (error: any) {
    if (error.message === "Authentication required") {
      return errorResponse("Authentication required", 401);
    }
    return errorResponse(`Failed to create share link: ${error.message}`, 500);
  }
}

