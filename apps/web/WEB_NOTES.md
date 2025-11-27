# Catered By Me – Web App Notes

## Goal

Minimal but real web UI to:

1. Paste raw recipe text
2. Choose headcount + serve time
3. Get a readable game plan grouped by station (prep / stove / oven / counter / passive)

---

## 1. API base URL handling

- Use `NEXT_PUBLIC_API_BASE_URL` env var.
- In development:
  - `NEXT_PUBLIC_API_BASE_URL=http://localhost:8003`
- In production:
  - Set this to the deployed FastAPI URL (Render/Railway).

`src/lib/api.ts` should read:

```ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8003";
```

---

## 2. UX improvements

### 2.1 RecipeForm

* Add simple validation:
  * Headcount > 0
  * Serve time not empty
  * Raw text not empty
* Show:
  * Loading state on submit
  * Error message if either API call fails
* After schedule is generated:
  * Scroll the page down to the schedule section.

### 2.2 ScheduleView

* Format times as `HH:MM` in the user's local time.
* Sort lanes by an explicit order:
  * ["prep", "stove", "oven", "counter", "passive"]
* Within each lane:
  * Tasks sorted by `start_time`.

Visual layout:

* Simple stacked cards:
  * Big header: "Game plan"
  * Subtitle: `Serving at {time}`
  * Each lane in its own card with:
    * Lane title
    * List of tasks:
      * `{start}–{end}: {label}`

Later we can evolve this into a real horizontal swim-lane/grid.

---

## 3. Dev shortcuts

* Add a small "Try sample recipe" button that fills:
  * title: "Sample Mashed Potatoes"
  * headcount: 6
  * serve time: 2 hours from now
  * raw text: a known-good recipe blob
* This makes it easy to test end-to-end without copy/paste every time.

---

## 4. Nice-to-haves (future)

* Allow multiple recipes on the page (add another textarea or a "+ Add another recipe" button)
* Tag each task with which dish it belongs to and display that in the UI
* Add a toggle for "show by station" vs "show in pure chronological list"

