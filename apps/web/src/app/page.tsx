"use client";

import React, { useState } from "react";
import RecipeForm from "../components/RecipeForm";
import ScheduleView from "../components/ScheduleView";
import type { Schedule } from "../lib/api";

export default function HomePage() {
  const [schedule, setSchedule] = useState<Schedule | null>(null);

  const scrollToForm = () => {
    const el = document.getElementById("app-area");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToHowItWorks = () => {
    const el = document.getElementById("how-it-works");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="min-h-screen bg-body">
      {/* Header */}
      <header className="bg-body border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-text-main">Catered By Me</h1>
            <nav className="flex items-center gap-6">
              <button
                onClick={scrollToHowItWorks}
                className="text-sm text-text-muted hover:text-text-main transition-colors"
              >
                How it works
              </button>
              <button className="text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                Log in
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-text-main mb-4">
                Turn chaos in the kitchen into a game plan.
              </h1>
              <p className="text-base md:text-[15px] text-text-muted mb-6">
                Paste your recipes, pick a serve time, and get a minute-by-minute schedule for the big day.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={scrollToForm}
                  className="px-6 py-3 rounded-xl bg-accent-primary text-white font-medium hover:bg-[#2d6348] transition-colors"
                >
                  Try it now
                </button>
                <button
                  onClick={scrollToHowItWorks}
                  className="px-6 py-3 text-accent-primary font-medium hover:underline"
                >
                  See how it works
                </button>
              </div>
            </div>
            <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-sm font-semibold mb-3 text-text-main">Your game plan includes:</h3>
              <ul className="space-y-2 text-sm text-text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary mt-0.5">•</span>
                  <span>Minute-by-minute task breakdown</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary mt-0.5">•</span>
                  <span>Organized by prep, stove, oven, and more</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary mt-0.5">•</span>
                  <span>Scaled to your exact headcount</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary mt-0.5">•</span>
                  <span>Ready to follow on the big day</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Main App Area */}
      <section id="app-area" className="py-8 md:py-12 bg-body">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-text-main mb-2">
              Build your game plan
            </h2>
            <p className="text-sm text-text-muted">
              Start with the sample recipe or paste your own.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Recipe Form */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-200">
              <RecipeForm onScheduleGenerated={setSchedule} />
            </div>

            {/* Right: Schedule View */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-200">
              <ScheduleView schedule={schedule} />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 md:py-16 bg-body">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-2xl font-semibold text-text-main mb-2">
              How it works
            </h2>
            <p className="text-sm text-text-muted">
              From idea to served-on-time in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 rounded-full bg-accent-primary-soft flex items-center justify-center mb-4">
                <span className="text-accent-primary font-bold text-lg">1</span>
              </div>
              <h3 className="text-lg font-semibold text-text-main mb-2">
                Add your recipes
              </h3>
              <p className="text-sm text-text-muted">
                Paste recipe text or bring your favorite dishes into your Catered By Me library.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 rounded-full bg-accent-primary-soft flex items-center justify-center mb-4">
                <span className="text-accent-primary font-bold text-lg">2</span>
              </div>
              <h3 className="text-lg font-semibold text-text-main mb-2">
                Set headcount & serve time
              </h3>
              <p className="text-sm text-text-muted">
                Tell us how many guests you&apos;re feeding and when you want to serve.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 rounded-full bg-accent-primary-soft flex items-center justify-center mb-4">
                <span className="text-accent-primary font-bold text-lg">3</span>
              </div>
              <h3 className="text-lg font-semibold text-text-main mb-2">
                Follow your game plan
              </h3>
              <p className="text-sm text-text-muted">
                Get a minute-by-minute schedule grouped by prep, stove, oven, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 bg-body">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm font-medium text-text-main mb-1">Catered By Me</p>
          <p className="text-xs text-slate-500">
            Built for people who want to host and actually enjoy the party.
          </p>
        </div>
      </footer>
    </main>
  );
}
