"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../../components/auth/AuthProvider";
import { useToast } from "../../../../components/ui/Toast";
import {
  getEvent,
  updateEvent,
  deleteEvent,
  attachRecipeToEvent,
  detachRecipeFromEvent,
  generateEventPlan,
  createShareLink,
  listRecipes,
  type EventWithRecipes,
  type SavedRecipe,
} from "../../../../lib/api";
import { getMessage } from "../../../../lib/messages";
import { apiErrorToMessage } from "../../../../lib/errors";
import { isDemoMode } from "../../../../lib/demo";
import DemoSuccess from "../../../../components/DemoSuccess";
import EventForm, { type EventFormData } from "../../../../components/events/EventForm";
import Button from "../../../../components/ui/Button";
import ScheduleView from "../../../../components/ScheduleView";
import type { Schedule } from "../../../../lib/api";

export default function EventDetailPage() {
  const { session, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<EventWithRecipes | null>(null);
  const [availableRecipes, setAvailableRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [showRecipePicker, setShowRecipePicker] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>("");
  const [recipeHeadcount, setRecipeHeadcount] = useState<number>(4);
  const [showShareSuccess, setShowShareSuccess] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!session) {
      window.location.href = "/auth/sign-in";
      return;
    }

    loadEvent();
    loadRecipes();
  }, [session, authLoading, eventId]);

  const loadEvent = async () => {
    if (!session) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getEvent(eventId, session);
      setEvent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  const loadRecipes = async () => {
    if (!session) return;

    try {
      const recipes = await listRecipes(session);
      setAvailableRecipes(recipes);
    } catch (err) {
      console.error("Failed to load recipes:", err);
    }
  };

  const handleSubmit = async (data: EventFormData) => {
    if (!session || !event) return;

    setIsSubmitting(true);
    try {
      const updated = await updateEvent(
        eventId,
        {
          name: data.name,
          event_type: data.event_type,
          event_date: data.event_date || undefined,
          headcount: data.headcount || undefined,
          location: data.location || undefined,
          vibe: data.vibe || undefined,
          notes: data.notes || undefined,
        },
        session
      );
      setEvent({ ...updated, recipes: event.recipes });
      setIsEditing(false);
    } catch (err) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!session || !event) return;

    if (!confirm(`Delete "${event.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteEvent(eventId, session);
      router.push("/app/events");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete event");
    }
  };

  const handleAttachRecipe = async () => {
    if (!session || !event || !selectedRecipeId) return;

    try {
      await attachRecipeToEvent(
        eventId,
        {
          recipe_id: selectedRecipeId,
          target_headcount: recipeHeadcount,
        },
        session
      );
      await loadEvent();
      setShowRecipePicker(false);
      setSelectedRecipeId("");
      setRecipeHeadcount(4);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to attach recipe");
    }
  };

  const handleDetachRecipe = async (recipeId: string) => {
    if (!session || !event) return;

    try {
      await detachRecipeFromEvent(eventId, recipeId, session);
      await loadEvent();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to remove recipe");
    }
  };

  const handleGeneratePlan = async () => {
    if (!session || !event) return;

    try {
      const plan = await generateEventPlan(eventId, undefined, session);
      setSchedule(plan);
      showToast(getMessage("schedule_generated"), "success");
    } catch (err) {
      showToast(apiErrorToMessage(err), "error");
    }
  };

  const handleShareEvent = async () => {
    if (!session || !event) return;

    if (isDemoMode()) {
      // Demo mode: show confetti and success
      const fakeUrl = `${window.location.origin}/share/e/demo-${Math.random().toString(36).slice(2)}`;
      navigator.clipboard.writeText(fakeUrl);
      showToast("🎉 Demo Mode: Share link copied! (This is what the upgrade flow will feel like!)", "success");
      setShowShareSuccess(true);
      return;
    }

    try {
      const { share_url } = await createShareLink(eventId, session);
      const fullUrl = `${window.location.origin}${share_url}`;
      navigator.clipboard.writeText(fullUrl);
      showToast("Share link copied to clipboard!", "success");
    } catch (err) {
      showToast(apiErrorToMessage(err), "error");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-body py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
            <p className="text-text-muted">Loading event...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-body py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error loading event</h2>
            <p className="text-red-700">{error || "Event not found"}</p>
            <div className="mt-4 flex gap-3">
              <Button variant="primary" onClick={loadEvent}>
                Try again
              </Button>
              <Button variant="secondary" onClick={() => router.push("/app/events")}>
                Back to events
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No date set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-body py-12">
      {showShareSuccess && (
        <DemoSuccess
          title="Look at you go!"
          message="Everything is unlocked for the demo. This is what your guests will see when we launch."
          onClose={() => setShowShareSuccess(false)}
        />
      )}
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          {!isEditing ? (
            <>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-ink mb-2">{event.name}</h1>
                  <p className="text-text-muted">{formatDate(event.event_date)}</p>
                  {event.headcount && <p className="text-text-muted">{event.headcount} guests</p>}
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                  <Link href={`/app/events/${eventId}/grocery`}>
                    <Button variant="secondary">Grocery list</Button>
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-ink mb-2">Edit event</h1>
            </div>
          )}
        </div>

        {/* Edit form or event details */}
        {isEditing ? (
          <div className="bg-card rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
            <EventForm
              initialData={{
                name: event.name,
                event_type: event.event_type,
                event_date: event.event_date,
                headcount: event.headcount,
                location: event.location,
                vibe: event.vibe,
                notes: event.notes,
              }}
              onSubmit={handleSubmit}
              onCancel={() => setIsEditing(false)}
              submitLabel="Save changes"
              isLoading={isSubmitting}
            />
          </div>
        ) : (
          <>
            {/* Attached recipes */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-ink">Recipes</h2>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={handleShareEvent}>
                    Share
                  </Button>
                  <Button variant="secondary" onClick={() => setShowRecipePicker(true)}>
                    Add recipe
                  </Button>
                </div>
              </div>

              {event.recipes.length === 0 ? (
                <p className="text-text-muted">
                  No recipes attached yet. Add recipes to generate your game plan.
                </p>
              ) : (
                <ul className="space-y-3">
                  {event.recipes.map((er) => (
                    <li
                      key={er.recipe_id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <span className="font-medium">{er.recipe_title}</span>
                        <span className="text-sm text-text-muted ml-2">
                          (serves {er.target_headcount})
                        </span>
                      </div>
                      <Button
                        variant="tertiary"
                        onClick={() => handleDetachRecipe(er.recipe_id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              )}

              {event.recipes.length > 0 && (
                <div className="mt-6">
                  <Button variant="primary" onClick={handleGeneratePlan} className="w-full">
                    Generate Game Plan
                  </Button>
                </div>
              )}
            </div>

            {/* Schedule view */}
            {schedule && (
              <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
                <ScheduleView schedule={schedule} recipe={null} />
              </div>
            )}
          </>
        )}

        {/* Recipe picker modal */}
        {showRecipePicker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-card rounded-xl p-6 shadow-lg max-w-md w-full mx-4">
              <h2 className="text-xl font-semibold text-ink mb-4">Add recipe to event</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Recipe</label>
                  <select
                    value={selectedRecipeId}
                    onChange={(e) => setSelectedRecipeId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary outline-none"
                  >
                    <option value="">Select a recipe...</option>
                    {availableRecipes.map((recipe) => (
                      <option key={recipe.id} value={recipe.id}>
                        {recipe.title} (serves {recipe.base_headcount})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    Headcount for this recipe
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={recipeHeadcount}
                    onChange={(e) => setRecipeHeadcount(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="primary"
                  onClick={handleAttachRecipe}
                  disabled={!selectedRecipeId}
                  className="flex-1"
                >
                  Add
                </Button>
                <Button variant="secondary" onClick={() => setShowRecipePicker(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Danger zone */}
        {!isEditing && (
          <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-ink mb-4">Danger zone</h2>
            <Button variant="tertiary" onClick={handleDelete} className="text-red-600 hover:text-red-700">
              Delete this event
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

