"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../components/auth/AuthProvider";
import { listEvents, listRecipes, getProfile, type SavedEvent, type SavedRecipe, type UserProfile } from "../../lib/api";
import { getMessage } from "../../lib/messages";
import Button from "../../components/ui/Button";
import Link from "next/link";

export default function AppDashboard() {
  const { session, loading: authLoading } = useAuth();
  const [events, setEvents] = useState<SavedEvent[]>([]);
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!session) {
      window.location.href = "/auth/sign-in";
      return;
    }

    loadData();
  }, [session, authLoading]);

  const loadData = async () => {
    if (!session) return;

    try {
      setLoading(true);
      const [eventsData, recipesData, profileData] = await Promise.all([
        listEvents(session),
        listRecipes(session),
        getProfile(session),
      ]);
      setEvents(eventsData);
      setRecipes(recipesData);
      setProfile(profileData);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  const upcomingEvents = events.filter((e) => !e.event_date || new Date(e.event_date) >= now);
  const nextEvent = upcomingEvents.sort((a, b) => {
    if (!a.event_date) return 1;
    if (!b.event_date) return -1;
    return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
  })[0];
  
  const weeklyPrep = events.find((e) => e.event_type === "prep_week");
  const recentRecipes = recipes.slice(0, 3);

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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-body py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
            <p className="text-text-muted">Loading your kitchen...</p>
          </div>
        </div>
      </div>
    );
  }

  const displayName = profile?.display_name || profile?.email?.split("@")[0] || "there";

  return (
    <div className="min-h-screen bg-body py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink mb-2">My Kitchen</h1>
          <p className="text-lg text-text-muted">
            Hi, {displayName} 👋
          </p>
          <p className="text-sm text-text-muted mt-1">
            We see you, Weekday Warrior. Let&apos;s feed Future You.
          </p>
        </div>

        {/* Demo mode banner */}
        {isDemoMode() && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 mb-6">
            <p className="text-sm font-medium text-amber-800 text-center">
              🎭 Demo Mode — All Pro features unlocked. Perfect for presentations!
            </p>
          </div>
        )}

        {/* First-time user explainer */}
        {events.length === 0 && recipes.length === 0 && (
          <div className="bg-accent-primary/10 border-2 border-accent-primary/30 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-ink mb-2">
              Welcome to Catered By Me
            </h2>
            <p className="text-text-muted mb-4">
              Catered By Me turns <em>what you want to cook</em> into <em>a real-time plan, grocery list, and timing map</em>.
            </p>
            <p className="text-sm text-text-muted mb-4">
              Start by creating your first event, then attach recipes to generate your game plan.
            </p>
            <Link href="/app/events/new">
              <Button variant="primary">Create your first event</Button>
            </Link>
          </div>
        )}

        {/* Next Event */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-ink mb-4">Next event</h2>
          {nextEvent ? (
            <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-ink mb-2">
                {nextEvent.name}
              </h3>
              <p className="text-sm text-text-muted mb-4">
                {formatDate(nextEvent.event_date)} {nextEvent.headcount && `• ${nextEvent.headcount} guests`}
              </p>
              <div className="flex gap-3">
                <Link href={`/app/events/${nextEvent.id}`}>
                  <Button variant="primary">Open event</Button>
                </Link>
                <Link href={`/app/events/${nextEvent.id}/grocery`}>
                  <Button variant="secondary">Grocery list</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-ink mb-2">
                {getMessage("no_upcoming_events")}
              </h3>
              <p className="text-sm text-text-muted mb-4">
                You know something&apos;s coming. Start with the next dinner, game night, or chaos feast.
              </p>
              <Link href="/app/events/new">
                <Button variant="primary">Plan a new event</Button>
              </Link>
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
              <Link href="/app/events/new">
                <Button variant="primary">Set up weekly prep</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-ink mb-4">Quick actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/app/events/new">
              <Button variant="primary">Plan a new event</Button>
            </Link>
            <Link href="/app/recipes/new">
              <Button variant="secondary">Add a recipe</Button>
            </Link>
            <Link href="/app/events/new">
              <Button variant="secondary">Plan my week</Button>
            </Link>
          </div>
          <p className="text-xs text-text-muted mt-3">
            Start wherever your brain is: the party, the recipes, or the weekday grind.
          </p>
        </div>

        {/* Recent Activity */}
        {events.length > 0 || recipes.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-ink mb-4">Recent activity</h2>
            <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-200">
              <ul className="space-y-2">
                {recipes.slice(0, 3).map((recipe) => (
                  <li key={recipe.id} className="text-sm text-text-muted">
                    You added &quot;{recipe.title}&quot; {new Date(recipe.created_at).toLocaleDateString()}
                  </li>
                ))}
                {events.slice(0, 2).map((event) => (
                  <li key={event.id} className="text-sm text-text-muted">
                    You created &quot;{event.name}&quot; {new Date(event.created_at).toLocaleDateString()}
                  </li>
                ))}
                {events.length === 0 && recipes.length === 0 && (
                  <li className="text-sm text-text-muted">No activity yet. Start by adding a recipe or creating an event!</li>
                )}
              </ul>
            </div>
          </div>
        ) : null}

        {/* Recent Recipes */}
        <div>
          <h2 className="text-xl font-semibold text-ink mb-4">Recent recipes</h2>
          {recentRecipes.length === 0 ? (
            <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-200 text-center">
              <p className="text-text-muted mb-4">{getMessage("no_recipes_yet")}</p>
              <Link href="/app/recipes/new">
                <Button variant="primary">Add your first recipe</Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {recentRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-card rounded-xl p-4 shadow-sm border border-gray-200"
              >
                <h3 className="font-semibold text-ink mb-1">{recipe.title}</h3>
                <p className="text-xs text-text-muted mb-2">
                  Serves {recipe.base_headcount} • {recipe.category}
                </p>
                <Link href={`/app/recipes/${recipe.id}`}>
                  <Button variant="tertiary" className="text-sm">
                    Open
                  </Button>
                </Link>
              </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

