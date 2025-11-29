"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../components/auth/AuthProvider";
import { listEvents, deleteEvent, type SavedEvent } from "../../../lib/api";
import EventCard from "../../../components/events/EventCard";
import Button from "../../../components/ui/Button";

export default function EventsPage() {
  const { session, loading: authLoading } = useAuth();
  const [events, setEvents] = useState<SavedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  useEffect(() => {
    if (authLoading) return;

    if (!session) {
      window.location.href = "/auth/sign-in";
      return;
    }

    loadEvents();
  }, [session, authLoading]);

  const loadEvents = async () => {
    if (!session) return;

    try {
      setLoading(true);
      setError(null);
      const data = await listEvents(session);
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!session) return;

    try {
      await deleteEvent(eventId, session);
      setEvents(events.filter((e) => e.id !== eventId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete event");
    }
  };

  const now = new Date();
  const upcomingEvents = events.filter(
    (e) => !e.event_date || new Date(e.event_date) >= now
  );
  const pastEvents = events.filter(
    (e) => e.event_date && new Date(e.event_date) < now
  );

  const displayedEvents = activeTab === "upcoming" ? upcomingEvents : pastEvents;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-body py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
            <p className="text-text-muted">Loading your events...</p>
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
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error loading events</h2>
            <p className="text-red-700">{error}</p>
            <Button variant="primary" onClick={loadEvents} className="mt-4">
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
            <h1 className="text-3xl font-bold text-ink mb-2">My Events</h1>
            <p className="text-text-muted">
              No events yet. Either you&apos;re overdue for a dinner party, or you&apos;re finally resting.
            </p>
          </div>
          <Link href="/app/events/new">
            <Button variant="primary">Create event</Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "upcoming"
                ? "border-accent-primary text-accent-primary"
                : "border-transparent text-text-muted hover:text-ink"
            }`}
          >
            Upcoming ({upcomingEvents.length})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "past"
                ? "border-accent-primary text-accent-primary"
                : "border-transparent text-text-muted hover:text-ink"
            }`}
          >
            Past ({pastEvents.length})
          </button>
        </div>

        {/* Event list */}
        {displayedEvents.length === 0 ? (
          <div className="bg-card rounded-xl p-12 text-center border border-gray-200">
            <div className="text-4xl mb-4">📅</div>
            <h2 className="text-xl font-semibold text-ink mb-2">
              {activeTab === "upcoming" ? "No upcoming events" : "No past events"}
            </h2>
            <p className="text-text-muted mb-6">
              {activeTab === "upcoming"
                ? "Start with your next dinner, game night, or chaos feast."
                : "Your past events will appear here."}
            </p>
            {activeTab === "upcoming" && (
              <Link href="/app/events/new">
                <Button variant="primary">Create your first event</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedEvents.map((event) => (
              <EventCard key={event.id} event={event} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

