-- Run this in your Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/yzrgwyolysmmmllvnxrz/sql

CREATE TABLE public.ai_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  date DATE NOT NULL,
  tier TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_usage_user_date ON public.ai_usage(user_id, date);
