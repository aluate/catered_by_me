import { NextRequest } from "next/server";
import { getSupabaseServerClient, errorResponse, successResponse } from "@/lib/api-server";

/**
 * Get gift code details by code (public, for certificate viewing)
 * GET /api/gift-codes/[code]
 * No auth required
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const supabase = getSupabaseServerClient();

    const response = await supabase
      .from("gift_codes")
      .select("*")
      .eq("code", params.code)
      .single();

    if (response.error || !response.data) {
      return errorResponse("Gift code not found", 404);
    }

    const row = response.data;
    return successResponse({
      id: row.id,
      code: row.code,
      purchaser_email: row.purchaser_email,
      recipient_name: row.recipient_name,
      recipient_email: row.recipient_email,
      message: row.message,
      plan: row.plan,
      status: row.status,
      redeemed_by: row.redeemed_by,
      redeemed_at: row.redeemed_at,
      expires_at: row.expires_at,
      created_at: row.created_at,
    });
  } catch (error: any) {
    return errorResponse(`Failed to fetch gift code: ${error.message}`, 500);
  }
}

