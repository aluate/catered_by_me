"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../../../components/auth/AuthProvider";
import { getRecipe, updateRecipe, deleteRecipe, type SavedRecipe } from "../../../../lib/api";
import RecipeForm, { type RecipeFormData } from "../../../../components/recipes/RecipeForm";
import Button from "../../../../components/ui/Button";

export default function RecipeDetailPage() {
  const { session, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const recipeId = params.id as string;

  const [recipe, setRecipe] = useState<SavedRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!session) {
      window.location.href = "/auth/sign-in";
      return;
    }

    loadRecipe();
  }, [session, authLoading, recipeId]);

  const loadRecipe = async () => {
    if (!session) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getRecipe(recipeId, session);
      setRecipe(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load recipe");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: RecipeFormData) => {
    if (!session || !recipe) return;

    setIsSubmitting(true);
    try {
      const updated = await updateRecipe(
        recipeId,
        {
          title: data.title,
          category: data.category,
          base_headcount: data.base_headcount,
          prep_time_minutes: data.prep_time_minutes,
          cook_time_minutes: data.cook_time_minutes,
          method: data.method,
          day_before_ok: data.day_before_ok,
          notes: data.notes || undefined,
        },
        session
      );
      setRecipe(updated);
      // Show success message or redirect
      router.push("/app/recipes");
    } catch (err) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!session || !recipe) return;

    if (!confirm(`Delete "${recipe.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteRecipe(recipeId, session);
      router.push("/app/recipes");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete recipe");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-body py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
            <p className="text-text-muted">Loading recipe...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-body py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error loading recipe</h2>
            <p className="text-red-700">{error || "Recipe not found"}</p>
            <div className="mt-4 flex gap-3">
              <Button variant="primary" onClick={loadRecipe}>
                Try again
              </Button>
              <Button variant="secondary" onClick={() => router.push("/app/recipes")}>
                Back to recipes
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-body py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink mb-2">Edit recipe</h1>
          <p className="text-text-muted">{recipe.title}</p>
        </div>

        <div className="bg-card rounded-xl p-8 shadow-sm border border-gray-200">
          <RecipeForm
            initialData={{
              title: recipe.title,
              category: recipe.category,
              base_headcount: recipe.base_headcount,
              prep_time_minutes: recipe.prep_time_minutes,
              cook_time_minutes: recipe.cook_time_minutes,
              method: recipe.method,
              day_before_ok: recipe.day_before_ok,
              notes: recipe.notes || undefined,
            }}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/app/recipes")}
            submitLabel="Save changes"
            isLoading={isSubmitting}
          />

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-ink mb-4">Danger zone</h2>
            <Button variant="tertiary" onClick={handleDelete} className="text-red-600 hover:text-red-700">
              Delete this recipe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

