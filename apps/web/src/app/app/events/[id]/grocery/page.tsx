"use client";

import React, { useState } from "react";
import { mockEvents, mockRecipes } from "../../../../lib/mockData";
import { buildGroceryListForEvent } from "../../../../lib/grocery";
import Button from "../../../../components/ui/Button";
import Link from "next/link";

export default function GroceryPage({ params }: { params: { id: string } }) {
  const { event, recipes, itemsBySection, itemsByRecipe } =
    buildGroceryListForEvent(params.id, mockEvents, mockRecipes);

  const [viewMode, setViewMode] = useState<"section" | "recipe">("section");

  if (!event) {
    return (
      <div className="min-h-screen bg-body py-12">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-text-muted">Event not found.</p>
        </div>
      </div>
    );
  }

  const recipeNames = recipes.map((r) => r.name).join(", ");

  const copyList = () => {
    let text = `Grocery list – ${event.name} (${event.headcount} guests)\n\n`;

    if (viewMode === "section") {
      itemsBySection.forEach((section) => {
        text += `${section.label.toUpperCase()}\n\n`;
        section.items.forEach((item) => {
          const qty = item.quantity ? `${item.quantity} ` : "";
          text += `- ${qty}${item.name}`;
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
          const qty = item.quantity ? `${item.quantity} ` : "";
          text += `- ${qty}${item.name}\n`;
        });
        text += "\n";
      });
    }

    navigator.clipboard.writeText(text);
    alert("Grocery list copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-body py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink mb-2">Grocery list</h1>
          <p className="text-lg text-text-muted mb-1">
            {event.name} • {event.headcount} guests
          </p>
          <p className="text-sm text-text-muted">
            Includes: {recipeNames}
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
          <Link href={`/app/events/${params.id}/grocery/print`}>
            <Button variant="secondary">Print / Save PDF</Button>
          </Link>
        </div>

        {/* Content */}
        {viewMode === "section" ? (
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

