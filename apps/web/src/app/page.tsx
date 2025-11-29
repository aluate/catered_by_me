"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/ui/Button";
import RecipeForm from "../components/RecipeForm";
import ScheduleView from "../components/ScheduleView";
import type { Schedule } from "../lib/api";
import type { Recipe } from "../lib/api";

export default function HomePage() {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [recipe, setRecipe] = useState<Recipe | null>(null);

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
      <Header />

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-ink mb-6 leading-tight">
                Host the meal. We&apos;ve got the rest.
              </h1>
              <p className="text-lg text-text-muted mb-8 leading-relaxed">
                You know what looks good. We know how to get you there. Paste your recipes, pick a serve time, and get a minute-by-minute schedule for the big day.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="primary" onClick={scrollToForm}>
                  Try the App
                </Button>
                <Button variant="secondary" onClick={scrollToHowItWorks}>
                  Browse Recipes
                </Button>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-8 shadow-lg border border-gray-200">
              {/* Simple mockup illustration */}
              <div className="space-y-4">
                <div className="h-4 bg-lane-bg rounded w-3/4"></div>
                <div className="h-4 bg-lane-bg rounded w-full"></div>
                <div className="h-4 bg-lane-bg rounded w-2/3"></div>
                <div className="grid grid-cols-4 gap-2 mt-6">
                  <div className="h-16 bg-accent-primary-soft rounded"></div>
                  <div className="h-16 bg-accent-primary-soft rounded"></div>
                  <div className="h-16 bg-accent-primary-soft rounded"></div>
                  <div className="h-16 bg-accent-primary-soft rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-20 bg-body">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
              How it works
            </h2>
            <p className="text-lg text-text-muted">
              From idea to served-on-time in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-card rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="w-16 h-16 rounded-full bg-accent-primary-soft flex items-center justify-center mb-6">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-ink mb-3">
                Describe the meal
              </h3>
              <p className="text-base text-text-muted">
                Use your recipe, link, or handwritten notes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-card rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="w-16 h-16 rounded-full bg-accent-primary-soft flex items-center justify-center mb-6">
                <span className="text-2xl">🕒</span>
              </div>
              <h3 className="text-xl font-semibold text-ink mb-3">
                We build the timing
              </h3>
              <p className="text-base text-text-muted">
                Prep timeline, oven loads, parallel tasks.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-card rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="w-16 h-16 rounded-full bg-accent-primary-soft flex items-center justify-center mb-6">
                <span className="text-2xl">🎉</span>
              </div>
              <h3 className="text-xl font-semibold text-ink mb-3">
                You host
              </h3>
              <p className="text-base text-text-muted">
                With space in the oven and a drink in your hand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Built for Hosts Like You */}
      <section id="about" className="py-16 md:py-20 bg-body">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
              Built for hosts like you
            </h2>
            <p className="text-lg text-text-muted">
              Whether you&apos;re meal prepping for the week or hosting the big day.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* The Weekday Prepper */}
            <div className="bg-card rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="w-16 h-16 rounded-full bg-accent-secondary/20 flex items-center justify-center mb-6">
                <span className="text-2xl">🥗</span>
              </div>
              <h3 className="text-xl font-semibold text-ink mb-3">
                The Weekday Prepper
              </h3>
              <p className="text-base text-text-muted mb-4">
                Meal prep for lunches, breakfast batches, planning healthy meals for the week ahead.
              </p>
              <ul className="space-y-2 text-sm text-text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-accent-secondary mt-1">•</span>
                  <span>Sunday block scheduling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-secondary mt-1">•</span>
                  <span>Multi-recipe coordination</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-secondary mt-1">•</span>
                  <span>Equipment optimization</span>
                </li>
              </ul>
            </div>

            {/* The Holiday Host */}
            <div className="bg-card rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="w-16 h-16 rounded-full bg-accent-primary-soft flex items-center justify-center mb-6">
                <span className="text-2xl">🦃</span>
              </div>
              <h3 className="text-xl font-semibold text-ink mb-3">
                The Holiday Host
              </h3>
              <p className="text-base text-text-muted mb-4">
                Thanksgiving, Christmas, Friendsgiving, birthdays, big weekends that need to be perfect.
              </p>
              <ul className="space-y-2 text-sm text-text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary mt-1">•</span>
                  <span>Complex multi-dish coordination</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary mt-1">•</span>
                  <span>Timing precision</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary mt-1">•</span>
                  <span>Stress-free execution</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Main App Area */}
      <section id="app-area" className="py-16 md:py-20 bg-body">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
              Build your game plan
            </h2>
            <p className="text-lg text-text-muted">
              Start with the sample recipe or paste your own.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Recipe Form */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-200">
              <RecipeForm
                onScheduleGenerated={(schedule, recipe) => {
                  setSchedule(schedule);
                  setRecipe(recipe);
                }}
              />
            </div>

            {/* Right: Schedule View */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-gray-200">
              <ScheduleView schedule={schedule} recipe={recipe} />
            </div>
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section id="contact" className="py-16 md:py-20 bg-lane-bg/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
              See it in action
            </h2>
            <p className="text-lg text-text-muted">
              A clean, organized view of your entire cooking day.
            </p>
          </div>
          <div className="bg-card rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="aspect-video bg-lane-bg rounded-lg flex items-center justify-center">
              <p className="text-text-muted">Schedule Preview</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
