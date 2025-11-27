from datetime import datetime, timedelta
from apps.api.models.recipes import Recipe, Ingredient, AtomicTask
from apps.api.services.scheduler import build_schedule


def test_build_schedule_basic():
    """Test basic schedule generation with a simple recipe."""
    # Create a simple recipe
    recipe = Recipe(
        id="test-recipe-1",
        title="Test Recipe",
        headcount=4,
        ingredients=[
            Ingredient(name="onions", quantity=2.0, unit="whole"),
            Ingredient(name="butter", quantity=4.0, unit="tbsp"),
        ],
        tasks=[
            AtomicTask(
                id="task-1",
                label="Dice onions",
                duration_minutes=5,
                station="prep",
                depends_on=[]
            ),
            AtomicTask(
                id="task-2",
                label="Melt butter in pan",
                duration_minutes=3,
                station="stove",
                depends_on=["task-1"]
            ),
            AtomicTask(
                id="task-3",
                label="Sauté onions",
                duration_minutes=10,
                station="stove",
                depends_on=["task-2"]
            ),
        ],
        source="test"
    )
    
    serve_time = datetime(2024, 1, 1, 18, 0)  # 6 PM
    
    schedule = build_schedule([recipe], serve_time)
    
    # Assertions
    assert schedule.serve_time == serve_time
    assert len(schedule.lanes) > 0
    
    # Check that all tasks are scheduled
    all_scheduled_tasks = []
    for lane in schedule.lanes:
        all_scheduled_tasks.extend(lane.tasks)
    
    assert len(all_scheduled_tasks) == 3
    
    # Check that all tasks have valid times
    for lane in schedule.lanes:
        for task in lane.tasks:
            assert task.start_time < task.end_time
            assert task.end_time <= serve_time
    
    # Check no overlapping tasks in same station
    for lane in schedule.lanes:
        tasks = sorted(lane.tasks, key=lambda t: t.start_time)
        for i in range(len(tasks) - 1):
            assert tasks[i].end_time <= tasks[i + 1].start_time


def test_build_schedule_multiple_recipes():
    """Test schedule generation with multiple recipes."""
    recipe1 = Recipe(
        id="recipe-1",
        title="Roasted Chicken",
        headcount=4,
        ingredients=[],
        tasks=[
            AtomicTask(
                id="task-1",
                label="Preheat oven",
                duration_minutes=10,
                station="oven",
                depends_on=[]
            ),
            AtomicTask(
                id="task-2",
                label="Season chicken",
                duration_minutes=5,
                station="prep",
                depends_on=[]
            ),
        ],
        source="test"
    )
    
    recipe2 = Recipe(
        id="recipe-2",
        title="Mashed Potatoes",
        headcount=4,
        ingredients=[],
        tasks=[
            AtomicTask(
                id="task-3",
                label="Peel potatoes",
                duration_minutes=10,
                station="prep",
                depends_on=[]
            ),
            AtomicTask(
                id="task-4",
                label="Boil potatoes",
                duration_minutes=20,
                station="stove",
                depends_on=["task-3"]
            ),
        ],
        source="test"
    )
    
    serve_time = datetime(2024, 1, 1, 19, 0)  # 7 PM
    
    schedule = build_schedule([recipe1, recipe2], serve_time)
    
    assert schedule.serve_time == serve_time
    assert len(schedule.lanes) > 0
    
    # Should have tasks from both recipes
    all_tasks = []
    for lane in schedule.lanes:
        all_tasks.extend(lane.tasks)
    
    assert len(all_tasks) == 4
    
    # Verify all tasks are before serve time
    for lane in schedule.lanes:
        for task in lane.tasks:
            assert task.end_time <= serve_time

