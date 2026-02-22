-- Add location column to functions table
ALTER TABLE public.functions ADD COLUMN IF NOT EXISTS location TEXT;
