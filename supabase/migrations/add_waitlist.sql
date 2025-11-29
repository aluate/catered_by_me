-- Migration: Add waitlist table for email capture
-- Run this in Supabase SQL Editor

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  wants_tips boolean default false,
  source text, -- "landing_page", "signup", etc.
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Index for email lookups
create index if not exists idx_waitlist_email on public.waitlist(email);

-- No RLS needed - this is public data collection
-- But we can add a policy if we want to restrict access later

comment on table public.waitlist is 'Email waitlist for marketing and beta access';

