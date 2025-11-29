"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../components/auth/AuthProvider";
import { listRecipes, deleteRecipe, type SavedRecipe } from "../../../lib/api";
import RecipeCard from "../../../components/recipes/RecipeCard";
import Button from "../../../components/ui/Button";

export default function RecipesPage() {
  const { session, loading: authLoading } = useAuth();
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!session) {
      // Redirect to sign in if not authenticated
      window.location.href = "/auth/sign-in";
      return;
    }

    loadRecipes();
  }, [session, authLoading]);

  const loadRecipes = async () => {
    if (!session) return;

    try {
      setLoading(true);
      setError(null);
      const data = await listRecipes(session);
      setRecipes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load recipes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recipeId: string) => {
    if (!session) return;

    try {
      await deleteRecipe(recipeId, session);
      setRecipes(recipes.filter((r) => r.id !== recipeId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete recipe");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-body py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
            <p className="text-text-muted">Loading your recipes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-body py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error loading recipes</h2>
            <p className="text-red-700">{error}</p>
            <Button variant="primary" onClick={loadRecipes} className="mt-4">
              Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-body py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-ink mb-2">My Recipes</h1>
            <p className="text-text-muted">
              This is where grandma&apos;s stuffing and your weeknight tacos come to live together.
            </p>
          </div>
          <Link href="/app/recipes/new">
            <Button variant="primary">Add recipe</Button>
          </Link>
        </div>

        {/* Recipe list */}
        {recipes.length === 0 ? (
          <div className="bg-card rounded-xl p-12 text-center border border-gray-200">
            <div className="text-4xl mb-4">📝</div>
            <h2 className="text-xl font-semibold text-ink mb-2">No recipes yet</h2>
            <p className="text-text-muted mb-6">
              Start building your recipe bank. Add your first recipe to get cooking.
            </p>
            <Link href="/app/recipes/new">
              <Button variant="primary">Add your first recipe</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

