// apps/web/src/lib/grocery.ts

import type { SavedRecipe, SavedEvent, EventWithRecipes } from "./api";

export type StoreSection =
  | "produce"
  | "meat_seafood"
  | "dairy_eggs"
  | "pantry"
  | "frozen"
  | "bakery"
  | "other";

export interface GroceryItem {
  id: string; // e.g. eventId + recipeId + ingredient name
  name: string; // "bell peppers"
  quantity?: string; // keep as string for now, e.g. "3 lbs", "2"
  section: StoreSection;
  recipeNames: string[]; // which recipes use this
}

export interface GrocerySection {
  section: StoreSection;
  label: string; // "Produce", "Meat & seafood", etc.
  items: GroceryItem[];
}

export interface RecipeGroceryItems {
  recipeId: string;
  recipeName: string;
  scaledServingsDescription?: string; // e.g. "serves 4 → scaled to 10 burritos"
  items: GroceryItem[];
}

const SECTION_LABELS: Record<StoreSection, string> = {
  produce: "Produce",
  meat_seafood: "Meat & seafood",
  dairy_eggs: "Dairy & eggs",
  pantry: "Pantry",
  frozen: "Frozen",
  bakery: "Bakery & bread",
  other: "Other",
};

/**
 * Heuristically classify an ingredient into a store section
 */
function classifyIngredient(ingredient: string): StoreSection {
  const lower = ingredient.toLowerCase();

  // Produce keywords
  if (
    /tomato|pepper|onion|garlic|basil|lettuce|spinach|carrot|celery|potato|herb|vegetable|fruit|avocado|mushroom|olive|zucchini|cucumber/.test(
      lower
    )
  ) {
    return "produce";
  }

  // Meat & seafood
  if (
    /sausage|chicken|beef|pork|turkey|fish|salmon|shrimp|meat|thigh|breast|ground/.test(
      lower
    )
  ) {
    return "meat_seafood";
  }

  // Dairy & eggs
  if (
    /egg|milk|cream|cheese|parmesan|mozzarella|butter|yogurt|sour cream/.test(
      lower
    )
  ) {
    return "dairy_eggs";
  }

  // Pantry
  if (
    /flour|sugar|oil|stock|broth|rice|pasta|spice|salt|pepper|vinegar|sauce|tortilla|arborio/.test(
      lower
    )
  ) {
    return "pantry";
  }

  // Frozen
  if (/frozen/.test(lower)) {
    return "frozen";
  }

  // Bakery
  if (/crust|bread|roll|bagel/.test(lower)) {
    return "bakery";
  }

  return "other";
}

/**
 * Normalize ingredient name for merging (handle singular/plural)
 */
function normalizeIngredientName(name: string): string {
  const lower = name.toLowerCase().trim();
  
  // Simple pluralization rules (basic cases)
  const pluralRules: [RegExp, string][] = [
    [/ies$/, "y"],      // "onions" -> "onion"
    [/s$/, ""],         // "peppers" -> "pepper"
    [/es$/, ""],        // "potatoes" -> "potato"
  ];
  
  for (const [pattern, replacement] of pluralRules) {
    if (pattern.test(lower)) {
      return lower.replace(pattern, replacement);
    }
  }
  
  return lower;
}

/**
 * Extract quantity and name from an ingredient string
 * Improved parsing with better unit handling
 */
function parseIngredient(ingredient: string): { quantity?: string; name: string } {
  const parts = ingredient.trim().split(/\s+/);
  
  if (parts.length <= 1) {
    return { name: ingredient };
  }

  // Check if first part looks like a quantity
  const firstPart = parts[0];
  const isQuantity = /^\d+|\d+\/\d+|\d+\.\d+/.test(firstPart);

  if (isQuantity && parts.length > 1) {
    // Check if second part is a unit
    const secondPart = parts[1];
    const isUnit = /^(lbs?|oz|cup|cups|tbsp|tsp|tablespoon|teaspoon|pound|pounds|ounce|ounces|gram|grams|kg|kilogram|kilograms)$/i.test(secondPart);
    
    if (isUnit && parts.length >= 3) {
      return {
        quantity: `${parts[0]} ${parts[1]}`,
        name: parts.slice(2).join(" "),
      };
    }
    return {
      quantity: parts[0],
      name: parts.slice(1).join(" "),
    };
  }

  return { name: ingredient };
}

/**
 * Build grocery list for an event
 */
export function buildGroceryListForEvent(
  event: SavedEvent | EventWithRecipes | null,
  allRecipes: SavedRecipe[]
): {
  event: SavedEvent | EventWithRecipes | null;
  recipes: SavedRecipe[];
  itemsBySection: GrocerySection[];
  itemsByRecipe: RecipeGroceryItems[];
} {
  if (!event) {
    return {
      event: null,
      recipes: [],
      itemsBySection: [],
      itemsByRecipe: [],
    };
  }

  // Get recipes for this event
  let eventRecipes: SavedRecipe[] = [];
  if ("recipes" in event && Array.isArray(event.recipes)) {
    // EventWithRecipes - get full recipe data
    const recipeIds = event.recipes.map((er) => er.recipe_id);
    eventRecipes = allRecipes.filter((r) => recipeIds.includes(r.id));
  } else {
    // Fallback: if we only have event, we can't build grocery list
    return {
      event,
      recipes: [],
      itemsBySection: [],
      itemsByRecipe: [],
    };
  }

  // Build items by recipe
  const itemsByRecipe: RecipeGroceryItems[] = eventRecipes.map((recipe) => {
    // Extract ingredients from normalized recipe data
    const normalized = recipe.normalized as { ingredients?: Array<{ name: string; quantity?: number; unit?: string }> } | null;
    const ingredients: string[] = [];
    
    if (normalized?.ingredients) {
      ingredients.push(...normalized.ingredients.map((ing) => {
        const parts: string[] = [];
        if (ing.quantity) parts.push(String(ing.quantity));
        if (ing.unit) parts.push(ing.unit);
        parts.push(ing.name);
        return parts.join(" ");
      }));
    }
    
    const items: GroceryItem[] = ingredients.map((ingredient, idx) => {
      const { quantity, name } = parseIngredient(ingredient);
      const section = classifyIngredient(ingredient);

      return {
        id: `${event.id}_${recipe.id}_${idx}`,
        name,
        quantity,
        section,
        recipeNames: [recipe.title],
      };
    });

    // Get target headcount from event if available
    let targetHeadcount: number | undefined;
    if ("recipes" in event && Array.isArray(event.recipes)) {
      const eventRecipe = event.recipes.find((er) => er.recipe_id === recipe.id);
      targetHeadcount = eventRecipe?.target_headcount;
    }

    return {
      recipeId: recipe.id,
      recipeName: recipe.title,
      scaledServingsDescription: targetHeadcount 
        ? `Serves ${recipe.base_headcount} → scaled to ${targetHeadcount}`
        : `Serves ${recipe.base_headcount}`,
      items,
    };
  });

  // Build items by section (merge duplicates)
  const itemsMap = new Map<string, GroceryItem>();

  eventRecipes.forEach((recipe) => {
    // Extract ingredients from normalized recipe data
    const normalized = recipe.normalized as { ingredients?: Array<{ name: string; quantity?: number; unit?: string }> } | null;
    const ingredients: string[] = [];
    
    if (normalized?.ingredients) {
      ingredients.push(...normalized.ingredients.map((ing) => {
        const parts: string[] = [];
        if (ing.quantity) parts.push(String(ing.quantity));
        if (ing.unit) parts.push(ing.unit);
        parts.push(ing.name);
        return parts.join(" ");
      }));
    }
    
    ingredients.forEach((ingredient, idx) => {
      const { quantity, name } = parseIngredient(ingredient);
      const section = classifyIngredient(ingredient);
      // Normalize name for merging (singular/plural)
      const normalizedName = normalizeIngredientName(name);
      const key = `${section}_${normalizedName}`;

      if (itemsMap.has(key)) {
        // Merge: add recipe name to existing item
        const existing = itemsMap.get(key)!;
        if (!existing.recipeNames.includes(recipe.title)) {
          existing.recipeNames.push(recipe.title);
        }
      } else {
        itemsMap.set(key, {
          id: `${event.id}_${recipe.id}_${idx}`,
          name,
          quantity,
          section,
          recipeNames: [recipe.title],
        });
      }
    });
  });

  // Group by section
  const sectionsMap = new Map<StoreSection, GroceryItem[]>();

  itemsMap.forEach((item) => {
    if (!sectionsMap.has(item.section)) {
      sectionsMap.set(item.section, []);
    }
    sectionsMap.get(item.section)!.push(item);
  });

  // Convert to array format
  const itemsBySection: GrocerySection[] = Array.from(sectionsMap.entries())
    .map(([section, items]) => ({
      section,
      label: SECTION_LABELS[section],
      items: items.sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return {
    event,
    recipes: eventRecipes,
    itemsBySection,
    itemsByRecipe,
  };
}

