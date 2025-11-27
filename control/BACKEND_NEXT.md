# Catered By Me – Backend v0.2 Plan

## Goal

Upgrade the existing FastAPI skeleton into a more realistic MVP:

- Better parsing for ingredients and steps
- Integrate scaling into the workflow
- Support multiple recipes in a single schedule
- Make the scheduler slightly smarter while still simple

---

## 1. Parsing improvements (`apps/api/services/parsing.py`)

### 1.1 Ingredient parsing

- Improve the regex so we handle formats like:
  - "2 lb potatoes"
  - "1 1/2 cups milk"
  - "4 tbsp butter, softened"
  - "Salt and pepper, to taste"

- Behavior:
  - Extract `quantity` as float where possible (handle fractions like 1/2, 1 1/4)
  - Extract `unit` from a small whitelist:
    - ["g", "kg", "lb", "oz", "cup", "cups", "tbsp", "tsp", "clove", "cloves", "stick", "sticks", "ml", "l"]
  - If no obvious quantity, leave `quantity=None` and `unit=None`
  - Keep the rest as `name` and `notes`

### 1.2 Step parsing → AtomicTask

- For each step line:
  - Try to detect action verbs:
    - PREP: ["chop", "dice", "slice", "peel", "mince", "mix", "whisk", "stir", "combine"]
    - STOVE: ["sauté", "boil", "simmer", "fry", "reduce"]
    - OVEN: ["bake", "roast", "broil"]
  - Station mapping:
    - if oven verb → "oven"
    - elif stove verb → "stove"
    - elif any prep verb → "prep"
    - else → "prep"

- Duration heuristic:
  - If the step mentions a time like "20 minutes", "1 hour":
    - Use that for `duration_minutes`
  - Otherwise:
    - default 10 minutes for oven/stove tasks
    - default 5 minutes for prep tasks

- Each step becomes 1 `AtomicTask` for now.
- Use `uuid4()` for `id`.

---

## 2. Scaling integration (`apps/api/services/scaling.py` + routes)

### 2.1 Keep `scale_recipe()` as is, but:

- Add a helper function:

```python
def parse_and_scale_text_recipe(
    title: str | None,
    base_headcount: int,
    target_headcount: int,
    raw_text: str,
) -> Recipe:
    ...
```

Behavior:

* Call `parse_text_recipe(title, base_headcount, raw_text)`
* Then call `scale_recipe(parsed_recipe, target_headcount)`
* Return the scaled `Recipe`

### 2.2 Extend `/recipes/parse-text` endpoint

* Allow request body to pass:
  * `base_headcount: int` (what the recipe is written for)
  * `target_headcount: int | None` (how many people we actually want to feed)
* If `target_headcount` is provided and different from `base_headcount`, use `parse_and_scale_text_recipe` instead of plain `parse_text_recipe`.

---

## 3. Schedule engine upgrades (`apps/api/services/scheduler.py`)

### 3.1 Multi-recipe support

* `build_schedule(recipes, serve_time)` should expect multiple recipes commonly.
* Combine tasks from all recipes into one list.
* When building schedule lanes:
  * Group tasks by `station`
  * For each station, sort tasks so:
    * OVEN/STOVE tasks are closer to serve_time
    * PREP tasks earlier
  * Keep the simple backwards scheduling approach:
    * Start from `serve_time`
    * Assign each task in reverse order, subtracting `duration_minutes`

### 3.2 Simple "prep window start"

* Add an optional `prep_start` parameter to `build_schedule` (or at least plan for it):
  * If provided, don't schedule anything before `prep_start`
  * If tasks would end up before `prep_start`, leave a note in `Schedule.notes` like:
    * "Warning: total prep time exceeds available window by X minutes."

### 3.3 No overlap per station

* After scheduling, in each lane:
  * Ensure tasks sorted by `start_time`
  * If any overlap is found, shift earlier tasks back in time just enough to remove overlaps.

---

## 4. API cleanups

### 4.1 CORS

* Add CORS middleware in `apps/api/main.py`:
  * Allow `http://localhost:3000`
  * Later we will also allow the production Next.js domain.

### 4.2 Error handling

* If the parser fails to find any ingredients or tasks, raise an HTTP 400 with a friendly message.
* If `serve_time` is missing or invalid, return HTTP 400.

---

## 5. Tests (`tests/test_scheduler.py`)

* Add a test case with:
  * Two recipes
  * Mixed prep/oven/stove tasks
* Assert:
  * All tasks end at or before `serve_time`
  * No overlaps within each station lane
  * The number of scheduled tasks equals the number of atomic tasks

