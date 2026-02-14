-- AI Usage Table
-- Tracks daily usage per user for rate limiting purposes

create table if not exists ai_usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  date date not null default current_date,
  tier text not null check (tier in ('free', 'pro')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table ai_usage enable row level security;

-- Policies

-- 1. Insert Policy
drop policy if exists "Users can insert own usage" on ai_usage;
create policy "Users can insert own usage"
  on ai_usage for insert
  with check (auth.uid() = user_id);

-- 2. Select Policy
drop policy if exists "Users can view own usage" on ai_usage;
create policy "Users can view own usage"
  on ai_usage for select
  using (auth.uid() = user_id);

-- Note: Service Role (used by Edge Function for rate limiting) automatically bypasses RLS.
