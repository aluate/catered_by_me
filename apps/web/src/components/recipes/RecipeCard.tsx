// apps/web/src/components/recipes/RecipeCard.tsx

import React from "react";
import Link from "next/link";
import Button from "../ui/Button";

export interface RecipeCardData {
  id: string;
  title: string;
  category: "main" | "side" | "dessert" | "app" | "other";
  base_headcount: number;
  prep_time_minutes: number;
  cook_time_minutes: number;
  method: "oven" | "stovetop" | "no_cook" | "mixed";
  created_at: string;
}

interface RecipeCardProps {
  recipe: RecipeCardData;
  onDelete?: (id: string) => void;
}

const categoryLabels: Record<RecipeCardData["category"], string> = {
  main: "Main",
  side: "Side",
  dessert: "Dessert",
  app: "Appetizer",
  other: "Other",
};

const methodLabels: Record<RecipeCardData["method"], string> = {
  oven: "Oven",
  stovetop: "Stovetop",
  no_cook: "No cook",
  mixed: "Mixed",
};

export default function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
  const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-ink mb-1">{recipe.title}</h3>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 bg-accent-primary-soft text-accent-primary rounded-full font-medium">
              {categoryLabels[recipe.category]}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-text-muted rounded-full">
              {methodLabels[recipe.method]}
            </span>
            {totalTime > 0 && (
              <span className="px-2 py-1 bg-gray-100 text-text-muted rounded-full">
                {totalTime} min
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="text-sm text-text-muted mb-4">
        <p>
          Serves {recipe.base_headcount} • Prep: {recipe.prep_time_minutes} min • Cook: {recipe.cook_time_minutes} min
        </p>
      </div>

      <div className="flex gap-2">
        <Link href={`/app/recipes/${recipe.id}`} className="flex-1">
          <Button variant="primary" className="w-full">
            Open
          </Button>
        </Link>
        {onDelete && (
          <Button
            variant="tertiary"
            onClick={() => {
              if (confirm(`Delete "${recipe.title}"?`)) {
                onDelete(recipe.id);
              }
            }}
            className="text-red-600 hover:text-red-700"
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}

