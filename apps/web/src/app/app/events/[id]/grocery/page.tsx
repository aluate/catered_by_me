"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuthOptional } from "../../../../../components/auth/AuthProvider";
import { useToast } from "../../../../../components/ui/Toast";
import { getEvent, type EventWithRecipes } from "../../../../../lib/api";
import { listRecipes, type SavedRecipe } from "../../../../../lib/api";
import { buildGroceryListForEvent } from "../../../../../lib/grocery";
import { getMessage } from "../../../../../lib/messages";
import Button from "../../../../../components/ui/Button";
import Link from "next/link";
import UpgradePrompt from "../../../../../components/paywall/UpgradePrompt";

export default function GroceryPage() {
  const params = useParams();
  const eventId = params.id as string;
  const { session, loading: authLoading } = useAuthOptional();
  const { showToast } = useToast();
  
  const [event, setEvent] = useState<EventWithRecipes | null>(null);
  const [allRecipes, setAllRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"section" | "recipe">("section");
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  
  const limits = getUserLimits("free"); // TODO: Get actual user tier from profile

  useEffect(() => {
    if (authLoading) return;

    if (!session) {
      window.location.href = "/auth/sign-in";
      return;
    }

    loadData();
  }, [session, authLoading, eventId]);

  useEffect(() => {
    // Load checked items from localStorage
    if (eventId) {
      const saved = localStorage.getItem(`grocery_checked_${eventId}`);
      if (saved) {
        try {
          setCheckedItems(new Set(JSON.parse(saved)));
        } catch {
          // Ignore parse errors
        }
      }
    }
  }, [eventId]);

  const loadData = async () => {
    if (!session) return;

    try {
      setLoading(true);
      const [eventData, recipesData] = await Promise.all([
        getEvent(eventId, session),
        listRecipes(session),
      ]);
      setEvent(eventData);
      setAllRecipes(recipesData);
    } catch (err) {
      console.error("Failed to load grocery data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCheck = (itemId: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId);
    } else {
      newChecked.add(itemId);
    }
    setCheckedItems(newChecked);
    
    // Save to localStorage
    if (eventId) {
      localStorage.setItem(`grocery_checked_${eventId}`, JSON.stringify(Array.from(newChecked)));
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-body py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
            <p className="text-text-muted">Loading grocery list...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-body py-12">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-text-muted">Event not found.</p>
        </div>
      </div>
    );
  }

  const { recipes, itemsBySection, itemsByRecipe } = buildGroceryListForEvent(event, allRecipes);
  const recipeNames = recipes.map((r) => r.title).join(", ");

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No date set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const copyList = () => {
    let text = `Grocery list – ${event.name}${event.headcount ? ` (${event.headcount} guests)` : ""}\n\n`;

    if (viewMode === "section") {
      itemsBySection.forEach((section) => {
        text += `${section.label.toUpperCase()}\n\n`;
        section.items.forEach((item) => {
          const checked = checkedItems.has(item.id) ? "✓ " : "- ";
          const qty = item.quantity ? `${item.quantity} ` : "";
          text += `${checked}${qty}${item.name}`;
          if (item.recipeNames.length > 0) {
            text += ` (${item.recipeNames.join(", ")})`;
          }
          text += "\n";
        });
        text += "\n";
      });
    } else {
      itemsByRecipe.forEach((recipeGroup) => {
        text += `${recipeGroup.recipeName}\n`;
        recipeGroup.items.forEach((item) => {
          const checked = checkedItems.has(item.id) ? "✓ " : "- ";
          const qty = item.quantity ? `${item.quantity} ` : "";
          text += `${checked}${qty}${item.name}\n`;
        });
        text += "\n";
      });
    }

    navigator.clipboard.writeText(text);
    showToast(getMessage("grocery_copied"), "success");
  };

  return (
    <div className="min-h-screen bg-body py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink mb-2">Grocery list</h1>
          <p className="text-lg text-text-muted mb-1">
            {event.name} {event.headcount && `• ${event.headcount} guests`}
          </p>
          {event.event_date && (
            <p className="text-sm text-text-muted">{formatDate(event.event_date)}</p>
          )}
          <p className="text-sm text-text-muted">
            Includes: {recipeNames || "No recipes attached"}
          </p>
          <p className="text-xs text-text-muted mt-2">
            Scaled for your headcount and kitchen. Adjust as needed.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-sm text-text-muted">View:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("section")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === "section"
                  ? "bg-accent-primary text-white"
                  : "bg-card border border-gray-200 text-ink hover:bg-gray-50"
              }`}
            >
              By store section
            </button>
            <button
              onClick={() => setViewMode("recipe")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === "recipe"
                  ? "bg-accent-primary text-white"
                  : "bg-card border border-gray-200 text-ink hover:bg-gray-50"
              }`}
            >
              By recipe
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <Button variant="secondary" onClick={copyList}>
            Copy list
          </Button>
          {(limits.canExportPDF || isDemoMode()) ? (
            <Link href={`/app/events/${eventId}/grocery/print`}>
              <Button variant="secondary">Print / Save PDF</Button>
            </Link>
          ) : (
            <div className="flex items-center">
              <Link href={`/app/events/${eventId}/grocery/print`}>
                <Button variant="secondary" disabled>
                  Print / Save PDF
                </Button>
              </Link>
              <span className="ml-2 text-xs text-text-muted">(Pro feature)</span>
            </div>
          )}
        </div>
        
        {!limits.canExportPDF && !isDemoMode() && (
          <UpgradePrompt
            feature="PDF export"
            onDismiss={() => {}}
          />
        )}
        
        {isDemoMode() && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
            <p className="text-xs text-amber-800">
              🎭 Demo Mode — This is a preview. All features unlocked.
            </p>
          </div>
        )}

        {/* Content */}
        {itemsBySection.length === 0 && itemsByRecipe.length === 0 ? (
          <div className="bg-card rounded-xl p-12 text-center border border-gray-200">
            <p className="text-text-muted">{getMessage("no_recipes_attached")}</p>
            <Link href={`/app/events/${eventId}`} className="mt-4 inline-block">
              <Button variant="primary">Add recipes</Button>
            </Link>
          </div>
        ) : viewMode === "section" ? (
          <div className="space-y-6">
            {itemsBySection.map((section) => (
              <div
                key={section.section}
                className="bg-card rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <h2 className="text-xl font-semibold text-ink mb-4">
                  {section.label}
                </h2>
                <p className="text-xs text-text-muted mb-4">
                  Cross things off as you shop. We&apos;ll keep the math, you keep
                  the cart moving.
                </p>
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li key={item.id} className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={checkedItems.has(item.id)}
                        onChange={() => handleToggleCheck(item.id)}
                        className="mt-1 w-5 h-5 rounded border-gray-300 text-accent-primary focus:ring-accent-primary"
                      />
                      <div className="flex-1">
                        <div className="text-base text-ink">
                          {item.quantity && (
                            <span className="font-medium">{item.quantity} </span>
                          )}
                          {item.name}
                        </div>
                        {item.recipeNames.length > 0 && (
                          <div className="text-xs text-text-muted mt-1">
                            From: {item.recipeNames.join(", ")}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {itemsByRecipe.map((recipeGroup) => (
              <div
                key={recipeGroup.recipeId}
                className="bg-card rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <h2 className="text-xl font-semibold text-ink mb-2">
                  {recipeGroup.recipeName}
                </h2>
                {recipeGroup.scaledServingsDescription && (
                  <p className="text-sm text-text-muted mb-4">
                    {recipeGroup.scaledServingsDescription}
                  </p>
                )}
                <p className="text-xs text-text-muted mb-4">
                  These amounts are already scaled to your headcount.
                </p>
                <ul className="space-y-3">
                  {recipeGroup.items.map((item) => (
                    <li key={item.id} className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={checkedItems.has(item.id)}
                        onChange={() => handleToggleCheck(item.id)}
                        className="mt-1 w-5 h-5 rounded border-gray-300 text-accent-primary focus:ring-accent-primary"
                      />
                      <div className="text-base text-ink">
                        {item.quantity && (
                          <span className="font-medium">{item.quantity} </span>
                        )}
                        {item.name}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
