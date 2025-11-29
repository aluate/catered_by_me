"use client";

import React from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Button from "../../components/ui/Button";
import Logo from "../../components/Logo";

export default function GiftPage() {
  return (
    <div className="min-h-screen bg-body">
      <Header />
      
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-ink mb-4">
              Gift a year of calmer kitchens
            </h1>
            <p className="text-xl text-text-muted mb-8">
              Perfect stocking stuffer for the host in your life
            </p>
            <Link href="/gift/create">
              <Button variant="primary" size="lg">
                Give a Gift Membership
              </Button>
            </Link>
          </div>

          {/* Value Props */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-3">🎁</div>
              <h3 className="text-lg font-semibold text-ink mb-2">One Year of Pro</h3>
              <p className="text-text-muted">
                Full access to unlimited events, recipes, and all Pro features.
              </p>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-3">📅</div>
              <h3 className="text-lg font-semibold text-ink mb-2">Perfect for Hosts</h3>
              <p className="text-text-muted">
                Help them plan parties, holidays, and big meals with confidence.
              </p>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-3">✨</div>
              <h3 className="text-lg font-semibold text-ink mb-2">Instant Delivery</h3>
              <p className="text-text-muted">
                Print or email a beautiful certificate. No shipping, no hassle.
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-card rounded-xl p-8 shadow-sm mb-12">
            <h2 className="text-2xl font-bold text-ink mb-6">How it works</h2>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-accent-primary text-white rounded-full flex items-center justify-center font-bold">1</span>
                <div>
                  <h3 className="font-semibold text-ink mb-1">Choose your gift</h3>
                  <p className="text-text-muted">Select "Catered By Me Pro — 1 Year" and add a personal message.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-accent-primary text-white rounded-full flex items-center justify-center font-bold">2</span>
                <div>
                  <h3 className="font-semibold text-ink mb-1">Get your certificate</h3>
                  <p className="text-text-muted">We'll generate a beautiful, printable certificate with a unique redemption code.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-accent-primary text-white rounded-full flex items-center justify-center font-bold">3</span>
                <div>
                  <h3 className="font-semibold text-ink mb-1">They redeem</h3>
                  <p className="text-text-muted">Your recipient enters the code at cateredby.me/redeem and gets instant Pro access.</p>
                </div>
              </li>
            </ol>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/gift/create">
              <Button variant="primary" size="lg">
                Create Your Gift Now
              </Button>
            </Link>
            <p className="text-sm text-text-muted mt-4">
              Questions? <Link href="/" className="text-accent-primary hover:underline">Contact us</Link>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

