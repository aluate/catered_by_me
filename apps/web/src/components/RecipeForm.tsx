"use client";

import React, { useState } from "react";
import { parseTextRecipe, generateSchedule, type Schedule } from "../lib/api";
import Button from "./ui/Button";

type Props = {
  onScheduleGenerated: (schedule: Schedule) => void;
};

const sampleRecipe = `Ingredients:
- 2 lb potatoes
- 4 tbsp butter, softened
- 1/2 cup milk
- Salt and pepper to taste

Directions:
1. Peel and dice potatoes.
2. Boil potatoes in salted water until tender, about 20 minutes.
3. Drain and mash with butter and milk until smooth.
4. Season with salt and pepper to taste.`;

const RecipeForm: React.FC<Props> = ({ onScheduleGenerated }) => {
  const [title, setTitle] = useState("Sample Mashed Potatoes");
  const [baseHeadcount, setBaseHeadcount] = useState(4);
  const [targetHeadcount, setTargetHeadcount] = useState(6);
  const [serveTime, setServeTime] = useState<string>(() => {
    const now = new Date();
    now.setHours(now.getHours() + 2);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  });
  const [rawText, setRawText] = useState(sampleRecipe);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFillSample() {
    setTitle("Sample Mashed Potatoes");
    setBaseHeadcount(4);
    setTargetHeadcount(6);
    setRawText(sampleRecipe);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!rawText.trim()) {
      setError("Please paste a recipe.");
      return;
    }
    if (!serveTime) {
      setError("Please choose a serve time.");
      return;
    }
    if (targetHeadcount <= 0 || baseHeadcount <= 0) {
      setError("Headcounts must be greater than zero.");
      return;
    }

    setLoading(true);
    try {
      const recipe = await parseTextRecipe({
        title: title || undefined,
        base_headcount: baseHeadcount,
        target_headcount:
          targetHeadcount !== baseHeadcount ? targetHeadcount : undefined,
        raw_text: rawText,
      });

      const schedule = await generateSchedule({
        recipes: [recipe],
        serve_time: new Date(serveTime).toISOString(),
      });

      onScheduleGenerated(schedule);

      // scroll to schedule
      const el = document.getElementById("schedule");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong generating the schedule.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <form
        onSubmit={handleSubmit}
        className="bg-card border border-gray-200 rounded-xl p-6 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Plan your cook</h2>
          <button
            type="button"
            onClick={handleFillSample}
            className="text-xs px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-50"
          >
            Try sample recipe
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Recipe title
            </label>
            <input
              type="text"
              className="w-full rounded-md border-gray-300 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Thanksgiving Turkey"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Recipe written for (headcount)
            </label>
            <input
              type="number"
              className="w-full rounded-md border-gray-300 text-sm"
              value={baseHeadcount}
              min={1}
              onChange={(e) => setBaseHeadcount(Number(e.target.value || 1))}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Feed this many people
            </label>
            <input
              type="number"
              className="w-full rounded-md border-gray-300 text-sm"
              value={targetHeadcount}
              min={1}
              onChange={(e) => setTargetHeadcount(Number(e.target.value || 1))}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Serve time
          </label>
          <input
            type="datetime-local"
            className="w-full max-w-xs rounded-md border-gray-300 text-sm"
            value={serveTime}
            onChange={(e) => setServeTime(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Recipe (ingredients + directions)
          </label>
          <textarea
            className="w-full min-h-[200px] rounded-md border-gray-300 text-sm font-mono"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? "Cooking up your plan..." : "Generate Game Plan"}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default RecipeForm;
