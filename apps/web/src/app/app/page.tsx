"use client";

import React from "react";
import { mockDashboard, mockEvents, mockRecipes } from "../../lib/mockData";
import Button from "../../components/ui/Button";
import Link from "next/link";

export default function AppDashboard() {
  const nextEvent = mockEvents.find((e) => e.id === mockDashboard.nextEventId);
  const weeklyPrep = mockEvents.find((e) => e.id === mockDashboard.weeklyPrepEventId);
  const recentRecipes = mockRecipes.slice(0, 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-body py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink mb-2">My Kitchen</h1>
          <p className="text-lg text-text-muted">
            Hi, Hannah 👋
          </p>
          <p className="text-sm text-text-muted mt-1">
            We see you, Weekday Warrior. Let&apos;s feed Future You.
          </p>
        </div>

        {/* Next Event */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-ink mb-4">Next event</h2>
          {nextEvent ? (
            <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-ink mb-2">
                {nextEvent.name}
              </h3>
              <p className="text-sm text-text-muted mb-4">
                {formatDate(nextEvent.dateTime)} • {nextEvent.headcount} guests
              </p>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-accent-primary-soft text-accent-primary rounded-full text-xs font-medium">
                  {nextEvent.status === "game_plan_ready"
                    ? "Game plan ready"
                    : nextEvent.status === "needs_recipes"
                    ? "Needs recipes"
                    : "Timing needs a tweak"}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-text-muted rounded-full text-xs">
                  {nextEvent.recipeIds.length} recipes
                </span>
              </div>
              {nextEvent.status === "timing_needs_tweak" && (
                <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mb-4">
                  Eyes might be bigger than all those stomachs — your oven is overbooked.
                </p>
              )}
              <div className="flex gap-3">
                <Link href={`/app/events/${nextEvent.id}`}>
                  <Button variant="primary">Open game plan</Button>
                </Link>
                <Link href={`/app/events/${nextEvent.id}/grocery`}>
                  <Button variant="secondary">Grocery list</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-ink mb-2">
                No events on the calendar (yet)
              </h3>
              <p className="text-sm text-text-muted mb-4">
                You know something&apos;s coming. Start with the next dinner, game night, or chaos feast.
              </p>
              <Button variant="primary">Plan a new event</Button>
            </div>
          )}
        </div>

        {/* This Week's Prep */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-ink mb-4">This week&apos;s prep</h2>
          {weeklyPrep ? (
            <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-200">
              <p className="text-base text-text-muted mb-2">
                Breakfast bowls, turkey wraps, and roasted veggies are on deck.
              </p>
              <p className="text-xs text-text-muted mb-4">
                We&apos;ll keep the oven and fridge from fighting about space.
              </p>
              <Link href={`/app/events/${weeklyPrep.id}`}>
                <Button variant="secondary">Edit weekly prep</Button>
              </Link>
            </div>
          ) : (
            <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-ink mb-2">
                No weekly prep planned
              </h3>
              <p className="text-sm text-text-muted mb-4">
                Want lunches and breakfasts to run on autopilot? Start a simple prep plan.
              </p>
              <Button variant="primary">Set up weekly prep</Button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-ink mb-4">Quick actions</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Plan a new event</Button>
            <Button variant="secondary">Add a recipe</Button>
            <Button variant="secondary">Plan my week</Button>
          </div>
          <p className="text-xs text-text-muted mt-3">
            Start wherever your brain is: the party, the recipes, or the weekday grind.
          </p>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-ink mb-4">Recent activity</h2>
          <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-200">
            <ul className="space-y-2">
              {mockDashboard.recentActivity.map((activity, idx) => (
                <li key={idx} className="text-sm text-text-muted">
                  {activity}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recent Recipes */}
        <div>
          <h2 className="text-xl font-semibold text-ink mb-4">Recent recipes</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {recentRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-card rounded-xl p-4 shadow-sm border border-gray-200"
              >
                <h3 className="font-semibold text-ink mb-1">{recipe.name}</h3>
                <p className="text-xs text-text-muted mb-2">
                  Serves {recipe.baseServings} • {recipe.tags.join(", ")}
                </p>
                <Link href={`/app/recipes/${recipe.id}`}>
                  <Button variant="tertiary" className="text-sm">
                    Open
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

