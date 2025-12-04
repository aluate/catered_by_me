import { NextRequest } from "next/server";

/**
 * Health check endpoint
 * GET /api/health
 */
export async function GET(request: NextRequest) {
  return Response.json({ status: "ok" });
}

