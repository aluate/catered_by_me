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

// Recipe CRUD API functions
export type SavedRecipe = {
  id: string;
  user_id: string;
  title: string;
  category: "main" | "side" | "dessert" | "app" | "other";
  base_headcount: number;
  prep_time_minutes: number;
  cook_time_minutes: number;
  method: "oven" | "stovetop" | "no_cook" | "mixed";
  day_before_ok: boolean;
  source_type: "text" | "url" | "pdf" | "image";
  source_raw: Record<string, unknown> | null;
  normalized: Record<string, unknown> | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type RecipeCreateInput = {
  title: string;
  category: "main" | "side" | "dessert" | "app" | "other";
  base_headcount: number;
  prep_time_minutes?: number;
  cook_time_minutes?: number;
  method: "oven" | "stovetop" | "no_cook" | "mixed";
  day_before_ok?: boolean;
  source_type?: "text" | "url" | "pdf" | "image";
  source_raw?: Record<string, unknown>;
  normalized?: Record<string, unknown>;
  notes?: string;
};

export type RecipeUpdateInput = Partial<RecipeCreateInput>;

async function apiFetchWithAuth<T>(
  path: string,
  options: RequestInit,
  session: { access_token: string } | null
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
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

  if (res.status === 204) {
    return undefined as T; // No content
  }

  return res.json() as Promise<T>;
}

export async function listRecipes(session: { access_token: string } | null): Promise<SavedRecipe[]> {
  return apiFetchWithAuth<SavedRecipe[]>("/recipes", { method: "GET" }, session);
}

export async function getRecipe(
  recipeId: string,
  session: { access_token: string } | null
): Promise<SavedRecipe> {
  return apiFetchWithAuth<SavedRecipe>(`/recipes/${recipeId}`, { method: "GET" }, session);
}

export async function createRecipe(
  input: RecipeCreateInput,
  session: { access_token: string } | null
): Promise<SavedRecipe> {
  return apiFetchWithAuth<SavedRecipe>(
    "/recipes",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    session
  );
}

export async function updateRecipe(
  recipeId: string,
  input: RecipeUpdateInput,
  session: { access_token: string } | null
): Promise<SavedRecipe> {
  return apiFetchWithAuth<SavedRecipe>(
    `/recipes/${recipeId}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    },
    session
  );
}

export async function deleteRecipe(
  recipeId: string,
  session: { access_token: string } | null
): Promise<void> {
  return apiFetchWithAuth<void>(`/recipes/${recipeId}`, { method: "DELETE" }, session);
}

// Event API functions
export type SavedEvent = {
  id: string;
  user_id: string;
  name: string;
  event_type: "prep_week" | "event";
  event_date: string | null;
  headcount: number | null;
  location: string | null;
  vibe: "chill" | "formal" | "family_chaos" | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type EventWithRecipes = SavedEvent & {
  recipes: Array<{
    recipe_id: string;
    recipe_title: string;
    target_headcount: number;
    course_order: number;
    is_primary: boolean;
  }>;
};

export type EventCreateInput = {
  name: string;
  event_type: "prep_week" | "event";
  event_date?: string | null;
  headcount?: number | null;
  location?: string | null;
  vibe?: "chill" | "formal" | "family_chaos" | null;
  notes?: string | null;
};

export type EventUpdateInput = Partial<EventCreateInput>;

export type EventRecipeAttachInput = {
  recipe_id: string;
  target_headcount: number;
  course_order?: number;
  is_primary?: boolean;
};

export async function listEvents(session: { access_token: string } | null): Promise<SavedEvent[]> {
  return apiFetchWithAuth<SavedEvent[]>("/events", { method: "GET" }, session);
}

export async function getEvent(
  eventId: string,
  session: { access_token: string } | null
): Promise<EventWithRecipes> {
  return apiFetchWithAuth<EventWithRecipes>(`/events/${eventId}`, { method: "GET" }, session);
}

export async function createEvent(
  input: EventCreateInput,
  session: { access_token: string } | null
): Promise<SavedEvent> {
  return apiFetchWithAuth<SavedEvent>(
    "/events",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    session
  );
}

export async function updateEvent(
  eventId: string,
  input: EventUpdateInput,
  session: { access_token: string } | null
): Promise<SavedEvent> {
  return apiFetchWithAuth<SavedEvent>(
    `/events/${eventId}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    },
    session
  );
}

export async function deleteEvent(
  eventId: string,
  session: { access_token: string } | null
): Promise<void> {
  return apiFetchWithAuth<void>(`/events/${eventId}`, { method: "DELETE" }, session);
}

export async function attachRecipeToEvent(
  eventId: string,
  input: EventRecipeAttachInput,
  session: { access_token: string } | null
): Promise<void> {
  return apiFetchWithAuth<void>(
    `/events/${eventId}/recipes`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    session
  );
}

export async function detachRecipeFromEvent(
  eventId: string,
  recipeId: string,
  session: { access_token: string } | null
): Promise<void> {
  return apiFetchWithAuth<void>(
    `/events/${eventId}/recipes/${recipeId}`,
    { method: "DELETE" },
    session
  );
}

export async function generateEventPlan(
  eventId: string,
  serveTimeOverride?: string,
  session: { access_token: string } | null
): Promise<Schedule> {
  const params = serveTimeOverride ? `?serve_time=${encodeURIComponent(serveTimeOverride)}` : "";
  return apiFetchWithAuth<Schedule>(
    `/events/${eventId}/plan${params}`,
    { method: "POST" },
    session
  );
}