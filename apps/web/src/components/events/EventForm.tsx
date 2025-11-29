// apps/web/src/components/events/EventForm.tsx

"use client";

import React, { useState } from "react";
import Button from "../ui/Button";

export interface EventFormData {
  name: string;
  event_type: "prep_week" | "event";
  event_date: string | null; // ISO datetime string or empty
  headcount: number | null;
  location: string | null;
  vibe: "chill" | "formal" | "family_chaos" | null;
  notes: string | null;
}

interface EventFormProps {
  initialData?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  isLoading?: boolean;
}

export default function EventForm({
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = "Save event",
  isLoading = false,
}: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    name: initialData.name || "",
    event_type: initialData.event_type || "event",
    event_date: initialData.event_date || null,
    headcount: initialData.headcount || null,
    location: initialData.location || null,
    vibe: initialData.vibe || null,
    notes: initialData.notes || null,
  });

  const [error, setError] = useState<string | null>(null);

  // Convert ISO datetime to datetime-local format
  const getLocalDateTime = (iso: string | null) => {
    if (!iso) return "";
    const date = new Date(iso);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Convert datetime-local to ISO
  const setLocalDateTime = (local: string) => {
    if (!local) {
      setFormData({ ...formData, event_date: null });
      return;
    }
    const date = new Date(local);
    setFormData({ ...formData, event_date: date.toISOString() });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Event name is required");
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save event");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-ink mb-2">
          Event name *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary outline-none"
          placeholder="e.g., Girls' Night Dinner Party"
        />
      </div>

      {/* Event type */}
      <div>
        <label htmlFor="event_type" className="block text-sm font-medium text-ink mb-2">
          Type *
        </label>
        <select
          id="event_type"
          value={formData.event_type}
          onChange={(e) =>
            setFormData({
              ...formData,
              event_type: e.target.value as EventFormData["event_type"],
            })
          }
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary outline-none"
        >
          <option value="event">One-time event (dinner party, holiday, etc.)</option>
          <option value="prep_week">Weekly prep (meal prep for the week)</option>
        </select>
      </div>

      {/* Date/time */}
      <div>
        <label htmlFor="event_date" className="block text-sm font-medium text-ink mb-2">
          Date & time
        </label>
        <input
          id="event_date"
          type="datetime-local"
          value={getLocalDateTime(formData.event_date)}
          onChange={(e) => setLocalDateTime(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary outline-none"
        />
        <p className="text-xs text-text-muted mt-1">
          Leave blank for weekly prep or events without a specific date.
        </p>
      </div>

      {/* Headcount */}
      <div>
        <label htmlFor="headcount" className="block text-sm font-medium text-ink mb-2">
          Headcount
        </label>
        <input
          id="headcount"
          type="number"
          min="1"
          value={formData.headcount || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              headcount: e.target.value ? parseInt(e.target.value) : null,
            })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary outline-none"
        />
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-ink mb-2">
          Location (optional)
        </label>
        <input
          id="location"
          type="text"
          value={formData.location || ""}
          onChange={(e) => setFormData({ ...formData, location: e.target.value || null })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary outline-none"
          placeholder="e.g., My house, 123 Main St"
        />
      </div>

      {/* Vibe */}
      <div>
        <label htmlFor="vibe" className="block text-sm font-medium text-ink mb-2">
          Vibe (optional)
        </label>
        <select
          id="vibe"
          value={formData.vibe || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              vibe: e.target.value ? (e.target.value as EventFormData["vibe"]) : null,
            })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary outline-none"
        >
          <option value="">Select vibe...</option>
          <option value="chill">Chill</option>
          <option value="formal">Formal</option>
          <option value="family_chaos">Family Chaos</option>
        </select>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-ink mb-2">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          value={formData.notes || ""}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value || null })}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary outline-none"
          placeholder="Any special notes or instructions..."
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" variant="primary" disabled={isLoading} className="flex-1">
          {isLoading ? "Saving..." : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

