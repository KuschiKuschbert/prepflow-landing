-- Create promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('PERCENTAGE', 'FIXED')), -- 'PERCENTAGE' or 'FIXED'
  value DECIMAL(10,2) NOT NULL, -- e.g., 10.0 for 10% or $10
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups by code
CREATE INDEX IF NOT EXISTS idx_promotions_code ON promotions(code);

-- Add trigger for updated_at
CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON promotions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some default test promotions
INSERT INTO promotions (code, type, value, min_order_amount) VALUES
('SAVE10', 'PERCENTAGE', 10.0, 0),
('WELCOME', 'FIXED', 5.0, 20.0),
('BURGERDAY', 'PERCENTAGE', 15.0, 30.0)
ON CONFLICT (code) DO NOTHING;

-- Update transactions table to support discounts (if it exists in Supabase already, otherwise this will fail if the table isn't there, but per previous analysis it might be local-only or synced. Ideally we add columns if they don't exist)
-- DO $$
-- BEGIN
--     IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'transactions') THEN
--         ALTER TABLE transactions ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0;
--         ALTER TABLE transactions ADD COLUMN IF NOT EXISTS promo_code VARCHAR(50);
--     END IF;
-- END $$;
