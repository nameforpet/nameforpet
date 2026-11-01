-- ========================================================
-- loveforpet.com - Supabase Database Schema
-- Run this script in the Supabase SQL Editor
-- ========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create table for pet names across all languages
create table if not exists public.pet_names (
  id text primary key,
  name text not null,
  meaning text not null,
  origin_language text not null,
  pronunciation text,
  gender text check (gender in ('male', 'female', 'unisex')),
  species text[] default array['any'],
  color_tags text[] default array[]::text[],
  vibe_tags text[] default array[]::text[],
  popularity integer default 80 check (popularity between 1 and 100),
  fun_fact text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create indexes for high-speed AI queries & multi-language lookups
create index if not exists idx_pet_names_language on public.pet_names (origin_language);
create index if not exists idx_pet_names_gender on public.pet_names (gender);
create index if not exists idx_pet_names_popularity on public.pet_names (popularity desc);
create index if not exists idx_pet_names_species on public.pet_names using gin (species);
create index if not exists idx_pet_names_colors on public.pet_names using gin (color_tags);
create index if not exists idx_pet_names_vibes on public.pet_names using gin (vibe_tags);

-- 3. Enable Row Level Security (RLS)
alter table public.pet_names enable row level security;

-- 4. Allow public read access to all pet names
drop policy if exists "Allow public read access to pet names" on public.pet_names;
create policy "Allow public read access to pet names"
  on public.pet_names
  for select
  using (true);

-- 5. (Optional) Allow authenticated admins or service role to insert/update names
drop policy if exists "Allow insert with service key" on public.pet_names;
create policy "Allow insert with service key"
  on public.pet_names
  for insert
  with check (true);

-- 6. Table for user-saved favorite pet names
create table if not exists public.user_favorites (
  id uuid default uuid_generate_v4() primary key,
  pet_name_id text references public.pet_names(id) on delete cascade,
  session_id text not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_favorites enable row level security;

drop policy if exists "Allow public access to user_favorites" on public.user_favorites;
create policy "Allow public access to user_favorites"
  on public.user_favorites
  for all
  using (true)
  with check (true);
