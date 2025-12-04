import { NextRequest } from "next/server";
import { getSupabaseServerClient, errorResponse, successResponse } from "@/lib/api-server";
import { generateGiftCode } from "@/lib/gift-codes";

/**
 * Create a new gift code
 * POST /api/gift-codes
 * No auth required (but will require payment in production)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      plan = "pro_annual",
      purchaser_email,
      recipient_name,
      recipient_email,
      message,
    } = body;

    const supabase = getSupabaseServerClient();

    // Generate unique code
    let code = generateGiftCode();

    // Ensure code is unique (retry if collision)
    const maxRetries = 10;
    for (let i = 0; i < maxRetries; i++) {
      const existing = await supabase
        .from("gift_codes")
        .select("code")
        .eq("code", code)
        .single();

      if (!existing.data) {
        break;
      }
      code = generateGiftCode();
    }

    // Set expiration to 1 year from now
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    // Insert gift code
    const response = await supabase
      .from("gift_codes")
      .insert({
        code,
        purchaser_email: purchaser_email || null,
        recipient_name: recipient_name || null,
        recipient_email: recipient_email || null,
        message: message || null,
        plan,
        status: "new",
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (response.error || !response.data) {
      return errorResponse("Failed to create gift code", 500);
    }

    const row = response.data;
    return successResponse(
      {
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
      },
      201
    );
  } catch (error: any) {
    return errorResponse(`Failed to create gift code: ${error.message}`, 500);
  }
}

