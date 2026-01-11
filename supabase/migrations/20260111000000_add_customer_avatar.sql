-- Add avatar_url to customers table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create Storage Bucket for Customer Photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('customer-photos', 'customer-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for customer-photos

-- Allow public read access to customer photos
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
CREATE POLICY "Public Read Access" ON storage.objects
FOR SELECT
USING ( bucket_id = 'customer-photos' );

-- Allow public insert access (for demo purposes, matching the "Public Portal" openness)
-- In a real app, this should be authenticated users only or specific to the user's own folder.
DROP POLICY IF EXISTS "Public Insert Access" ON storage.objects;
CREATE POLICY "Public Insert Access" ON storage.objects
FOR INSERT
WITH CHECK ( bucket_id = 'customer-photos' );

-- Allow public update access (for replacing photos)
DROP POLICY IF EXISTS "Public Update Access" ON storage.objects;
CREATE POLICY "Public Update Access" ON storage.objects
FOR UPDATE
USING ( bucket_id = 'customer-photos' );

-- Allow public delete access (optional, but good for cleanup if needed)
DROP POLICY IF EXISTS "Public Delete Access" ON storage.objects;
CREATE POLICY "Public Delete Access" ON storage.objects
FOR DELETE
USING ( bucket_id = 'customer-photos' );
