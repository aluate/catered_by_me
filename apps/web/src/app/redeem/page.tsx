"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Button from "../../components/ui/Button";
import { redeemGiftCode } from "../../lib/api";
import { useAuth } from "../../components/auth/AuthProvider";
import { useToast } from "../../components/ui/Toast";
import { isDemoMode } from "../../lib/demo";
import DemoSuccess from "../../components/DemoSuccess";

export default function RedeemPage() {
  const router = useRouter();
  const { session, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      showToast("Please sign in to redeem a gift code", "error");
      router.push("/auth/sign-in?redirect=/redeem");
      return;
    }

    setLoading(true);

    try {
      // In demo mode, show success modal
      if (isDemoMode() || code.startsWith("DEMO-")) {
        setTimeout(() => {
          setLoading(false);
          setShowSuccess(true);
          setTimeout(() => {
            router.push("/app");
          }, 2000);
        }, 1000);
        return;
      }

      await redeemGiftCode(code, session);
      showToast("You're Pro now! Let's plan something big.", "success");
      router.push("/app");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to redeem gift code", "error");
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-body">
        <Header />
        <main className="py-12">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <p className="text-text-muted">Loading...</p>
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
        {showSuccess && (
          <DemoSuccess
            title="You're Pro now!"
            message="Demo Mode: You've just redeemed a demo gift. In production, this will unlock Pro for a year."
            onClose={() => {
              setShowSuccess(false);
              router.push("/app");
            }}
          />
        )}

        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-card rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-ink mb-2">Redeem Your Gift</h1>
            <p className="text-text-muted mb-8">
              Enter your gift code to unlock one year of Catered By Me Pro.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-ink mb-2">
                  Gift Code
                </label>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-transparent font-mono text-lg"
                  placeholder="CBM-XXXX-XXXX"
                  required
                  pattern="[A-Z0-9-]+"
                />
                <p className="text-sm text-text-muted mt-2">
                  Enter the code from your gift certificate (format: CBM-XXXX-XXXX)
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={loading || !session}
              >
                {loading ? "Redeeming..." : !session ? "Please Sign In First" : "Redeem Your Gift"}
              </Button>

              {!session && (
                <p className="text-sm text-center text-text-muted">
                  <a href="/auth/sign-in?redirect=/redeem" className="text-accent-primary hover:underline">
                    Sign in
                  </a>{" "}
                  to redeem your gift code.
                </p>
              )}
            </form>

            {isDemoMode() && (
              <div className="mt-6 bg-amber-50 border-2 border-amber-300 rounded-xl p-4">
                <p className="text-sm font-medium text-amber-800 text-center">
                  🎭 Demo Mode: Codes starting with &quot;DEMO-&quot; will auto-succeed.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

