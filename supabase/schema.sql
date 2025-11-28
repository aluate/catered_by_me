-- Catered By Me - Phase 3 Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  default_headcount integer,
  oven_capacity_lbs integer,
  burner_count integer,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Profiles policies: users can read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Recipes table
create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  category text not null check (category in ('main', 'side', 'dessert', 'app', 'other')),
  base_headcount integer not null,
  prep_time_minutes integer default 0,
  cook_time_minutes integer default 0,
  method text not null check (method in ('oven', 'stovetop', 'no_cook', 'mixed')),
  day_before_ok boolean default false,
  source_type text not null check (source_type in ('text', 'url', 'pdf', 'image')),
  source_raw jsonb,
  normalized jsonb,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on recipes
alter table public.recipes enable row level security;

-- Recipes policies: users can only see/edit their own recipes
create policy "Users can view own recipes"
  on public.recipes for select
  using (auth.uid() = user_id);

create policy "Users can create own recipes"
  on public.recipes for insert
  with check (auth.uid() = user_id);

create policy "Users can update own recipes"
  on public.recipes for update
  using (auth.uid() = user_id);

create policy "Users can delete own recipes"
  on public.recipes for delete
  using (auth.uid() = user_id);

-- Events table
create table public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  event_type text not null check (event_type in ('prep_week', 'event')),
  event_date timestamp with time zone,
  headcount integer,
  location text,
  vibe text check (vibe in ('chill', 'formal', 'family_chaos')),
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on events
alter table public.events enable row level security;

-- Events policies: users can only see/edit their own events
create policy "Users can view own events"
  on public.events for select
  using (auth.uid() = user_id);

create policy "Users can create own events"
  on public.events for insert
  with check (auth.uid() = user_id);

create policy "Users can update own events"
  on public.events for update
  using (auth.uid() = user_id);

create policy "Users can delete own events"
  on public.events for delete
  using (auth.uid() = user_id);

-- Event recipes join table
create table public.event_recipes (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  target_headcount integer not null,
  course_order integer default 0,
  is_primary boolean default false,
  created_at timestamp with time zone default now(),
  unique(event_id, recipe_id)
);

-- Enable RLS on event_recipes
alter table public.event_recipes enable row level security;

-- Event recipes policies: users can only see/edit recipes for their own events
create policy "Users can view event recipes for own events"
  on public.event_recipes for select
  using (
    exists (
      select 1 from public.events
      where events.id = event_recipes.event_id
      and events.user_id = auth.uid()
    )
  );

create policy "Users can manage event recipes for own events"
  on public.event_recipes for all
  using (
    exists (
      select 1 from public.events
      where events.id = event_recipes.event_id
      and events.user_id = auth.uid()
    )
  );

-- Indexes for performance
create index idx_recipes_user_id on public.recipes(user_id);
create index idx_events_user_id on public.events(user_id);
create index idx_events_event_date on public.events(event_date);
create index idx_event_recipes_event_id on public.event_recipes(event_id);
create index idx_event_recipes_recipe_id on public.event_recipes(recipe_id);

-- Function to automatically create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile when user signs up
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_profiles_updated_at before update on public.profiles
  for each row execute procedure public.update_updated_at_column();

create trigger update_recipes_updated_at before update on public.recipes
  for each row execute procedure public.update_updated_at_column();

create trigger update_events_updated_at before update on public.events
  for each row execute procedure public.update_updated_at_column();

