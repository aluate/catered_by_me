/**
 * Recipe parsing logic ported from Python
 * Parses raw text recipes into structured Recipe objects
 */

export interface Ingredient {
  name: string;
  quantity: number | null;
  unit: string | null;
  notes: string | null;
  normalized_grams?: number | null;
}

export interface AtomicTask {
  id: string;
  label: string;
  duration_minutes: number;
  station: string;
  depends_on: string[];
  notes: string | null;
}

export interface Recipe {
  id: string;
  title: string;
  headcount: number;
  ingredients: Ingredient[];
  tasks: AtomicTask[];
  source: string | null;
}

/**
 * Parse a raw text recipe into a structured Recipe object
 */
export function parseTextRecipe(
  title: string | null | undefined,
  headcount: number,
  rawText: string
): Recipe {
  const recipeId = crypto.randomUUID();

  // Extract title if not provided
  let recipeTitle = title;
  if (!recipeTitle) {
    const lines = rawText.trim().split("\n");
    recipeTitle = lines[0]?.trim() || "Untitled Recipe";
    const firstLineLower = recipeTitle.toLowerCase();
    if (
      firstLineLower.startsWith("ingredients") ||
      firstLineLower.startsWith("directions") ||
      firstLineLower.startsWith("steps")
    ) {
      recipeTitle = "Untitled Recipe";
    }
  }

  // Split into ingredients and steps sections
  const textLower = rawText.toLowerCase();
  let ingredientsText = "";
  let stepsText = "";

  // Find ingredients section
  const ingredientsMatch = textLower.match(
    /(?:^|\n)\s*(?:ingredients?|ingredient list)\s*(?::|\n)/
  );

  // Find directions/steps section
  const directionsMatch = textLower.match(
    /(?:^|\n)\s*(?:directions?|steps?|instructions?|method)\s*(?::|\n)/
  );

  if (ingredientsMatch && directionsMatch) {
    const start = ingredientsMatch.index! + ingredientsMatch[0].length;
    const end = directionsMatch.index!;
    ingredientsText = rawText.substring(start, end);
    stepsText = rawText.substring(directionsMatch.index! + directionsMatch[0].length);
  } else if (ingredientsMatch) {
    ingredientsText = rawText.substring(
      ingredientsMatch.index! + ingredientsMatch[0].length
    );
  } else {
    // Fallback: assume first half is ingredients, second half is steps
    const lines = rawText.split("\n");
    const mid = Math.floor(lines.length / 2);
    ingredientsText = lines.slice(0, mid).join("\n");
    stepsText = lines.slice(mid).join("\n");
  }

  // Parse ingredients
  const ingredients: Ingredient[] = [];
  for (const line of ingredientsText.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const ingredient = parseIngredientLine(trimmed);
    if (ingredient) {
      ingredients.push(ingredient);
    }
  }

  // Parse steps into tasks
  const tasks: AtomicTask[] = [];
  for (const line of stepsText.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    // Skip numbered prefixes if present
    const withoutNumber = trimmed.replace(/^\d+[.)]\s*/, "");

    if (withoutNumber.length < 5) {
      // Skip very short lines
      continue;
    }

    const task = parseStepToTask(withoutNumber);
    if (task) {
      tasks.push(task);
    }
  }

  return {
    id: recipeId,
    title: recipeTitle,
    headcount,
    ingredients,
    tasks,
    source: "manual",
  };
}

function parseIngredientLine(line: string): Ingredient | null {
  // Pattern: quantity unit name (notes)
  // Examples: "2 cups flour", "1/2 tsp salt", "3 large eggs, beaten"

  const quantityPattern = /(\d+(?:\.\d+)?|(?:\d+\s+)?\d+\/\d+)/;
  const unitPattern = /(cup|cups|tbsp|tablespoon|tablespoons|tsp|teaspoon|teaspoons|oz|ounce|ounces|lb|pound|pounds|g|gram|grams|kg|kilogram|kilograms|ml|milliliter|milliliters|l|liter|liters|clove|cloves|piece|pieces|large|medium|small|whole|halves|slices|dashes?|pinches?)/i;

  const match = line.match(
    new RegExp(`^${quantityPattern.source}\\s+${unitPattern.source}\\s+(.+)$`, "i")
  );

  if (match) {
    const [, qtyStr, unit, rest] = match;
    const quantity = parseQuantity(qtyStr);
    const nameAndNotes = rest.trim();

    // Split name and notes (notes often after comma)
    if (nameAndNotes.includes(",")) {
      const [name, ...notesParts] = nameAndNotes.split(",");
      return {
        name: name.trim(),
        quantity,
        unit: unit.toLowerCase(),
        notes: notesParts.join(",").trim() || null,
      };
    } else {
      return {
        name: nameAndNotes,
        quantity,
        unit: unit.toLowerCase(),
        notes: null,
      };
    }
  }

  // Fallback: no quantity/unit, just name
  if (line.includes(",")) {
    const [name, ...notesParts] = line.split(",");
    return {
      name: name.trim(),
      quantity: null,
      unit: null,
      notes: notesParts.join(",").trim() || null,
    };
  }

  return {
    name: line,
    quantity: null,
    unit: null,
    notes: null,
  };
}

function parseQuantity(qtyStr: string): number {
  qtyStr = qtyStr.trim();

  // Handle fractions like "1/2" or "1 1/2"
  if (qtyStr.includes("/")) {
    const parts = qtyStr.split(/\s+/);
    if (parts.length === 1) {
      // Simple fraction "1/2"
      const [num, den] = qtyStr.split("/").map(Number);
      return num / den;
    } else {
      // Mixed number "1 1/2"
      const whole = Number(parts[0]);
      const [num, den] = parts[1].split("/").map(Number);
      return whole + num / den;
    }
  }

  return Number(qtyStr);
}

function parseStepToTask(stepText: string): AtomicTask | null {
  const taskId = crypto.randomUUID();

  // Determine station based on keywords
  const stepLower = stepText.toLowerCase();
  let station = "prep"; // default

  if (["bake", "roast", "broil"].some((word) => stepLower.includes(word))) {
    station = "oven";
  } else if (
    [
      "sauté",
      "sauté",
      "simmer",
      "boil",
      "fry",
      "cook",
      "heat",
      "stir",
      "reduce",
    ].some((word) => stepLower.includes(word))
  ) {
    station = "stove";
  } else if (
    [
      "chop",
      "dice",
      "slice",
      "cut",
      "mince",
      "grate",
      "peel",
      "mix",
      "combine",
      "whisk",
      "beat",
    ].some((word) => stepLower.includes(word))
  ) {
    station = "prep";
  } else if (
    ["rest", "chill", "marinate", "soak", "let stand"].some((word) =>
      stepLower.includes(word)
    )
  ) {
    station = "passive";
  } else {
    station = "counter"; // for assembly, plating, etc.
  }

  // Estimate duration (simple heuristic)
  let duration = 5; // default

  // Look for time mentions
  const timePatterns: Array<[RegExp, (match: RegExpMatchArray) => number]> = [
    [/(\d+)\s*(?:min|minute|minutes)/i, (m) => Number(m[1])],
    [/(\d+)\s*(?:hr|hour|hours)/i, (m) => Number(m[1]) * 60],
    [/(\d+)\s*(?:sec|second|seconds)/i, (m) => Math.max(1, Math.floor(Number(m[1]) / 60))],
  ];

  for (const [pattern, converter] of timePatterns) {
    const match = stepLower.match(pattern);
    if (match) {
      duration = converter(match);
      break;
    }
  }

  // Adjust based on station complexity
  if (station === "oven" && duration < 10) {
    duration = 15; // oven tasks usually take longer
  } else if (station === "stove" && duration < 5) {
    duration = 8;
  } else if (station === "prep" && duration < 3) {
    duration = 5;
  }

  return {
    id: taskId,
    label: stepText,
    duration_minutes: duration,
    station,
    depends_on: [],
    notes: null,
  };
}

