"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../components/auth/AuthProvider";
import { useToast } from "../../../../components/ui/Toast";
import { createRecipe } from "../../../../lib/api";
import { getMessage } from "../../../../lib/messages";
import { apiErrorToMessage } from "../../../../lib/errors";
import RecipeForm, { type RecipeFormData } from "../../../../components/recipes/RecipeForm";
import Button from "../../../../components/ui/Button";

export default function NewRecipePage() {
  const { session, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!session) {
      window.location.href = "/auth/sign-in";
      return;
    }
  }, [session, authLoading]);

  const handleSubmit = async (data: RecipeFormData) => {
    if (!session) return;

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
      showToast(apiErrorToMessage(err), "error");
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

