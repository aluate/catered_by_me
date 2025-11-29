from datetime import datetime, timedelta
from typing import Iterable, Optional
from collections import defaultdict

from ..models.recipes import Recipe
from ..models.schedule import Schedule, ScheduleLane, ScheduledTask


def build_schedule(
    recipes: Iterable[Recipe],
    serve_time: datetime,
    user_profile: Optional[dict] = None  # Optional profile with oven_capacity_lbs, burner_count
) -> Schedule:
    """
    Build a backwards-planned cooking schedule from recipes and serve time.
    
    This is v0 of the scheduling engine. It:
    - Combines all tasks from all recipes
    - Groups tasks by station
    - Schedules backwards from serve_time
    - Prioritizes oven/stove tasks closer to serve time
    - Schedules prep tasks earlier
    
    Future improvements:
    - Handle task dependencies properly
    - Optimize for idle time minimization
    - Critical path analysis
    - Multi-station coordination
    """
    # Collect all tasks from all recipes
    all_tasks = []
    for recipe in recipes:
        all_tasks.extend(recipe.tasks)
    
    if not all_tasks:
        return Schedule(
            serve_time=serve_time,
            lanes=[],
            notes="No tasks to schedule"
        )
    
    # Group tasks by station
    tasks_by_station = defaultdict(list)
    for task in all_tasks:
        tasks_by_station[task.station].append(task)
    
    # Simple priority: oven and stove tasks should be scheduled later
    # Prep tasks should be scheduled earlier
    station_priority = {
        "oven": 1,      # schedule last (closest to serve time)
        "stove": 2,
        "counter": 3,
        "prep": 4,      # schedule first (earliest)
        "passive": 5,   # can be scheduled anywhere
    }
    
    # Sort stations by priority (lower number = schedule later)
    sorted_stations = sorted(
        tasks_by_station.keys(),
        key=lambda s: station_priority.get(s, 99)
    )
    
    # Build schedule backwards from serve_time
    # Track current time pointer per station
    station_pointers = {}
    
    # First pass: schedule high-priority stations (oven, stove) backwards
    for station in sorted_stations:
        if station_priority.get(station, 99) <= 2:
            current_time = serve_time
            for task in tasks_by_station[station]:
                end_time = current_time
                start_time = end_time - timedelta(minutes=task.duration_minutes)
                
                # Store the earliest start time for this station
                if station not in station_pointers or start_time < station_pointers[station]:
                    station_pointers[station] = start_time
                
                current_time = start_time
    
    # Second pass: schedule prep and other tasks, working backwards from
    # the earliest time we need the high-priority stations
    earliest_high_priority = min(
        station_pointers.values(),
        default=serve_time - timedelta(hours=2)
    )
    
    for station in sorted_stations:
        if station_priority.get(station, 99) > 2:
            # Start scheduling from earliest_high_priority, working backwards
            current_time = earliest_high_priority
            for task in tasks_by_station[station]:
                end_time = current_time
                start_time = end_time - timedelta(minutes=task.duration_minutes)
                current_time = start_time
    
    # Now build the actual scheduled tasks
    scheduled_tasks_by_station = defaultdict(list)
    
    for station in sorted_stations:
        current_time = serve_time if station_priority.get(station, 99) <= 2 else earliest_high_priority
        
        for task in tasks_by_station[station]:
            end_time = current_time
            start_time = end_time - timedelta(minutes=task.duration_minutes)
            
            scheduled_task = ScheduledTask(
                id=task.id,
                label=task.label,
                station=task.station,
                start_time=start_time,
                end_time=end_time,
                notes=task.notes
            )
            
            scheduled_tasks_by_station[station].append(scheduled_task)
            current_time = start_time
    
    # Create lanes
    lanes = []
    for station in sorted_stations:
        tasks = scheduled_tasks_by_station[station]
        # Sort by start_time (earliest first)
        tasks.sort(key=lambda t: t.start_time)
        lanes.append(ScheduleLane(station=station, tasks=tasks))
    
    # Check for capacity issues and generate warnings
    warnings = check_capacity_issues(lanes, serve_time, user_profile)
    
    return Schedule(
        serve_time=serve_time,
        lanes=lanes,
        notes=f"Scheduled {len(all_tasks)} tasks across {len(lanes)} stations",
        warnings=warnings
    )


def check_capacity_issues(
    lanes: list[ScheduleLane],
    serve_time: datetime,
    user_profile: Optional[dict] = None
) -> list[str]:
    """
    Analyze schedule for capacity issues and return warning codes.
    
    Checks:
    - Oven overbooking (multiple tasks overlapping)
    - Prep window too short (total prep time exceeds available window)
    - Too many concurrent tasks
    - Stove overbooking (if burner_count is set)
    """
    warnings = []
    
    # Find oven lane
    oven_lane = next((lane for lane in lanes if lane.station == "oven"), None)
    if oven_lane and len(oven_lane.tasks) > 0:
        # Check for overlapping oven tasks (assuming 1 oven by default)
        oven_tasks = sorted(oven_lane.tasks, key=lambda t: t.start_time)
        for i in range(len(oven_tasks) - 1):
            current = oven_tasks[i]
            next_task = oven_tasks[i + 1]
            
            # If tasks overlap, we have an oven conflict
            if current.end_time > next_task.start_time:
                warnings.append("oven_overbooked")
                break
        
        # Check if all tasks are oven with no prep time
        prep_lane = next((lane for lane in lanes if lane.station == "prep"), None)
        if not prep_lane or len(prep_lane.tasks) == 0:
            # All oven, no prep - check if there's enough time before first oven task
            first_oven_task = oven_tasks[0]
            time_before_oven = (first_oven_task.start_time - serve_time).total_seconds() / 60
            
            # If first oven task starts very close to serve time, warn
            if time_before_oven < 30:  # Less than 30 minutes before serve time
                warnings.append("all_oven_no_prep")
    
    # Check prep window
    prep_lane = next((lane for lane in lanes if lane.station == "prep"), None)
    if prep_lane and len(prep_lane.tasks) > 0:
        # Find earliest prep task and latest prep task
        prep_tasks = sorted(prep_lane.tasks, key=lambda t: t.start_time)
        earliest_prep = prep_tasks[0]
        latest_prep = prep_tasks[-1]
        
        # Total prep time needed
        total_prep_time = sum(task.duration_minutes for task in prep_tasks)
        
        # Available window (from earliest prep start to serve time)
        available_window = (serve_time - earliest_prep.start_time).total_seconds() / 60
        
        # If total prep time is close to or exceeds available window, warn
        if total_prep_time > available_window * 0.9:  # Using 90% threshold
            warnings.append("prep_window_too_short")
    
    # Check stove capacity if user has burner_count set
    if user_profile and user_profile.get("burner_count"):
        burner_count = user_profile["burner_count"]
        stove_lane = next((lane for lane in lanes if lane.station == "stove"), None)
        if stove_lane and len(stove_lane.tasks) > burner_count:
            # Check for overlapping tasks
            stove_tasks = sorted(stove_lane.tasks, key=lambda t: t.start_time)
            overlapping_count = 0
            for i in range(len(stove_tasks) - 1):
                current = stove_tasks[i]
                next_task = stove_tasks[i + 1]
                if current.end_time > next_task.start_time:
                    overlapping_count += 1
            
            if overlapping_count >= burner_count:
                warnings.append("capacity_overload")
    
    # Check for too many complex recipes (heuristic: many tasks)
    total_tasks = sum(len(lane.tasks) for lane in lanes)
    if total_tasks > 20:  # Arbitrary threshold
        warnings.append("too_many_projects")
    
    # Remove duplicates
    return list(set(warnings))

