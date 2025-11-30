"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../components/auth/AuthProvider";
import { useToast } from "../../../../components/ui/Toast";
import { createEvent, listEvents } from "../../../../lib/api";
import { getMessage } from "../../../../lib/messages";
import { apiErrorToMessage } from "../../../../lib/errors";
import { getUserLimits, checkLimit } from "../../../../lib/featureFlags";
import { isDemoMode } from "../../../../lib/demo";
import UpgradePrompt from "../../../../components/paywall/UpgradePrompt";
import EventForm, { type EventFormData } from "../../../../components/events/EventForm";

export default function NewEventPage() {
  const { session, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [eventCount, setEventCount] = React.useState<number | null>(null);
  const [showUpgrade, setShowUpgrade] = React.useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!session) {
      window.location.href = "/auth/sign-in";
      return;
    }

    // Check event count for free tier limit
    loadEventCount();
  }, [session, authLoading]);

  const loadEventCount = async () => {
    if (!session) return;
    try {
      const events = await listEvents(session);
      setEventCount(events.length);
      const limits = getUserLimits("free"); // TODO: Get actual user tier from profile
      const check = checkLimit(events.length, limits.maxEvents, "events");
      if (!check.withinLimit) {
        setShowUpgrade(true);
      }
    } catch (err) {
      console.error("Failed to load event count:", err);
    }
  };

  const handleSubmit = async (data: EventFormData) => {
    if (!session) return;

    // In demo mode, skip limit checks
    if (!isDemoMode()) {
      // Check limit before submitting
      const limits = getUserLimits("free"); // TODO: Get actual user tier
      if (eventCount !== null && eventCount >= limits.maxEvents) {
        showToast("You've reached the free tier limit of 3 events. Upgrade to Pro for unlimited events.", "warning");
        setShowUpgrade(true);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await createEvent(
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
      showToast(getMessage("event_saved"), "success");
      router.push("/app/events");
    } catch (err) {
      const errorMsg = apiErrorToMessage(err);
      // Check if it's a limit error
      if (errorMsg.includes("limit") || errorMsg.includes("Limit")) {
        setShowUpgrade(true);
      }
      showToast(errorMsg, "error");
      throw err;
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
          <h1 className="text-3xl font-bold text-ink mb-2">Create a new event</h1>
          <p className="text-text-muted">
            Start with the basics. You can add recipes and generate your game plan next.
          </p>
        </div>

        {showUpgrade && eventCount !== null && (
          <UpgradePrompt
            feature="events"
            currentCount={eventCount}
            limit={getUserLimits("free").maxEvents}
            onDismiss={() => setShowUpgrade(false)}
          />
        )}

        <div className="bg-card rounded-xl p-8 shadow-sm border border-gray-200">
          <EventForm
            onSubmit={handleSubmit}
            onCancel={() => router.push("/app/events")}
            submitLabel="Create event"
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}

