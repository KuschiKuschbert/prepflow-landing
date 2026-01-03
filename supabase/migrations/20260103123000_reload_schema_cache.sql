-- Force PostgREST schema cache reload
-- This handles the "could not find the table 'public.customers' in the schema cache" error
NOTIFY pgrst, 'reload schema';
