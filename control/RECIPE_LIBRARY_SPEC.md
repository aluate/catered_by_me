# Recipe Library Specification

**Purpose:** Public recipe library that all users can browse and search, with ability to save to their collection.

---

## Database Schema

### New Table: `recipe_library`

```sql
create table public.recipe_library (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('main', 'side', 'dessert', 'app', 'other')),
  base_headcount integer not null default 4,
  prep_time_minutes integer default 0,
  cook_time_minutes integer default 0,
  method text not null check (method in ('oven', 'stovetop', 'no_cook', 'mixed')),
  day_before_ok boolean default false,
  source_type text not null default 'library',
  source_raw jsonb, -- Original recipe text if available
  normalized jsonb not null, -- Parsed Recipe model
  description text, -- Brief description
  image_url text, -- Optional recipe image
  tags text[], -- Searchable tags
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.recipe_library enable row level security;

-- Public recipes: everyone can read
create policy "Public recipes are viewable by everyone"
  on public.recipe_library for select
  using (true);

-- Only admins can manage library recipes (for now, we'll seed manually)
```

---

## API Endpoints

### `GET /recipes/library`
List all public recipes with optional filtering.

**Query Params:**
- `category` - Filter by category
- `search` - Search in title, description, tags
- `limit` - Pagination limit
- `offset` - Pagination offset

**Response:**
```json
{
  "recipes": [...],
  "total": 25,
  "limit": 20,
  "offset": 0
}
```

### `GET /recipes/library/search?q=...`
Search recipes by keyword.

### `GET /recipes/library/:id`
Get single recipe details.

### `POST /recipes/library/:id/save`
Save a library recipe to user's collection.
- Requires authentication
- Creates a copy in user's `recipes` table
- User can then edit their copy

---

## Frontend Features

### Recipe Library Page: `/app/recipes/library`

**Features:**
- Search bar
- Category filters
- Grid/list view
- Recipe cards with preview
- "Save to My Recipes" button (requires login)
- Pagination

### Search Component
- Debounced search
- Search in title, description, tags
- Highlight matching terms
- Sort by relevance/name

---

## Seed Data

### Public Domain Recipes to Include

**Classics:**
1. Classic Chocolate Chip Cookies
2. Perfect Roast Chicken
3. Simple Tomato Sauce
4. Mashed Potatoes
5. Caesar Salad
6. Beef Stew
7. Pancakes
8. Scrambled Eggs
9. Grilled Cheese Sandwich
10. Mac and Cheese

**Holiday Classics:**
11. Thanksgiving Turkey
12. Stuffing
13. Green Bean Casserole
14. Pumpkin Pie
15. Apple Pie

**And more...**

All recipes should be:
- Public domain or original
- Properly formatted
- Include full ingredients and instructions
- Have realistic timing estimates

---

## User Flow

1. **Browse Library:**
   - Visit `/app/recipes/library`
   - Browse or search
   - View recipe details

2. **Save Recipe:**
   - Click "Save to My Recipes"
   - If not logged in, redirect to sign-in
   - Recipe copied to user's collection
   - User can edit their copy

3. **Use Recipe:**
   - Saved recipes appear in "My Recipes"
   - Can attach to events
   - Generate schedules as normal

---

## Implementation Steps

1. ✅ Create database schema
2. ⏳ Create API endpoints
3. ⏳ Seed 20+ recipes
4. ⏳ Build frontend page
5. ⏳ Add search functionality
6. ⏳ Test save feature

---

**Ready to implement!**

