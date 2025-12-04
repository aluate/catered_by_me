import { NextRequest } from "next/server";
import {
  getSupabaseServerClient,
  requireAuth,
  errorResponse,
  successResponse,
} from "@/lib/api-server";

/**
 * List user's events
 * GET /api/events
 * Requires: Authorization header
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth(request);
    const supabase = getSupabaseServerClient();

    const response = await supabase
      .from("events")
      .select("*")
      .eq("user_id", userId)
      .order("event_date", { ascending: false });

    if (response.error) {
      return errorResponse(`Failed to fetch events: ${response.error.message}`, 500);
    }

    const events = (response.data || []).map((row) => ({
      id: row.id,
      user_id: row.user_id,
      name: row.name,
      event_type: row.event_type,
      event_date: row.event_date,
      headcount: row.headcount,
      location: row.location,
      vibe: row.vibe,
      notes: row.notes,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));

    return successResponse(events);
  } catch (error: any) {
    if (error.message === "Authentication required") {
      return errorResponse("Authentication required", 401);
    }
    return errorResponse(`Failed to fetch events: ${error.message}`, 500);
  }
}

/**
 * Create a new event
 * POST /api/events
 * Requires: Authorization header
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth(request);
    const supabase = getSupabaseServerClient();
    const body = await request.json();

    // Validate enums
    const validEventTypes = ["prep_week", "event"];
    const validVibes = ["chill", "formal", "family_chaos"];

    if (body.event_type && !validEventTypes.includes(body.event_type)) {
      return errorResponse("Invalid event_type", 400);
    }
    if (body.vibe && !validVibes.includes(body.vibe)) {
      return errorResponse("Invalid vibe", 400);
    }

    const insertData: any = {
      user_id: userId,
      name: body.name,
      event_type: body.event_type,
    };

    if (body.event_date !== undefined) {
      insertData.event_date = body.event_date;
    }
    if (body.headcount !== undefined) {
      insertData.headcount = body.headcount;
    }
    if (body.location !== undefined) {
      insertData.location = body.location;
    }
    if (body.vibe !== undefined) {
      insertData.vibe = body.vibe;
    }
    if (body.notes !== undefined) {
      insertData.notes = body.notes;
    }

    const response = await supabase
      .from("events")
      .insert(insertData)
      .select()
      .single();

    if (response.error || !response.data) {
      return errorResponse("Failed to create event", 500);
    }

    const row = response.data;
    return successResponse(
      {
        id: row.id,
        user_id: row.user_id,
        name: row.name,
        event_type: row.event_type,
        event_date: row.event_date,
        headcount: row.headcount,
        location: row.location,
        vibe: row.vibe,
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
    return errorResponse(`Failed to create event: ${error.message}`, 500);
  }
}

