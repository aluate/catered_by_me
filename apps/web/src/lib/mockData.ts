// apps/web/src/lib/mockData.ts

export type RecipeCategory =
  | "meal_prep"
  | "starter"
  | "main"
  | "dessert"
  | "family";

export type EventType = "prep_week" | "event" | "family";

export type EventVibe = "normal" | "formal" | "family_chaos";

export type EventStatus =
  | "game_plan_ready"
  | "needs_recipes"
  | "timing_needs_tweak";

export interface Recipe {
  id: string;
  name: string;
  category: RecipeCategory;
  baseServings: number;
  tags: string[];
  summary: string;
  ingredients: string[];
  steps: string[];
  prepMinutes: number;
  cookMinutes: number;
  ovenUsage: "none" | "optional" | "required";
}

export interface Event {
  id: string;
  name: string;
  type: EventType;
  vibe: EventVibe;
  status: EventStatus;
  dateTime: string; // ISO string, e.g. "2025-12-03T18:30:00"
  headcount: number;
  recipeIds: string[];
  notes?: string;
}

export interface DashboardMock {
  nextEventId: string | null;
  weeklyPrepEventId: string | null;
  recentActivity: string[];
}

// --------------------
// Recipes
// --------------------

export const mockRecipes: Recipe[] = [
  {
    id: "rcp_breakfast_burritos",
    name: "Breakfast Burritos (Meal Prep)",
    category: "meal_prep",
    baseServings: 4,
    tags: ["Meal prep", "Weekday", "Freezer-friendly"],
    summary:
      "Sausage, eggs, peppers, onions, and cheese wrapped in tortillas for grab-and-go breakfasts.",
    ingredients: [
      "20 eggs",
      "2 lbs breakfast sausage",
      "3 cups shredded cheese",
      "2 bell peppers, diced",
      "1 large onion, diced",
      "10 large tortillas",
      "Salsa, for serving (optional)",
    ],
    steps: [
      "Brown the breakfast sausage in a large skillet. Drain excess fat.",
      "Sauté diced peppers and onions until softened.",
      "Scramble the eggs in a separate pan until just set.",
      "Combine sausage, vegetables, eggs, and shredded cheese in a large bowl.",
      "Lay out tortillas, spoon filling into each, and roll into burritos.",
      "Wrap individually in foil or parchment and refrigerate or freeze.",
    ],
    prepMinutes: 45,
    cookMinutes: 15,
    ovenUsage: "none",
  },
  {
    id: "rcp_roasted_tomato_soup",
    name: "Roasted Tomato Basil Soup",
    category: "starter",
    baseServings: 6,
    tags: ["Starter", "Dinner party", "Oven-heavy"],
    summary:
      "Slow-roasted tomatoes, garlic, and onions blended with stock and cream, finished with fresh basil.",
    ingredients: [
      "3 lbs ripe tomatoes, halved",
      "1 large onion, quartered",
      "6 cloves garlic",
      "3 tbsp olive oil",
      "4 cups chicken or vegetable stock",
      "1/2 cup heavy cream",
      "Fresh basil",
      "Salt and pepper",
    ],
    steps: [
      "Toss tomatoes, onion, and garlic with olive oil, salt, and pepper.",
      "Roast at 400°F (200°C) until soft and caramelized.",
      "Transfer roasted vegetables to a pot with stock and simmer briefly.",
      "Blend until smooth, then stir in cream.",
      "Finish with chopped fresh basil before serving.",
    ],
    prepMinutes: 20,
    cookMinutes: 60,
    ovenUsage: "required",
  },
  {
    id: "rcp_lemon_herb_chicken_risotto",
    name: "Lemon Herb Chicken with Parmesan Risotto",
    category: "main",
    baseServings: 6,
    tags: ["Main course", "Dinner party", "Crowd pleaser"],
    summary:
      "Seared lemon herb chicken served alongside creamy parmesan risotto.",
    ingredients: [
      "6 bone-in or boneless chicken thighs",
      "2 lemons (zest and juice)",
      "2 tbsp fresh herbs (thyme, rosemary, parsley)",
      "3 tbsp olive oil",
      "2 cups arborio rice",
      "6 cups chicken stock",
      "1 cup grated parmesan",
      "1 small onion, finely diced",
      "2 tbsp butter",
    ],
    steps: [
      "Marinate chicken with lemon zest, juice, herbs, olive oil, salt, and pepper.",
      "Sear chicken in a hot pan, then finish in the oven if desired until cooked through.",
      "For risotto, sauté diced onion in butter until translucent.",
      "Add arborio rice and toast briefly.",
      "Add warm stock a ladle at a time, stirring frequently, until rice is creamy and al dente.",
      "Stir in grated parmesan and adjust seasoning.",
      "Serve chicken over or alongside the risotto.",
    ],
    prepMinutes: 25,
    cookMinutes: 45,
    ovenUsage: "optional",
  },
  {
    id: "rcp_chocolate_lava_cakes",
    name: "Chocolate Lava Cakes",
    category: "dessert",
    baseServings: 6,
    tags: ["Dessert", "Oven-heavy", "Timing-critical"],
    summary:
      "Individual chocolate cakes with gooey centers, baked just until set at the edges.",
    ingredients: [
      "8 oz dark chocolate",
      "1/2 cup butter",
      "3 eggs",
      "3 egg yolks",
      "1/2 cup sugar",
      "1/3 cup flour",
      "Butter and cocoa powder for ramekins",
    ],
    steps: [
      "Butter and dust ramekins with cocoa powder.",
      "Melt chocolate and butter together until smooth.",
      "Whisk eggs, yolks, and sugar until pale.",
      "Fold chocolate mixture into eggs, then fold in flour.",
      "Divide batter among ramekins.",
      "Bake at 425°F (220°C) for 10–12 minutes until edges are set and centers are soft.",
      "Invert onto plates and serve immediately.",
    ],
    prepMinutes: 20,
    cookMinutes: 12,
    ovenUsage: "required",
  },
  {
    id: "rcp_build_your_own_pizza",
    name: "Build-Your-Own Pizza Night",
    category: "family",
    baseServings: 4,
    tags: ["Kid-friendly", "Hands-on", "Fun"],
    summary:
      "Mini pizzas with pre-made crusts that kids can top themselves before a quick bake.",
    ingredients: [
      "4 mini pre-made pizza crusts",
      "1 cup pizza sauce",
      "2 cups shredded mozzarella",
      "Pepperoni slices",
      "Assorted veggies (bell pepper, mushrooms, olives)",
      "Olive oil",
      "Dried oregano",
    ],
    steps: [
      "Preheat oven according to crust package instructions.",
      "Set out crusts, sauce, cheese, and toppings in bowls.",
      "Let kids assemble their own pizzas with sauce, cheese, and toppings.",
      "Drizzle with a little olive oil and sprinkle with oregano.",
      "Bake until cheese is melted and crust is crisp.",
      "Cool slightly, slice, and serve.",
    ],
    prepMinutes: 20,
    cookMinutes: 12,
    ovenUsage: "required",
  },
];

// --------------------
// Events
// --------------------

export const mockEvents: Event[] = [
  {
    id: "evt_weekday_breakfast",
    name: "Weekday Breakfast Prep",
    type: "prep_week",
    vibe: "normal",
    status: "game_plan_ready",
    dateTime: "2025-12-01T19:00:00", // Monday 7:00 PM example
    headcount: 2,
    recipeIds: ["rcp_breakfast_burritos"],
    notes:
      "Goal: quick grab-and-go breakfasts for Hannah and her husband for all 5 weekdays.",
  },
  {
    id: "evt_girls_night",
    name: "Girls' Night Dinner Party",
    type: "event",
    vibe: "formal",
    status: "timing_needs_tweak",
    dateTime: "2025-12-03T18:30:00", // Wednesday 6:30 PM
    headcount: 6,
    recipeIds: [
      "rcp_roasted_tomato_soup",
      "rcp_lemon_herb_chicken_risotto",
      "rcp_chocolate_lava_cakes",
    ],
    notes:
      "Three-course meal for six friends. Oven and stove timing is tight; lava cakes need precise timing.",
  },
  {
    id: "evt_family_pizza_night",
    name: "Friday Family Pizza Night",
    type: "family",
    vibe: "family_chaos",
    status: "game_plan_ready",
    dateTime: "2025-12-05T17:30:00", // Friday 5:30 PM
    headcount: 4,
    recipeIds: ["rcp_build_your_own_pizza"],
    notes:
      "Kids help assemble their own pizzas. Keep it fun and easy with minimal cleanup.",
  },
];

// --------------------
// Dashboard wiring
// --------------------

export const mockDashboard: DashboardMock = {
  nextEventId: "evt_girls_night",
  weeklyPrepEventId: "evt_weekday_breakfast",
  recentActivity: [
    'You added "Lemon Herb Chicken with Parmesan Risotto" 2 days ago.',
    'You updated "Girls\' Night Dinner Party" to 6 guests.',
    'You planned "Friday Family Pizza Night" for this week.',
  ],
};

