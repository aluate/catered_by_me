/**
 * Server-side API utilities for Next.js API routes
 * Handles Supabase client initialization and auth
 */

import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import type { Database } from "./database.types";

/**
 * Get Supabase server client with service role key
 * This bypasses RLS and should only be used server-side
 */
export function getSupabaseServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing Supabase server credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Get Supabase client with user's token for RLS-aware operations
 * Use this when you want RLS to apply
 */
export function getSupabaseClientWithAuth(request: NextRequest) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const authHeader = request.headers.get("authorization");

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase credentials");
  }

  const client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // Set the auth token if provided
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    client.auth.setSession({
      access_token: token,
      refresh_token: "",
    } as any);
  }

  return client;
}

/**
 * Extract user ID from JWT token in Authorization header
 * Uses Supabase client to verify the token
 */
export async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get("authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  
  try {
    // Use Supabase client to verify token
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return null;
    }

    const client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Set the token and get user
    const { data: { user }, error } = await client.auth.getUser(token);
    
    if (error || !user) {
      return null;
    }

    return user.id;
  } catch (error) {
    // Token invalid or expired
    return null;
  }
}

/**
 * Require authentication - throws error if no valid user
 */
export async function requireAuth(request: NextRequest): Promise<string> {
  const userId = await getUserIdFromRequest(request);
  
  if (!userId) {
    throw new Error("Authentication required");
  }
  
  return userId;
}

/**
 * Create error response
 */
export function errorResponse(message: string, status: number = 500) {
  return Response.json(
    { detail: message },
    { status }
  );
}

/**
 * Create success response
 */
export function successResponse(data: any, status: number = 200) {
  return Response.json(data, { status });
}

