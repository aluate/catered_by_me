from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ScheduledTask(BaseModel):
    """A task scheduled at a specific time."""
    id: str
    label: str
    station: str
    start_time: datetime
    end_time: datetime
    notes: Optional[str] = None


class ScheduleLane(BaseModel):
    """A swim lane for a specific cooking station."""
    station: str  # "prep", "oven", etc.
    tasks: list[ScheduledTask]


class Schedule(BaseModel):
    """A complete cooking schedule with lanes for each station."""
    serve_time: datetime
    lanes: list[ScheduleLane]
    notes: Optional[str] = None
    warnings: list[str] = []  # Warning codes like "oven_overbooked", "prep_window_too_short"

