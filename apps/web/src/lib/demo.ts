// apps/web/src/lib/demo.ts

/**
 * Demo Mode Configuration
 * 
 * When DEMO_MODE is true:
 * - All Pro features are unlocked
 * - No database writes occur
 * - Confetti and success modals replace real actions
 * - Perfect for presentations and demos
 */

export const DEMO_MODE = false;

/**
 * Check if we're in demo mode
 */
export function isDemoMode(): boolean {
  return DEMO_MODE;
}

/**
 * Generate a fake demo ID
 */
export function generateDemoId(prefix: string = "demo"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Get demo user profile
 */
export function getDemoProfile() {
  return {
    id: "demo-user-hannah",
    email: "hannah@demo.cateredby.me",
    display_name: "Hannah (Demo)",
    default_headcount: 6,
    oven_capacity_lbs: 25,
    burner_count: 4,
    tier: "pro" as const,
  };
}

