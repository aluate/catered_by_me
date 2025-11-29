// apps/web/src/lib/colors.ts

/**
 * Recipe color coding helper
 * 
 * Generates consistent colors for recipes based on their ID.
 * Uses brand palette colors for visual consistency.
 */

const RECIPE_COLORS = [
  '#4F7C63', // sage green (accent-primary)
  '#F4A87A', // apricot (accent-secondary)
  '#2C3E50', // navy blue
  '#8B7355', // warm brown
  '#A67C52', // caramel
  '#6B8E7F', // muted sage
  '#D4A574', // light caramel
  '#5A7A6B', // dark sage
];

/**
 * Get a consistent color for a recipe based on its ID
 */
export function getRecipeColor(recipeId: string): string {
  if (!recipeId) return RECIPE_COLORS[0];
  
  // Generate hash from recipe ID
  const hash = recipeId
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  return RECIPE_COLORS[hash % RECIPE_COLORS.length];
}

/**
 * Get a color chip style object for a recipe
 */
export function getRecipeColorChip(recipeId: string): {
  backgroundColor: string;
  color: string;
} {
  const bgColor = getRecipeColor(recipeId);
  
  // Determine text color based on background brightness
  const r = parseInt(bgColor.slice(1, 3), 16);
  const g = parseInt(bgColor.slice(3, 5), 16);
  const b = parseInt(bgColor.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  return {
    backgroundColor: bgColor,
    color: brightness > 128 ? '#1E2220' : '#FFFFFF',
  };
}

