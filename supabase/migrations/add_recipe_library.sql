-- Recipe Library Migration
-- Add public recipe library table for browseable recipes

-- Recipe library table for public recipes
create table if not exists public.recipe_library (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('main', 'side', 'dessert', 'app', 'other')),
  base_headcount integer not null default 4,
  prep_time_minutes integer default 0,
  cook_time_minutes integer default 0,
  method text not null check (method in ('oven', 'stovetop', 'no_cook', 'mixed')),
  day_before_ok boolean default false,
  source_type text not null default 'library',
  source_raw jsonb,
  normalized jsonb not null, -- Parsed Recipe model as JSON
  description text,
  image_url text,
  tags text[] default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.recipe_library enable row level security;

-- Public recipes: everyone can read (no auth required)
create policy "Public recipes are viewable by everyone"
  on public.recipe_library for select
  using (true);

-- Only service role can manage library recipes
-- (RLS will be bypassed by service role key for inserts/updates/deletes)

-- Indexes for performance
create index idx_recipe_library_category on public.recipe_library(category);
create index idx_recipe_library_tags on public.recipe_library using gin(tags);
create index idx_recipe_library_title on public.recipe_library(title);

-- Full-text search index
create index idx_recipe_library_search on public.recipe_library using gin(
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))
);

-- Trigger for updated_at
create trigger update_recipe_library_updated_at before update on public.recipe_library
  for each row execute procedure public.update_updated_at_column();

