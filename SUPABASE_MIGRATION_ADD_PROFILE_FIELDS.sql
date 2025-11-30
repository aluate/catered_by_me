-- Migration: Add subscription fields to profiles table
-- Run this in Supabase SQL Editor after running the main schema.sql

-- Add subscription-related fields to profiles table
alter table public.profiles
  add column if not exists tier text default 'free' check (tier in ('free', 'pro', 'holiday_pass')),
  add column if not exists subscription_status text,
  add column if not exists renewal_date timestamp with time zone,
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text;

-- Add index for tier lookups (optional, but helpful)
create index if not exists idx_profiles_tier on public.profiles(tier);

-- Verify the changes
select column_name, data_type, column_default
from information_schema.columns
where table_schema = 'public' and table_name = 'profiles'
order by ordinal_position;

