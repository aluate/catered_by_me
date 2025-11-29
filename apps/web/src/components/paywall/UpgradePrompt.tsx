"use client";

import React, { useState } from "react";
import Link from "next/link";
import Button from "../ui/Button";
import DemoSuccess from "../DemoSuccess";
import { isDemoMode } from "../../lib/demo";
import { useToast } from "../ui/Toast";

interface UpgradePromptProps {
  feature: string;
  currentCount?: number;
  limit?: number;
  onDismiss?: () => void;
}

export default function UpgradePrompt({
  feature,
  currentCount,
  limit,
  onDismiss,
}: UpgradePromptProps) {
  const { showToast } = useToast();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleUpgrade = () => {
    if (isDemoMode()) {
      // Trigger confetti and success modal
      showToast("🎉 Demo Mode: This is what the upgrade flow will feel like!", "success");
      setShowSuccess(true);
      return;
    }
    // In real mode, navigate to pricing
  };

  return (
    <>
      {showSuccess && (
        <DemoSuccess
          title="Host with the most!"
          message="You're seeing a demo of a Pro feature. This is what your guests will see when we launch."
          onClose={() => setShowSuccess(false)}
        />
      )}
    <div className="bg-accent-secondary/20 border-2 border-accent-secondary rounded-xl p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-ink mb-2">
            Upgrade to Pro for unlimited {feature}
          </h3>
          {currentCount !== undefined && limit !== undefined && (
            <p className="text-sm text-text-muted mb-2">
              You&apos;ve used {currentCount} of {limit} {feature} on the free tier.
            </p>
          )}
          <p className="text-sm text-text-muted">
            Pro unlocks unlimited {feature}, PDF export, sharing, and priority support for just $15/year.
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-text-muted hover:text-ink"
            aria-label="Dismiss"
          >
            ✕
          </button>
        )}
      </div>
      <div className="flex gap-3">
        {isDemoMode() ? (
          <Button variant="primary" onClick={handleUpgrade}>
            Try it (Demo)
          </Button>
        ) : (
          <Link href="/pricing">
            <Button variant="primary">View pricing</Button>
          </Link>
        )}
        {onDismiss && (
          <Button variant="secondary" onClick={onDismiss}>
            Maybe later
          </Button>
        )}
      </div>
    </div>
    </>
  );
}

