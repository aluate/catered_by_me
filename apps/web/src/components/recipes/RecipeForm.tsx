// apps/web/src/components/recipes/RecipeForm.tsx

"use client";

import React, { useState } from "react";
import Button from "../ui/Button";

export interface RecipeFormData {
  title: string;
  category: "main" | "side" | "dessert" | "app" | "other";
  base_headcount: number;
  prep_time_minutes: number;
  cook_time_minutes: number;
  method: "oven" | "stovetop" | "no_cook" | "mixed";
  day_before_ok: boolean;
  notes?: string;
}

interface RecipeFormProps {
  initialData?: Partial<RecipeFormData>;
  onSubmit: (data: RecipeFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  isLoading?: boolean;
}

export default function RecipeForm({
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = "Save recipe",
  isLoading = false,
}: RecipeFormProps) {
  const [formData, setFormData] = useState<RecipeFormData>({
    title: initialData.title || "",
    category: initialData.category || "main",
    base_headcount: initialData.base_headcount || 4,
    prep_time_minutes: initialData.prep_time_minutes || 0,
    cook_time_minutes: initialData.cook_time_minutes || 0,
    method: initialData.method || "mixed",
    day_before_ok: initialData.day_before_ok || false,
    notes: initialData.notes || "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError("Recipe title is required");
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save recipe");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-ink mb-2">
          Recipe name *
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary outline-none"
          placeholder="e.g., Roasted Chicken with Vegetables"
        />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-ink mb-2">
          Category *
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) =>
            setFormData({
              ...formData,
              category: e.target.value as RecipeFormData["category"],
            })
          }
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary outline-none"
        >
          <option value="main">Main course</option>
          <option value="side">Side dish</option>
          <option value="dessert">Dessert</option>
          <option value="app">Appetizer</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Base headcount */}
      <div>
        <label htmlFor="base_headcount" className="block text-sm font-medium text-ink mb-2">
          Serves how many? *
        </label>
        <input
          id="base_headcount"
          type="number"
          min="1"
          value={formData.base_headcount}
          onChange={(e) =>
            setFormData({ ...formData, base_headcount: parseInt(e.target.value) || 1 })
          }
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary outline-none"
        />
        <p className="text-xs text-text-muted mt-1">
          This is the default serving size. We&apos;ll scale it up or down when you plan events.
        </p>
      </div>

      {/* Times */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="prep_time_minutes" className="block text-sm font-medium text-ink mb-2">
            Prep time (minutes)
          </label>
          <input
            id="prep_time_minutes"
            type="number"
            min="0"
            value={formData.prep_time_minutes}
            onChange={(e) =>
              setFormData({ ...formData, prep_time_minutes: parseInt(e.target.value) || 0 })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary outline-none"
          />
        </div>
        <div>
          <label htmlFor="cook_time_minutes" className="block text-sm font-medium text-ink mb-2">
            Cook time (minutes)
          </label>
          <input
            id="cook_time_minutes"
            type="number"
            min="0"
            value={formData.cook_time_minutes}
            onChange={(e) =>
              setFormData({ ...formData, cook_time_minutes: parseInt(e.target.value) || 0 })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary outline-none"
          />
        </div>
      </div>

      {/* Method */}
      <div>
        <label htmlFor="method" className="block text-sm font-medium text-ink mb-2">
          Cooking method *
        </label>
        <select
          id="method"
          value={formData.method}
          onChange={(e) =>
            setFormData({
              ...formData,
              method: e.target.value as RecipeFormData["method"],
            })
          }
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary outline-none"
        >
          <option value="oven">Oven</option>
          <option value="stovetop">Stovetop</option>
          <option value="no_cook">No cook</option>
          <option value="mixed">Mixed (oven + stovetop)</option>
        </select>
      </div>

      {/* Day before OK */}
      <div className="flex items-center gap-2">
        <input
          id="day_before_ok"
          type="checkbox"
          checked={formData.day_before_ok}
          onChange={(e) => setFormData({ ...formData, day_before_ok: e.target.checked })}
          className="w-5 h-5 rounded border-gray-300 text-accent-primary focus:ring-accent-primary"
        />
        <label htmlFor="day_before_ok" className="text-sm text-ink">
          Can be made the day before
        </label>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-ink mb-2">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          value={formData.notes || ""}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary outline-none"
          placeholder="Any special instructions, substitutions, or tips..."
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" variant="primary" disabled={isLoading} className="flex-1">
          {isLoading ? "Saving..." : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

