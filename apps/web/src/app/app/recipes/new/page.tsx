"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../components/auth/AuthProvider";
import { useToast } from "../../../../components/ui/Toast";
import { createRecipe, listRecipes } from "../../../../lib/api";
import { getMessage } from "../../../../lib/messages";
import { apiErrorToMessage } from "../../../../lib/errors";
import { getUserLimits, checkLimit } from "../../../../lib/featureFlags";
import { isDemoMode } from "../../../../lib/demo";
import UpgradePrompt from "../../../../components/paywall/UpgradePrompt";
import RecipeForm, { type RecipeFormData } from "../../../../components/recipes/RecipeForm";

export default function NewRecipePage() {
  const { session, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [recipeCount, setRecipeCount] = React.useState<number | null>(null);
  const [showUpgrade, setShowUpgrade] = React.useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!session) {
      window.location.href = "/auth/sign-in";
      return;
    }

    // Check recipe count for free tier limit
    loadRecipeCount();
  }, [session, authLoading]);

  const loadRecipeCount = async () => {
    if (!session) return;
    try {
      const recipes = await listRecipes(session);
      setRecipeCount(recipes.length);
      const limits = getUserLimits("free"); // TODO: Get actual user tier from profile
      const check = checkLimit(recipes.length, limits.maxRecipes, "recipes");
      if (!check.withinLimit) {
        setShowUpgrade(true);
      }
    } catch (err) {
      console.error("Failed to load recipe count:", err);
    }
  };

  const handleSubmit = async (data: RecipeFormData) => {
    if (!session) return;

    // In demo mode, skip limit checks
    if (!isDemoMode()) {
      // Check limit before submitting
      const limits = getUserLimits("free"); // TODO: Get actual user tier
      if (recipeCount !== null && recipeCount >= limits.maxRecipes) {
        showToast("You've reached the free tier limit of 10 recipes. Upgrade to Pro for unlimited recipes.", "warning");
        setShowUpgrade(true);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await createRecipe(
        {
          title: data.title,
          category: data.category,
          base_headcount: data.base_headcount,
          prep_time_minutes: data.prep_time_minutes,
          cook_time_minutes: data.cook_time_minutes,
          method: data.method,
          day_before_ok: data.day_before_ok,
          source_type: "text",
          notes: data.notes || undefined,
        },
        session
      );
      showToast(getMessage("recipe_saved"), "success");
      router.push("/app/recipes");
    } catch (err) {
      const errorMsg = apiErrorToMessage(err);
      // Check if it's a limit error
      if (errorMsg.includes("limit") || errorMsg.includes("Limit")) {
        setShowUpgrade(true);
      }
      showToast(errorMsg, "error");
      throw err; // Let RecipeForm handle the error display
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-body py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
            <p className="text-text-muted">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-body py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink mb-2">Add a new recipe</h1>
          <p className="text-text-muted">
            Start with the basics. You can add ingredients and steps later, or paste a full recipe
            to auto-fill.
          </p>
        </div>

        {showUpgrade && recipeCount !== null && (
          <UpgradePrompt
            feature="recipes"
            currentCount={recipeCount}
            limit={getUserLimits("free").maxRecipes}
            onDismiss={() => setShowUpgrade(false)}
          />
        )}

        <div className="bg-card rounded-xl p-8 shadow-sm border border-gray-200">
          <RecipeForm
            onSubmit={handleSubmit}
            onCancel={() => router.push("/app/recipes")}
            submitLabel="Create recipe"
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}

