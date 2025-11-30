"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Button from "../../components/ui/Button";
import { useToast } from "../../components/ui/Toast";
import { isDemoMode } from "../../lib/demo";
import DemoSuccess from "../../components/DemoSuccess";

export const dynamic = 'force-dynamic';

export default function PricingPage() {
  const { showToast } = useToast();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleUpgrade = (plan: "pro" | "founding") => {
    if (isDemoMode()) {
      showToast(`🎉 Demo Mode: ${plan === "pro" ? "Pro" : "Founding Host"} upgrade unlocked!`, "success");
      setShowSuccess(true);
      return;
    }
    // In real mode, this would trigger Stripe checkout
  };

  return (
    <div className="min-h-screen bg-body">
      <Header />
      
      <main className="py-12">
        {showSuccess && (
          <DemoSuccess
            title="Host with the most!"
            message="You're seeing a demo of the upgrade flow. This is what the checkout experience will feel like!"
            onClose={() => setShowSuccess(false)}
          />
        )}
        
        {isDemoMode() && (
          <div className="max-w-4xl mx-auto px-4 mb-6">
            <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 text-center">
              <p className="text-sm font-medium text-amber-800">
                🎭 You are viewing a demo. All Pro features are unlocked.
              </p>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-ink mb-4">Simple pricing</h1>
            <div className="mb-6">
              <Link href="/gift">
                <Button variant="secondary" size="sm">
                  🎁 Gift a Membership
                </Button>
              </Link>
            </div>
            <p className="text-xl text-text-muted">
              Host the meal. We&apos;ve got the rest.
            </p>
          </div>

          {/* Holiday Host Pass Banner */}
          <div className="bg-accent-secondary/20 border-2 border-accent-secondary rounded-xl p-6 mb-12 text-center">
            <h2 className="text-2xl font-bold text-ink mb-2">🎄 Holiday Host Pass</h2>
            <p className="text-lg text-text-muted mb-4">
              Free through January 15, 2026
            </p>
            <p className="text-sm text-text-muted">
              Use everything free through the holidays. No credit card required. After January 15, upgrade to Pro to keep going.
            </p>
          </div>

          {/* Feature Comparison Table */}
          <div className="bg-card rounded-xl p-8 shadow-sm border border-gray-200 mb-12">
            <h2 className="text-2xl font-bold text-ink mb-6 text-center">Feature Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-ink">Feature</th>
                    <th className="text-center py-3 px-4 font-semibold text-ink">Free</th>
                    <th className="text-center py-3 px-4 font-semibold text-ink">Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-3 px-4 text-text-muted">Events</td>
                    <td className="py-3 px-4 text-center">3</td>
                    <td className="py-3 px-4 text-center font-semibold text-accent-primary">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-text-muted">Recipes</td>
                    <td className="py-3 px-4 text-center">10</td>
                    <td className="py-3 px-4 text-center font-semibold text-accent-primary">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-text-muted">Schedules</td>
                    <td className="py-3 px-4 text-center">✓</td>
                    <td className="py-3 px-4 text-center">✓</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-text-muted">Grocery Lists</td>
                    <td className="py-3 px-4 text-center">✓</td>
                    <td className="py-3 px-4 text-center">✓</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-text-muted">PDF Export</td>
                    <td className="py-3 px-4 text-center text-gray-400">✗</td>
                    <td className="py-3 px-4 text-center font-semibold text-accent-primary">✓</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-text-muted">Sharing</td>
                    <td className="py-3 px-4 text-center text-gray-400">✗</td>
                    <td className="py-3 px-4 text-center font-semibold text-accent-primary">✓</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-text-muted">Support</td>
                    <td className="py-3 px-4 text-center text-text-muted">Community</td>
                    <td className="py-3 px-4 text-center font-semibold text-accent-primary">Priority</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Free Tier */}
            <div className="bg-card rounded-xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-2xl font-bold text-ink mb-2">Free</h3>
              <p className="text-3xl font-bold text-ink mb-1">$0</p>
              <p className="text-sm text-text-muted mb-6">Forever</p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary mt-1">✓</span>
                  <span className="text-sm text-ink">3 saved events</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary mt-1">✓</span>
                  <span className="text-sm text-ink">10 saved recipes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary mt-1">✓</span>
                  <span className="text-sm text-ink">Unlimited schedule generation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary mt-1">✓</span>
                  <span className="text-sm text-ink">Grocery lists</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">✗</span>
                  <span className="text-sm text-text-muted">PDF export</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">✗</span>
                  <span className="text-sm text-text-muted">Sharing</span>
                </li>
              </ul>
            </div>

            {/* Pro Tier */}
            <div className="bg-card rounded-xl p-8 shadow-sm border-2 border-accent-primary relative">
              <div className="absolute top-0 right-0 bg-accent-primary text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
                Popular
              </div>
              
              <h3 className="text-2xl font-bold text-ink mb-2">Pro</h3>
              <p className="text-3xl font-bold text-ink mb-1">$15</p>
              <p className="text-sm text-text-muted mb-6">per year</p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary mt-1">✓</span>
                  <span className="text-sm text-ink font-medium">Unlimited events</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary mt-1">✓</span>
                  <span className="text-sm text-ink font-medium">Unlimited recipes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary mt-1">✓</span>
                  <span className="text-sm text-ink font-medium">Everything in Free</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary mt-1">✓</span>
                  <span className="text-sm text-ink font-medium">PDF export</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary mt-1">✓</span>
                  <span className="text-sm text-ink font-medium">Shareable game plans</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary mt-1">✓</span>
                  <span className="text-sm text-ink font-medium">Priority support</span>
                </li>
              </ul>
              
              {isDemoMode() ? (
                <Button variant="primary" className="w-full" onClick={() => handleUpgrade("pro")}>
                  Try Pro (Demo)
                </Button>
              ) : (
                <>
                  <Button variant="primary" className="w-full" disabled>
                    Coming soon
                  </Button>
                  <p className="text-xs text-text-muted text-center mt-2">
                    Payment integration coming in Phase 5
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Founding Host */}
          <div className="bg-lane-bg/50 rounded-xl p-6 mb-12 text-center">
            <h3 className="text-xl font-bold text-ink mb-2">Founding Host</h3>
            <p className="text-text-muted mb-4">
              Early adopters get <strong>$10/year</strong> locked in forever. Available for a limited time.
            </p>
            <p className="text-sm text-text-muted">
              (Coming soon with payment integration)
            </p>
          </div>

          {/* FAQ */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-ink mb-6">Frequently asked questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-ink mb-2">
                  What happens after the Holiday Host Pass ends?
                </h3>
                <p className="text-text-muted">
                  You&apos;ll be able to continue using the free tier (3 events, 10 recipes) or upgrade to Pro for unlimited everything.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-ink mb-2">
                  Can I cancel anytime?
                </h3>
                <p className="text-text-muted">
                  Yes. Pro is an annual subscription, but you can cancel anytime and keep access until the end of your billing period.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-ink mb-2">
                  What if I need more than 3 events?
                </h3>
                <p className="text-text-muted">
                  You can always delete old events to make room, or upgrade to Pro for unlimited events and recipes.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/app">
              <Button variant="primary" size="lg">
                Get started free
              </Button>
            </Link>
            <p className="text-sm text-text-muted mt-4">
              No credit card required. Start planning your next meal.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

