"use client";

import React from "react";
import type { Schedule, ScheduleLane } from "../lib/api";

type Props = {
  schedule: Schedule | null;
};

const STATION_ORDER = ["prep", "stove", "oven", "counter", "passive"];

function sortLanes(lanes: ScheduleLane[]): ScheduleLane[] {
  return [...lanes].sort((a, b) => {
    const ia = STATION_ORDER.indexOf(a.station);
    const ib = STATION_ORDER.indexOf(b.station);
    const sa = ia === -1 ? 999 : ia;
    const sb = ib === -1 ? 999 : ib;
    return sa - sb || a.station.localeCompare(b.station);
  });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const ScheduleView: React.FC<Props> = ({ schedule }) => {
  if (!schedule) {
    return (
      <div className="mt-8 text-sm text-gray-500">
        No schedule generated yet. Paste a recipe and hit &ldquo;Generate Game
        Plan&rdquo;.
      </div>
    );
  }

  const serve = new Date(schedule.serve_time);
  const serveLabel = serve.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const sortedLanes = sortLanes(schedule.lanes);

  return (
    <section id="schedule">
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-semibold">Your game plan</h2>
        <p className="text-sm text-text-muted">
          Serving at <span className="font-medium">{serveLabel}</span>
        </p>
        {schedule.notes && (
          <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
            {schedule.notes}
          </p>
        )}
      </div>

      {/* Grid of lanes: each column = station */}
      <div className="overflow-x-auto">
        <div
          className="grid gap-4 min-w-full"
          style={{
            gridTemplateColumns: `repeat(${sortedLanes.length}, minmax(200px, 1fr))`,
          }}
        >
          {sortedLanes.map((lane) => (
            <div
              key={lane.station}
              className="bg-card border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700 mb-3">
                {lane.station.charAt(0).toUpperCase() + lane.station.slice(1)}
              </h3>
              <ul className="space-y-2 text-sm">
                {lane.tasks
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(a.start_time).getTime() -
                      new Date(b.start_time).getTime()
                  )
                  .map((task) => (
                    <li
                      key={task.id}
                      className="border border-gray-100 rounded-lg px-3 py-2 bg-gray-50"
                    >
                      <div className="text-xs font-semibold font-mono text-gray-600 mb-0.5">
                        {formatTime(task.start_time)}–{formatTime(task.end_time)}
                      </div>
                      <div className="font-medium">{task.label}</div>
                      {task.notes && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          {task.notes}
                        </div>
                      )}
                    </li>
                  ))}
                {lane.tasks.length === 0 && (
                  <li className="text-xs text-gray-400 italic">
                    No tasks for this station.
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScheduleView;
