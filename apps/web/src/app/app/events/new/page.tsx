"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../components/auth/AuthProvider";
import { useToast } from "../../../../components/ui/Toast";
import { createEvent } from "../../../../lib/api";
import { getMessage } from "../../../../lib/messages";
import { apiErrorToMessage } from "../../../../lib/errors";
import EventForm, { type EventFormData } from "../../../../components/events/EventForm";
import Button from "../../../../components/ui/Button";

export default function NewEventPage() {
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

  const handleSubmit = async (data: EventFormData) => {
    if (!session) return;

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
      showToast(apiErrorToMessage(err), "error");
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

