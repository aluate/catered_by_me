"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Button from "../../../components/ui/Button";
import { createGiftCode, type GiftCodeCreateRequest } from "../../../lib/api";
import { useToast } from "../../../components/ui/Toast";
import { isDemoMode } from "../../../lib/demo";
import DemoSuccess from "../../../components/DemoSuccess";

export default function CreateGiftPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState<GiftCodeCreateRequest>({
    recipient_name: "",
    recipient_email: "",
    purchaser_email: "",
    message: "",
    plan: "pro_annual",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In demo mode, show success modal
      if (isDemoMode()) {
        setTimeout(() => {
          setLoading(false);
          setShowSuccess(true);
          // Generate a demo code and redirect
          const demoCode = `DEMO-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
          setTimeout(() => {
            router.push(`/gift/success/${demoCode}`);
          }, 2000);
        }, 1000);
        return;
      }

      const giftCode = await createGiftCode(formData);
      showToast("Gift code created! Redirecting to certificate...", "success");
      router.push(`/gift/success/${giftCode.code}`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to create gift code", "error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-body">
      <Header />
      
      <main className="py-12">
        {showSuccess && (
          <DemoSuccess
            title="Demo: Gift code generated!"
            message="This is what a real purchase will feel like. In production, you'd be redirected to Stripe checkout first."
            onClose={() => setShowSuccess(false)}
          />
        )}

        {isDemoMode() && (
          <div className="max-w-2xl mx-auto px-4 mb-6">
            <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 text-center">
              <p className="text-sm font-medium text-amber-800">
                🎭 Demo Mode: This is a fake purchase. No card required.
              </p>
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-card rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-ink mb-2">Create a Gift Membership</h1>
            <p className="text-text-muted mb-8">
              Give the gift of calmer kitchens and happier hosts.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Recipient Name */}
              <div>
                <label htmlFor="recipient_name" className="block text-sm font-medium text-ink mb-2">
                  Recipient Name (for certificate)
                </label>
                <input
                  type="text"
                  id="recipient_name"
                  value={formData.recipient_name}
                  onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                  placeholder="Hannah"
                />
              </div>

              {/* Recipient Email (optional) */}
              <div>
                <label htmlFor="recipient_email" className="block text-sm font-medium text-ink mb-2">
                  Recipient Email (optional, for future email delivery)
                </label>
                <input
                  type="email"
                  id="recipient_email"
                  value={formData.recipient_email}
                  onChange={(e) => setFormData({ ...formData, recipient_email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                  placeholder="hannah@example.com"
                />
              </div>

              {/* Your Email */}
              <div>
                <label htmlFor="purchaser_email" className="block text-sm font-medium text-ink mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  id="purchaser_email"
                  value={formData.purchaser_email}
                  onChange={(e) => setFormData({ ...formData, purchaser_email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>

              {/* Personal Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-ink mb-2">
                  Personal Message (optional)
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                  placeholder="Happy holidays! Hope this helps make your next big meal a little easier."
                />
              </div>

              {/* Plan (disabled, showing what they're buying) */}
              <div>
                <label htmlFor="plan" className="block text-sm font-medium text-ink mb-2">
                  Plan
                </label>
                <input
                  type="text"
                  id="plan"
                  value="Catered By Me Pro — 1 Year"
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Creating gift code..." : "Create Gift Code"}
                </Button>
                <p className="text-sm text-text-muted mt-4 text-center">
                  {isDemoMode() 
                    ? "Demo Mode: No payment required. Gift code will be generated instantly."
                    : "In production, you'll be redirected to Stripe checkout to complete your purchase."
                  }
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

