// apps/web/src/lib/featureFlags.ts

import { isDemoMode } from "./demo";

/**
 * Client-side feature flags and limits for monetization.
 * 
 * This is a soft paywall - we don't block features, just show upgrade prompts.
 * Real billing integration will come later.
 */

export interface UserLimits {
  maxEvents: number;
  maxRecipes: number;
  canExportPDF: boolean;
  canShare: boolean;
}

/**
 * Get limits for a user based on their tier.
 * For now, we use a simple free tier with limits.
 * 
 * TODO: In Phase 5, this will check user's subscription status from backend.
 */
export function getUserLimits(userTier: "free" | "pro" | "holiday_pass" = "free"): UserLimits {
  // In demo mode, always return Pro limits
  if (isDemoMode()) {
    return {
      maxEvents: Infinity,
      maxRecipes: Infinity,
      canExportPDF: true,
      canShare: true,
    };
  }

  if (userTier === "pro" || userTier === "holiday_pass") {
    return {
      maxEvents: Infinity,
      maxRecipes: Infinity,
      canExportPDF: true,
      canShare: true,
    };
  }

  // Free tier limits
  return {
    maxEvents: 3,
    maxRecipes: 10,
    canExportPDF: false,
    canShare: false,
  };
}

/**
 * Check if user has reached a limit.
 */
export function checkLimit(
  currentCount: number,
  limit: number,
  limitName: string
): { withinLimit: boolean; message?: string } {
  if (currentCount >= limit) {
    return {
      withinLimit: false,
      message: `You've reached the free tier limit of ${limit} ${limitName}. Upgrade to Pro for unlimited ${limitName}.`,
    };
  }
  return { withinLimit: true };
}

/**
 * Get upgrade message for a specific limit.
 */
export function getUpgradeMessage(limitName: string): string {
  return `Upgrade to Pro to unlock unlimited ${limitName} and more features.`;
}

