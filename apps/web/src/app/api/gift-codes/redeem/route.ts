import { NextRequest } from "next/server";
import {
  getSupabaseServerClient,
  requireAuth,
  errorResponse,
  successResponse,
} from "@/lib/api-server";

/**
 * Redeem a gift code
 * POST /api/gift-codes/redeem
 * Requires: Authorization header
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth(request);
    const supabase = getSupabaseServerClient();
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return errorResponse("Missing code", 400);
    }

    // Fetch gift code
    const fetchResponse = await supabase
      .from("gift_codes")
      .select("*")
      .eq("code", code)
      .single();

    if (fetchResponse.error) {
      return errorResponse("Gift code not found", 404);
    }

    if (!fetchResponse.data) {
      return errorResponse("Gift code not found", 404);
    }

    const giftCode = fetchResponse.data;

    // Validate code
    if (giftCode.status === "redeemed") {
      return errorResponse("This gift code has already been redeemed", 400);
    }

    if (giftCode.status === "expired") {
      return errorResponse("This gift code has expired", 400);
    }

    // Check expiration date
    const expiresAt = new Date(giftCode.expires_at);
    if (new Date() > expiresAt) {
      // Mark as expired
      await supabase
        .from("gift_codes")
        .update({ status: "expired" })
        .eq("id", giftCode.id)
        .execute();

      return errorResponse("This gift code has expired", 400);
    }

    // Update gift code
    const redeemedAt = new Date().toISOString();
    const updateResponse = await supabase
      .from("gift_codes")
      .update({
        status: "redeemed",
        redeemed_by: userId,
        redeemed_at: redeemedAt,
      })
      .eq("id", giftCode.id)
      .select()
      .single();

    if (updateResponse.error || !updateResponse.data) {
      return errorResponse("Failed to update gift code", 500);
    }

    // Update user profile to Pro tier
    const renewalDate = new Date();
    renewalDate.setFullYear(renewalDate.getFullYear() + 1);

    await supabase
      .from("profiles")
      .update({
        tier: "pro",
        subscription_status: "gift",
        renewal_date: renewalDate.toISOString(),
      })
      .eq("id", userId)
      .execute();

    const row = updateResponse.data;
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
    if (error.message === "Authentication required") {
      return errorResponse("Authentication required", 401);
    }
    return errorResponse(`Failed to redeem gift code: ${error.message}`, 500);
  }
}

