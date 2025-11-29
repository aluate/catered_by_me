-- Migration: Add onboarding_completed and public_token fields
-- Run this in Supabase SQL Editor

-- Add onboarding_completed to profiles
alter table public.profiles
add column if not exists onboarding_completed boolean default false;

-- Add public_token to events for shareable links
alter table public.events
add column if not exists public_token uuid;

-- Create index for public_token lookups
create index if not exists idx_events_public_token on public.events(public_token)
where public_token is not null;

-- Add comment
comment on column public.profiles.onboarding_completed is 'Whether user has completed the first-run onboarding tour';
comment on column public.events.public_token is 'UUID token for shareable read-only links';

