"use client";

import React, { useState } from "react";
import RecipeForm from "../components/RecipeForm";
import ScheduleView from "../components/ScheduleView";
import type { Schedule } from "../lib/api";

export default function HomePage() {
  const [schedule, setSchedule] = useState<Schedule | null>(null);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Catered By Me
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Paste your recipes, pick a serve time, and get a battle-tested game
            plan for the day.
          </p>
        </header>

        <RecipeForm onScheduleGenerated={setSchedule} />
        <ScheduleView schedule={schedule} />
      </div>
    </main>
  );
}
