/**
 * Recipe scaling logic
 */

import type { Recipe, Ingredient } from "./recipe-parsing";

/**
 * Scale a recipe's ingredients to a target headcount
 */
export function scaleRecipe(recipe: Recipe, targetHeadcount: number): Recipe {
  const scaleFactor =
    recipe.headcount === 0 ? 1.0 : targetHeadcount / recipe.headcount;

  // Create scaled ingredients
  const scaledIngredients: Ingredient[] = recipe.ingredients.map((ing) => ({
    ...ing,
    quantity:
      ing.quantity !== null ? ing.quantity * scaleFactor : null,
    normalized_grams:
      ing.normalized_grams !== null
        ? ing.normalized_grams * scaleFactor
        : null,
  }));

  // Return new recipe with scaled ingredients
  return {
    ...recipe,
    headcount: targetHeadcount,
    ingredients: scaledIngredients,
  };
}

