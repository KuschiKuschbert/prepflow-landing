-- Add address column to customers table
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS address TEXT;
