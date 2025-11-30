"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../components/auth/AuthProvider";
import { getProfile, updateProfile, type UserProfile } from "../../../lib/api";
import Button from "../../../components/ui/Button";
import Link from "next/link";

export default function ProfilePage() {
  const { session, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setDisplayName(data.display_name || "");
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!session || !profile) return;

    setIsSubmitting(true);
    try {
      const updated = await updateProfile(
        {
          display_name: displayName || null,
        },
        session
      );
      setProfile(updated);
      setIsEditing(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update profile");
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
            <p className="text-text-muted">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-body py-12">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-text-muted">Profile not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-body py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink mb-2">Profile</h1>
          <p className="text-text-muted">Manage your account settings.</p>
        </div>

        <div className="bg-card rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-ink mb-4">Account information</h2>

          {!isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Email</label>
                <p className="text-text-muted">{profile.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Display name</label>
                <p className="text-text-muted">{profile.display_name || "Not set"}</p>
              </div>
              <Button variant="secondary" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Email</label>
                <p className="text-text-muted">{profile.email}</p>
                <p className="text-xs text-text-muted mt-1">Email cannot be changed.</p>
              </div>
              <div>
                <label htmlFor="display_name" className="block text-sm font-medium text-ink mb-2">
                  Display name
                </label>
                <input
                  id="display_name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary outline-none"
                  placeholder="Your name"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="primary" onClick={handleSave} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
                <Button variant="secondary" onClick={() => {
                  setIsEditing(false);
                  setDisplayName(profile.display_name || "");
                }}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-card rounded-xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-ink mb-4">Kitchen settings</h2>
          <p className="text-text-muted mb-4">
            Configure your kitchen capacity and defaults to get better scheduling recommendations.
          </p>
          <Link href="/app/settings/kitchen">
            <Button variant="primary">Manage kitchen settings</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

