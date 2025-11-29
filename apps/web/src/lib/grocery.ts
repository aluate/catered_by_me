// apps/web/src/lib/grocery.ts

import type { Recipe, Event } from "./mockData";

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
 * Extract quantity and name from an ingredient string
 */
function parseIngredient(ingredient: string): { quantity?: string; name: string } {
  // Simple heuristic: first 1-3 tokens might be quantity, rest is name
  const parts = ingredient.trim().split(/\s+/);
  
  if (parts.length <= 1) {
    return { name: ingredient };
  }

  // Check if first part looks like a quantity (number, fraction, or unit)
  const firstPart = parts[0];
  const isQuantity = /^\d+|\d+\/\d+|\d+\.\d+|lbs?|oz|cup|cups|tbsp|tsp|tablespoon|teaspoon/.test(firstPart);

  if (isQuantity && parts.length > 1) {
    // First 1-2 parts might be quantity
    if (parts.length >= 3 && /^lbs?|oz|cup|cups|tbsp|tsp/.test(parts[1])) {
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
  eventId: string,
  events: Event[],
  recipes: Recipe[],
  options?: { mode?: "event_only" | "week_scope" }
): {
  event: Event | null;
  recipes: Recipe[];
  itemsBySection: GrocerySection[];
  itemsByRecipe: RecipeGroceryItems[];
} {
  const event = events.find((e) => e.id === eventId) || null;

  if (!event) {
    return {
      event: null,
      recipes: [],
      itemsBySection: [],
      itemsByRecipe: [],
    };
  }

  // Get recipes for this event
  const eventRecipes = recipes.filter((r) => event.recipeIds.includes(r.id));

  // Build items by recipe
  const itemsByRecipe: RecipeGroceryItems[] = eventRecipes.map((recipe) => {
    const items: GroceryItem[] = recipe.ingredients.map((ingredient, idx) => {
      const { quantity, name } = parseIngredient(ingredient);
      const section = classifyIngredient(ingredient);

      return {
        id: `${eventId}_${recipe.id}_${idx}`,
        name,
        quantity,
        section,
        recipeNames: [recipe.name],
      };
    });

    return {
      recipeId: recipe.id,
      recipeName: recipe.name,
      scaledServingsDescription: `Serves ${recipe.baseServings}`,
      items,
    };
  });

  // Build items by section (merge duplicates)
  const itemsMap = new Map<string, GroceryItem>();

  eventRecipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient, idx) => {
      const { quantity, name } = parseIngredient(ingredient);
      const section = classifyIngredient(ingredient);
      const key = `${section}_${name.toLowerCase()}`;

      if (itemsMap.has(key)) {
        // Merge: add recipe name to existing item
        const existing = itemsMap.get(key)!;
        if (!existing.recipeNames.includes(recipe.name)) {
          existing.recipeNames.push(recipe.name);
        }
      } else {
        itemsMap.set(key, {
          id: `${eventId}_${recipe.id}_${idx}`,
          name,
          quantity,
          section,
          recipeNames: [recipe.name],
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

