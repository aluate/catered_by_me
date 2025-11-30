"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getGiftCode, type GiftCode } from "../../../../lib/api";
import { isDemoMode } from "../../../../lib/demo";
import Logo from "../../../../components/Logo";
import Button from "../../../../components/ui/Button";

export default function CertificatePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const code = params.code as string;
  const style = searchParams.get("style") || "holiday";
  
  const [giftCode, setGiftCode] = useState<GiftCode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (code) {
      loadGiftCode();
    }
  }, [code]);

  const loadGiftCode = async () => {
    try {
      const data = await getGiftCode(code);
      setGiftCode(data);
    } catch (error) {
      console.error("Failed to load gift code:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-body flex items-center justify-center">
        <p className="text-text-muted">Loading certificate...</p>
      </div>
    );
  }

  if (!giftCode) {
    return (
      <div className="min-h-screen bg-body flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-ink mb-4">Certificate not found</h1>
          <p className="text-text-muted">The gift code you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  // Template A: Holiday Host Pass
  if (style === "holiday") {
    return (
      <div className="min-h-screen bg-body print:bg-white print:p-0">
        <div className="max-w-4xl mx-auto px-4 py-12 print:py-0">
          <div className="bg-card rounded-xl border-2 border-accent-primary shadow-lg p-12 print:shadow-none print:border-0 print:rounded-none print:p-8">
            {/* Logo */}
            <div className="text-center mb-8 print:mb-6">
              <Logo variant="secondary" withWordmark={false} className="mx-auto" />
            </div>

            {/* Top Label */}
            <div className="text-center mb-4">
              <p className="text-sm font-bold text-accent-primary uppercase tracking-wider">
                HOLIDAY HOST PASS
              </p>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-ink text-center mb-4 print:text-4xl">
              Gift Membership Certificate
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-text-muted text-center mb-12 print:mb-8 italic">
              For the one who always feeds everyone else.
            </p>

            {/* Body */}
            <div className="text-center mb-12 print:mb-8">
              <p className="text-lg text-ink mb-6 print:mb-4">
                This certifies that
              </p>
              <p className="text-3xl font-bold text-accent-primary mb-6 print:text-2xl">
                {giftCode.recipient_name || "Recipient Name"}
              </p>
              <p className="text-lg text-ink">
                has been gifted one year of
              </p>
              <p className="text-2xl font-semibold text-ink mt-2 print:text-xl">
                Catered By Me Pro
              </p>
              <p className="text-lg text-text-muted mt-2">
                — your personal kitchen game-planner.
              </p>
            </div>

            {/* Details Box */}
            <div className="bg-body rounded-lg p-6 mb-8 print:mb-6 print:bg-transparent print:border-2 print:border-gray-300">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎄</span>
                  <div>
                    <span className="text-sm font-medium text-text-muted">Plan:</span>
                    <p className="text-lg font-semibold text-ink">Catered By Me Pro — 1 Year</p>
                  </div>
                </div>
                {giftCode.purchaser_email && (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎁</span>
                    <div>
                      <span className="text-sm font-medium text-text-muted">From:</span>
                      <p className="text-lg font-semibold text-ink">{giftCode.purchaser_email}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🗓</span>
                  <div>
                    <span className="text-sm font-medium text-text-muted">Valid Through:</span>
                    <p className="text-lg font-semibold text-ink">{formatDate(giftCode.expires_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔑</span>
                  <div>
                    <span className="text-sm font-medium text-text-muted">Redemption Code:</span>
                    <p className="text-lg font-mono font-bold text-accent-primary">{giftCode.code}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center">
              <p className="text-sm text-text-muted italic mb-2">
                &quot;Host the meal. We&apos;ve got the rest.&quot;
              </p>
              <p className="text-xs text-text-muted">cateredby.me</p>
            </div>

            {/* Demo Mode Watermark */}
            {isDemoMode() && (
              <div className="text-center mt-8 print:hidden">
                <p className="text-xs text-gray-400">Demo Mode — Sample Certificate</p>
              </div>
            )}

            {/* Print Button (hidden when printing) */}
            <div className="text-center mt-8 print:hidden">
              <Button
                variant="primary"
                onClick={() => window.print()}
              >
                Print Certificate
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Template B: Everyday Hero Host
  return (
    <div className="min-h-screen bg-body print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto px-4 py-12 print:py-0">
        <div className="bg-card rounded-xl border-2 border-accent-primary shadow-lg p-12 print:shadow-none print:border-0 print:rounded-none print:p-8">
          {/* Logo */}
          <div className="text-center mb-8 print:mb-6">
            <Logo variant="primary" withWordmark={false} className="mx-auto" />
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-ink text-center mb-4 print:text-3xl">
            Catered By Me Gift Membership
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-text-muted text-center mb-12 print:mb-8 italic">
            For the hero of every brunch, potluck, and &quot;I&apos;ll just throw something together.&quot;
          </p>

          {/* Body */}
          <div className="mb-12 print:mb-8">
            <p className="text-xl font-semibold text-ink mb-4 print:text-lg">
              {giftCode.recipient_name || "Recipient Name"},
            </p>
            <p className="text-lg text-ink mb-4 print:text-base">
              You&apos;ve been gifted one year of
            </p>
            <p className="text-2xl font-bold text-accent-primary mb-4 print:text-xl">
              Catered By Me Pro.
            </p>
            <p className="text-lg text-ink mb-2 print:text-base">
              Use it to tame the chaos, plan the parties,
            </p>
            <p className="text-lg text-ink print:text-base">
              and make every meal feel less like a scramble
            </p>
            <p className="text-lg text-ink print:text-base">
              and more like a flex.
            </p>
          </div>

          {/* Details Strip */}
          <div className="bg-accent-primary text-white rounded-lg p-6 mb-8 print:mb-6 print:bg-gray-800">
            <div className="grid md:grid-cols-2 gap-4 text-sm print:text-xs">
              <div>
                <span className="font-medium">Plan:</span>{" "}
                <span>Catered By Me Pro — 1 Year</span>
              </div>
              {giftCode.purchaser_email && (
                <div>
                  <span className="font-medium">From:</span>{" "}
                  <span>{giftCode.purchaser_email}</span>
                </div>
              )}
              <div>
                <span className="font-medium">Redemption Code:</span>{" "}
                <span className="font-mono font-bold">{giftCode.code}</span>
              </div>
              <div>
                <span className="font-medium">Valid Through:</span>{" "}
                <span>{formatDate(giftCode.expires_at)}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-sm">
                Redeem at: <span className="font-mono">cateredby.me/redeem</span>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-text-muted italic">
              &quot;You know what looks good. We know how to get you there.&quot;
            </p>
          </div>

          {/* Demo Mode Watermark */}
          {isDemoMode() && (
            <div className="text-center mt-8 print:hidden">
              <p className="text-xs text-gray-400">Demo Mode — Sample Certificate</p>
            </div>
          )}

          {/* Print Button (hidden when printing) */}
          <div className="text-center mt-8 print:hidden">
            <Button
              variant="primary"
              onClick={() => window.print()}
            >
              Print Certificate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

