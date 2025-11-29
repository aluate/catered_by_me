"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../components/auth/AuthProvider";
import { getProfile, updateProfile, type UserProfile } from "../../../../lib/api";
import Button from "../../../../components/ui/Button";

export default function KitchenSettingsPage() {
  const { session, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    default_headcount: 4,
    oven_capacity_lbs: null as number | null,
    burner_count: 4,
  });

  useEffect(() => {
    if (authLoading) return;

    if (!session) {
      window.location.href = "/auth/sign-in";
      return;
    }

    loadProfile();
  }, [session, authLoading]);

  const loadProfile = async () => {
    if (!session) return;

    try {
      setLoading(true);
      const data = await getProfile(session);
      setProfile(data);
      setFormData({
        default_headcount: data.default_headcount || 4,
        oven_capacity_lbs: data.oven_capacity_lbs,
        burner_count: data.burner_count || 4,
      });
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !profile) return;

    setIsSubmitting(true);
    try {
      await updateProfile(
        {
          default_headcount: formData.default_headcount || null,
          oven_capacity_lbs: formData.oven_capacity_lbs,
          burner_count: formData.burner_count || null,
        },
        session
      );
      router.push("/app/profile");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-body py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
            <p className="text-text-muted">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-body py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink mb-2">Kitchen settings</h1>
          <p className="text-text-muted">
            Tell us about your kitchen so we can give you better scheduling recommendations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-xl p-8 shadow-sm border border-gray-200">
          <div className="space-y-6">
            {/* Default headcount */}
            <div>
              <label htmlFor="default_headcount" className="block text-sm font-medium text-ink mb-2">
                Default headcount
              </label>
              <input
                id="default_headcount"
                type="number"
                min="1"
                value={formData.default_headcount}
                onChange={(e) =>
                  setFormData({ ...formData, default_headcount: parseInt(e.target.value) || 1 })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary outline-none"
              />
              <p className="text-xs text-text-muted mt-1">
                We&apos;ll use this as the default when creating new events.
              </p>
            </div>

            {/* Oven capacity */}
            <div>
              <label htmlFor="oven_capacity_lbs" className="block text-sm font-medium text-ink mb-2">
                Oven capacity (lbs)
              </label>
              <input
                id="oven_capacity_lbs"
                type="number"
                min="0"
                value={formData.oven_capacity_lbs || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    oven_capacity_lbs: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary outline-none"
                placeholder="e.g., 25"
              />
              <p className="text-xs text-text-muted mt-1">
                Approximate weight capacity of your oven. We&apos;ll warn you if you&apos;re trying to cook too much at once.
              </p>
            </div>

            {/* Burner count */}
            <div>
              <label htmlFor="burner_count" className="block text-sm font-medium text-ink mb-2">
                Number of burners
              </label>
              <input
                id="burner_count"
                type="number"
                min="1"
                max="12"
                value={formData.burner_count}
                onChange={(e) =>
                  setFormData({ ...formData, burner_count: parseInt(e.target.value) || 1 })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary outline-none"
              />
              <p className="text-xs text-text-muted mt-1">
                How many stovetop burners do you have? We&apos;ll help you avoid overbooking.
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <Button type="submit" variant="primary" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Saving..." : "Save settings"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => router.push("/app/profile")}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

