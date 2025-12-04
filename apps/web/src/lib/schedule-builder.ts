/**
 * Schedule builder logic ported from Python
 * Builds backwards-planned cooking schedules from recipes
 */

import type { Recipe, AtomicTask } from "./recipe-parsing";

export interface ScheduledTask {
  id: string;
  label: string;
  station: string;
  start_time: string; // ISO
  end_time: string; // ISO
  notes: string | null;
}

export interface ScheduleLane {
  station: string;
  tasks: ScheduledTask[];
}

export interface Schedule {
  serve_time: string; // ISO
  lanes: ScheduleLane[];
  notes: string | null;
  warnings?: string[];
}

interface UserProfile {
  oven_capacity_lbs?: number | null;
  burner_count?: number | null;
}

/**
 * Build a backwards-planned cooking schedule from recipes and serve time
 */
export function buildSchedule(
  recipes: Recipe[],
  serveTime: Date,
  userProfile: UserProfile | null = null
): Schedule {
  // Collect all tasks from all recipes
  const allTasks: AtomicTask[] = [];
  for (const recipe of recipes) {
    allTasks.push(...recipe.tasks);
  }

  if (allTasks.length === 0) {
    return {
      serve_time: serveTime.toISOString(),
      lanes: [],
      notes: "No tasks to schedule",
    };
  }

  // Group tasks by station
  const tasksByStation = new Map<string, AtomicTask[]>();
  for (const task of allTasks) {
    if (!tasksByStation.has(task.station)) {
      tasksByStation.set(task.station, []);
    }
    tasksByStation.get(task.station)!.push(task);
  }

  // Simple priority: oven and stove tasks should be scheduled later
  // Prep tasks should be scheduled earlier
  const stationPriority: Record<string, number> = {
    oven: 1, // schedule last (closest to serve time)
    stove: 2,
    counter: 3,
    prep: 4, // schedule first (earliest)
    passive: 5, // can be scheduled anywhere
  };

  // Sort stations by priority (lower number = schedule later)
  const sortedStations = Array.from(tasksByStation.keys()).sort(
    (a, b) => (stationPriority[a] || 99) - (stationPriority[b] || 99)
  );

  // Build schedule backwards from serve_time
  // Track current time pointer per station
  const stationPointers = new Map<string, Date>();

  // First pass: schedule high-priority stations (oven, stove) backwards
  for (const station of sortedStations) {
    const priority = stationPriority[station] || 99;
    if (priority <= 2) {
      let currentTime = new Date(serveTime);
      const tasks = tasksByStation.get(station) || [];
      for (const task of tasks) {
        const endTime = new Date(currentTime);
        const startTime = new Date(
          endTime.getTime() - task.duration_minutes * 60 * 1000
        );

        // Store the earliest start time for this station
        const existing = stationPointers.get(station);
        if (!existing || startTime < existing) {
          stationPointers.set(station, startTime);
        }

        currentTime = startTime;
      }
    }
  }

  // Second pass: schedule prep and other tasks, working backwards from
  // the earliest time we need the high-priority stations
  const earliestHighPriority = Math.min(
    ...Array.from(stationPointers.values()).map((d) => d.getTime()),
    serveTime.getTime() - 2 * 60 * 60 * 1000 // default: 2 hours before
  );

  for (const station of sortedStations) {
    const priority = stationPriority[station] || 99;
    if (priority > 2) {
      // Start scheduling from earliest_high_priority, working backwards
      let currentTime = new Date(earliestHighPriority);
      const tasks = tasksByStation.get(station) || [];
      for (const task of tasks) {
        const endTime = new Date(currentTime);
        const startTime = new Date(
          endTime.getTime() - task.duration_minutes * 60 * 1000
        );
        currentTime = startTime;
      }
    }
  }

  // Now build the actual scheduled tasks
  const scheduledTasksByStation = new Map<string, ScheduledTask[]>();

  for (const station of sortedStations) {
    const priority = stationPriority[station] || 99;
    let currentTime =
      priority <= 2
        ? new Date(serveTime)
        : new Date(earliestHighPriority);

    const tasks = tasksByStation.get(station) || [];
    const scheduledTasks: ScheduledTask[] = [];

    for (const task of tasks) {
      const endTime = new Date(currentTime);
      const startTime = new Date(
        endTime.getTime() - task.duration_minutes * 60 * 1000
      );

      scheduledTasks.push({
        id: task.id,
        label: task.label,
        station: task.station,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        notes: task.notes,
      });

      currentTime = startTime;
    }

    // Sort by start_time (earliest first)
    scheduledTasks.sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );

    scheduledTasksByStation.set(station, scheduledTasks);
  }

  // Create lanes
  const lanes: ScheduleLane[] = sortedStations.map((station) => ({
    station,
    tasks: scheduledTasksByStation.get(station) || [],
  }));

  // Check for capacity issues and generate warnings
  const warnings = checkCapacityIssues(lanes, serveTime, userProfile);

  return {
    serve_time: serveTime.toISOString(),
    lanes,
    notes: `Scheduled ${allTasks.length} tasks across ${lanes.length} stations`,
    warnings,
  };
}

function checkCapacityIssues(
  lanes: ScheduleLane[],
  serveTime: Date,
  userProfile: UserProfile | null
): string[] {
  const warnings: string[] = [];

  // Find oven lane
  const ovenLane = lanes.find((lane) => lane.station === "oven");
  if (ovenLane && ovenLane.tasks.length > 0) {
    // Check for overlapping oven tasks (assuming 1 oven by default)
    const ovenTasks = [...ovenLane.tasks].sort(
      (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );
    for (let i = 0; i < ovenTasks.length - 1; i++) {
      const current = ovenTasks[i];
      const nextTask = ovenTasks[i + 1];

      // If tasks overlap, we have an oven conflict
      if (new Date(current.end_time) > new Date(nextTask.start_time)) {
        warnings.push("oven_overbooked");
        break;
      }
    }

    // Check if all tasks are oven with no prep time
    const prepLane = lanes.find((lane) => lane.station === "prep");
    if (!prepLane || prepLane.tasks.length === 0) {
      // All oven, no prep - check if there's enough time before first oven task
      const firstOvenTask = ovenTasks[0];
      const timeBeforeOven =
        (new Date(firstOvenTask.start_time).getTime() - serveTime.getTime()) /
        (60 * 1000);

      // If first oven task starts very close to serve time, warn
      if (timeBeforeOven < 30) {
        // Less than 30 minutes before serve time
        warnings.push("all_oven_no_prep");
      }
    }
  }

  // Check prep window
  const prepLane = lanes.find((lane) => lane.station === "prep");
  if (prepLane && prepLane.tasks.length > 0) {
        // Find earliest prep task
        const prepTasks = [...prepLane.tasks].sort(
          (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );
        const earliestPrep = prepTasks[0];

    // Total prep time needed
    const totalPrepTime = prepTasks.reduce(
      (sum, task) =>
        sum +
        (new Date(task.end_time).getTime() -
          new Date(task.start_time).getTime()) /
          (60 * 1000),
      0
    );

    // Available window (from earliest prep start to serve time)
    const availableWindow =
      (serveTime.getTime() - new Date(earliestPrep.start_time).getTime()) /
      (60 * 1000);

    // If total prep time is close to or exceeds available window, warn
    if (totalPrepTime > availableWindow * 0.9) {
      // Using 90% threshold
      warnings.push("prep_window_too_short");
    }
  }

  // Check stove capacity if user has burner_count set
  if (userProfile?.burner_count) {
    const burnerCount = userProfile.burner_count;
    const stoveLane = lanes.find((lane) => lane.station === "stove");
    if (stoveLane && stoveLane.tasks.length > burnerCount) {
      // Check for overlapping tasks
      const stoveTasks = [...stoveLane.tasks].sort(
        (a, b) =>
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );
      let overlappingCount = 0;
      for (let i = 0; i < stoveTasks.length - 1; i++) {
        const current = stoveTasks[i];
        const nextTask = stoveTasks[i + 1];
        if (new Date(current.end_time) > new Date(nextTask.start_time)) {
          overlappingCount++;
        }
      }

      if (overlappingCount >= burnerCount) {
        warnings.push("capacity_overload");
      }
    }
  }

  // Check for too many complex recipes (heuristic: many tasks)
  const totalTasks = lanes.reduce((sum, lane) => sum + lane.tasks.length, 0);
  if (totalTasks > 20) {
    // Arbitrary threshold
    warnings.push("too_many_projects");
  }

  // Remove duplicates
  return Array.from(new Set(warnings));
}

