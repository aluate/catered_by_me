from datetime import datetime, timedelta
from typing import Iterable
from collections import defaultdict

from ..models.recipes import Recipe
from ..models.schedule import Schedule, ScheduleLane, ScheduledTask


def build_schedule(recipes: Iterable[Recipe], serve_time: datetime) -> Schedule:
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
    
    return Schedule(
        serve_time=serve_time,
        lanes=lanes,
        notes=f"Scheduled {len(all_tasks)} tasks across {len(lanes)} stations"
    )

