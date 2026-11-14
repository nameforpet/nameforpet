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

-- 5. Allow inserts & updates (for seeding and catalog additions)
drop policy if exists "Allow insert with service key" on public.pet_names;
create policy "Allow insert with service key"
  on public.pet_names
  for insert
  with check (true);

drop policy if exists "Allow update with service key" on public.pet_names;
create policy "Allow update with service key"
  on public.pet_names
  for update
  using (true)
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

-- ========================================================
-- 7. Orders Table (Pet Collar Bands)
-- ========================================================
create table if not exists public.orders (
  id text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  shipping_address text not null,
  city text not null,
  postal_code text,
  pet_name text not null,
  pet_species text default 'other',
  pet_image text,
  band_color text not null,
  band_material text,
  collar_size text not null,
  custom_engraving_text text,
  payment_method text default 'Cash on Delivery',
  order_total_lkr numeric default 2850,
  status text default 'pending',
  notes text
);

alter table public.orders enable row level security;

drop policy if exists "Allow public access to orders" on public.orders;
create policy "Allow public access to orders"
  on public.orders
  for all
  using (true)
  with check (true);

-- ========================================================
-- 8. Registered Users Table (For Sign In / Sign Up)
-- ========================================================
create table if not exists public.registered_users (
  id text primary key,
  name text not null,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_login_at timestamp with time zone default timezone('utc'::text, now()) not null,
  role text default 'user',
  saved_names_count integer default 0,
  orders_count integer default 0,
  provider text default 'email'
);

alter table public.registered_users enable row level security;

drop policy if exists "Allow public access to registered_users" on public.registered_users;
create policy "Allow public access to registered_users"
  on public.registered_users
  for all
  using (true)
  with check (true);

-- ========================================================
-- 9. Contact Messages Table
-- ========================================================
create table if not exists public.contact_messages (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  subject text,
  message text not null
);

alter table public.contact_messages enable row level security;

drop policy if exists "Allow public insert on contact_messages" on public.contact_messages;
create policy "Allow public insert on contact_messages"
  on public.contact_messages
  for insert
  with check (true);
