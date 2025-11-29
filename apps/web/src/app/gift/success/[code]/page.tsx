"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Button from "../../../../components/ui/Button";
import { getGiftCode, type GiftCode } from "../../../../lib/api";
import { useToast } from "../../../../components/ui/Toast";
import { isDemoMode } from "../../../../lib/demo";

export default function GiftSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const code = params.code as string;
  
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
      showToast(error instanceof Error ? error.message : "Failed to load gift code", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (giftCode) {
      navigator.clipboard.writeText(giftCode.code);
      showToast("Code copied to clipboard!", "success");
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
      <div className="min-h-screen bg-body">
        <Header />
        <main className="py-12">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <p className="text-text-muted">Loading gift code...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!giftCode) {
    return (
      <div className="min-h-screen bg-body">
        <Header />
        <main className="py-12">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-ink mb-4">Gift code not found</h1>
            <Link href="/gift">
              <Button variant="primary">Back to Gift Page</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-body">
      <Header />
      
      <main className="py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-card rounded-xl shadow-lg p-8 text-center mb-6">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-ink mb-2">Gift Code Created!</h1>
            <p className="text-text-muted mb-8">
              Your gift membership is ready. Share the certificate below with your recipient.
            </p>

            {/* Gift Details */}
            <div className="bg-body rounded-lg p-6 mb-6 text-left">
              <div className="space-y-3">
                {giftCode.recipient_name && (
                  <div>
                    <span className="text-sm font-medium text-text-muted">To:</span>
                    <p className="text-lg text-ink">{giftCode.recipient_name}</p>
                  </div>
                )}
                {giftCode.purchaser_email && (
                  <div>
                    <span className="text-sm font-medium text-text-muted">From:</span>
                    <p className="text-lg text-ink">{giftCode.purchaser_email}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-text-muted">Code:</span>
                  <p className="text-lg font-mono font-bold text-accent-primary">{giftCode.code}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-text-muted">Valid Through:</span>
                  <p className="text-lg text-ink">{formatDate(giftCode.expires_at)}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/gift/${code}/certificate?style=holiday`}>
                <Button variant="primary" size="lg">
                  View Certificate
                </Button>
              </Link>
              <Button variant="secondary" size="lg" onClick={handleCopyCode}>
                Copy Code
              </Button>
            </div>

            <p className="text-sm text-text-muted mt-6">
              Tip: Use your browser&apos;s Print to PDF to save this as a digital certificate.
            </p>
          </div>

          {/* Demo Mode Notice */}
          {isDemoMode() && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 text-center">
              <p className="text-sm font-medium text-amber-800">
                🎭 Demo Mode: This is a sample gift code. In production, you&apos;d complete Stripe checkout first.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

