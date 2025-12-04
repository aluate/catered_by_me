"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Logo from "../../../../components/Logo";
import Button from "../../../../components/ui/Button";
import type { EventWithRecipes } from "../../../../lib/api";

export default function ShareEventPage() {
  const params = useParams();
  const token = params.token as string;
  const [event, setEvent] = useState<EventWithRecipes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvent();
  }, [token]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/events/public/${token}`);
      
      if (!response.ok) {
        throw new Error("Event not found or link expired");
      }
      
      const data = await response.json();
      setEvent(data as EventWithRecipes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  const copyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Share link copied to clipboard!");
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-body">
        <Header />
        <div className="py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
            <p className="text-text-muted">Loading event...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-body">
        <Header />
        <div className="py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-ink mb-4">Event not found</h1>
            <p className="text-text-muted mb-6">
              {error || "This event link may have expired or been removed."}
            </p>
            <Button variant="primary" onClick={() => window.location.href = "/"}>
              Go to home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-body">
      <Header />
      
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8 text-center">
            <Logo variant="primary" withWordmark={true} className="mb-4 mx-auto" />
            <h1 className="text-3xl font-bold text-ink mb-2">{event.name}</h1>
            <p className="text-lg text-text-muted">
              {formatDate(event.event_date)}
              {event.headcount && ` • ${event.headcount} guests`}
            </p>
            {event.location && (
              <p className="text-sm text-text-muted mt-1">{event.location}</p>
            )}
          </div>

          {/* Share button */}
          <div className="mb-8 text-center">
            <Button variant="secondary" onClick={copyShareLink}>
              Share this link
            </Button>
          </div>

          {/* Recipes */}
          {event.recipes && event.recipes.length > 0 ? (
            <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
              <h2 className="text-xl font-semibold text-ink mb-4">Recipes</h2>
              <ul className="space-y-2">
                {event.recipes.map((er) => (
                  <li key={er.recipe_id} className="text-text-muted">
                    {er.recipe_title}
                    {er.target_headcount && ` (serves ${er.target_headcount})`}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-200 mb-8 text-center">
              <p className="text-text-muted">No recipes attached to this event.</p>
            </div>
          )}

          {/* Notes */}
          {event.notes && (
            <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
              <h2 className="text-xl font-semibold text-ink mb-2">Notes</h2>
              <p className="text-text-muted whitespace-pre-wrap">{event.notes}</p>
            </div>
          )}

          {/* CTA */}
          <div className="text-center bg-accent-primary/10 border-2 border-accent-primary/30 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-ink mb-2">
              Want to plan your own event?
            </h2>
            <p className="text-text-muted mb-4">
              Sign up for Catered By Me and turn your recipes into a game plan.
            </p>
            <Button variant="primary" onClick={() => window.location.href = "/auth/sign-in"}>
              Get started
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

