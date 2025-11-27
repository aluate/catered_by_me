const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8003";

export type Ingredient = {
  name: string;
  quantity: number | null;
  unit: string | null;
  notes: string | null;
  normalized_grams: number | null;
};

export type AtomicTask = {
  id: string;
  label: string;
  duration_minutes: number;
  station: string;
  depends_on: string[];
  notes: string | null;
};

export type Recipe = {
  id: string;
  title: string;
  headcount: number;
  ingredients: Ingredient[];
  tasks: AtomicTask[];
  source: string | null;
};

export type ScheduledTask = {
  id: string;
  label: string;
  station: string;
  start_time: string; // ISO
  end_time: string;   // ISO
  notes: string | null;
};

export type ScheduleLane = {
  station: string;
  tasks: ScheduledTask[];
};

export type Schedule = {
  serve_time: string;
  lanes: ScheduleLane[];
  notes: string | null;
};

async function apiFetch<T>(path: string, options: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let message = `API error: ${res.status}`;
    try {
      const body = await res.json();
      if (body.detail) {
        message = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
      }
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

export async function parseTextRecipe(input: {
  title?: string;
  base_headcount: number;
  target_headcount?: number;
  raw_text: string;
}): Promise<Recipe> {
  return apiFetch<Recipe>("/recipes/parse-text", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function generateSchedule(input: {
  recipes: Recipe[];
  serve_time: string; // ISO
}): Promise<Schedule> {
  return apiFetch<Schedule>("/schedule/generate", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
