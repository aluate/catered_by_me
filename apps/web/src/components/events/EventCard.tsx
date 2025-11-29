// apps/web/src/components/events/EventCard.tsx

import React from "react";
import Link from "next/link";
import Button from "../ui/Button";

export interface EventCardData {
  id: string;
  name: string;
  event_type: "prep_week" | "event";
  event_date: string | null;
  headcount: number | null;
  vibe: "chill" | "formal" | "family_chaos" | null;
  created_at: string;
}

interface EventCardProps {
  event: EventCardData;
  onDelete?: (id: string) => void;
}

const eventTypeLabels: Record<EventCardData["event_type"], string> = {
  prep_week: "Weekly Prep",
  event: "Event",
};

const vibeLabels: Record<NonNullable<EventCardData["vibe"]>, string> = {
  chill: "Chill",
  formal: "Formal",
  family_chaos: "Family Chaos",
};

export default function EventCard({ event, onDelete }: EventCardProps) {
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

  const isUpcoming = event.event_date
    ? new Date(event.event_date) >= new Date()
    : true;

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-ink mb-1">{event.name}</h3>
          <div className="flex flex-wrap gap-2 text-xs mb-2">
            <span className="px-2 py-1 bg-accent-primary-soft text-accent-primary rounded-full font-medium">
              {eventTypeLabels[event.event_type]}
            </span>
            {event.vibe && (
              <span className="px-2 py-1 bg-gray-100 text-text-muted rounded-full">
                {vibeLabels[event.vibe]}
              </span>
            )}
            {!isUpcoming && (
              <span className="px-2 py-1 bg-gray-200 text-text-muted rounded-full">
                Past
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="text-sm text-text-muted mb-4">
        <p>{formatDate(event.event_date)}</p>
        {event.headcount && <p>{event.headcount} guests</p>}
      </div>

      <div className="flex gap-2">
        <Link href={`/app/events/${event.id}`} className="flex-1">
          <Button variant="primary" className="w-full">
            Open
          </Button>
        </Link>
        {onDelete && (
          <Button
            variant="tertiary"
            onClick={() => {
              if (confirm(`Delete "${event.name}"?`)) {
                onDelete(event.id);
              }
            }}
            className="text-red-600 hover:text-red-700"
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}

