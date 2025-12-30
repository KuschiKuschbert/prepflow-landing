-- Create app_settings table
CREATE TABLE IF NOT EXISTS public.app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access"
ON public.app_settings
FOR SELECT
TO public
USING (true);

-- Allow updates only for service role (or specific admin roles if defined)
CREATE POLICY "Allow service role update"
ON public.app_settings
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Insert initial android version
INSERT INTO public.app_settings (key, value)
VALUES ('android_version', '"0.2.3-experimental-dev"')
ON CONFLICT (key) DO NOTHING;
