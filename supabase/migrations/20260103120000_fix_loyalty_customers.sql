-- Create Customers Table and Add Loyalty Columns
-- Handles case where table doesn't exist.

CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number TEXT UNIQUE NOT NULL,
    full_name TEXT,
    email TEXT,
    lifetime_miles NUMERIC DEFAULT 0,
    redeemable_miles NUMERIC DEFAULT 0,
    current_rank TEXT DEFAULT 'Street Rookie',
    zip_code TEXT,
    unlocked_regions TEXT[] DEFAULT ARRAY[]::TEXT[],
    streak_count INTEGER DEFAULT 0,
    last_visit BIGINT DEFAULT 0,
    stamp_cards JSONB DEFAULT '{}'::jsonb,
    active_quests JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- If table existed but missing columns (just in case), we add them safely
ALTER TABLE customers ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_visit BIGINT DEFAULT 0;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS stamp_cards JSONB DEFAULT '{}'::jsonb;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS active_quests JSONB DEFAULT '[]'::jsonb;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS unlocked_regions TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create Policies (Universal Public Access for Demo/QR)
-- Note: In production, you'd lock this down, but for the requested "Public Portal" and POS sync:
DROP POLICY IF EXISTS "Public Read Access" ON customers;
CREATE POLICY "Public Read Access" ON customers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Access" ON customers;
CREATE POLICY "Public Insert Access" ON customers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Update Access" ON customers;
CREATE POLICY "Public Update Access" ON customers FOR UPDATE USING (true);
