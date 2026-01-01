-- Create Loyalty Ranks Enum/Table
CREATE TABLE IF NOT EXISTS loyalty_ranks (
    rank_name VARCHAR(50) PRIMARY KEY,
    min_miles INTEGER NOT NULL,
    max_miles INTEGER, -- Null for highest rank
    sort_order INTEGER NOT NULL
);

INSERT INTO loyalty_ranks (rank_name, min_miles, max_miles, sort_order) VALUES
('Street Rookie', 0, 50, 1),
('Regular', 51, 150, 2),
('OG', 151, 350, 3),
('Legend', 351, 700, 4),
('Mythic', 701, NULL, 5)
ON CONFLICT (rank_name) DO NOTHING;

-- Create Loyalty Regions
CREATE TABLE IF NOT EXISTS loyalty_regions (
    region_name VARCHAR(50) PRIMARY KEY,
    unlock_rank VARCHAR(50) REFERENCES loyalty_ranks(rank_name),
    unlock_reward_description TEXT
);

INSERT INTO loyalty_regions (region_name, unlock_rank, unlock_reward_description) VALUES
('Baja', 'Street Rookie', 'Free salsa'),
('Oaxaca', 'Regular', 'Secret taco'),
('Yucatán', 'OG', 'Double-points days'),
('Jalisco', 'Legend', 'Name on wall + VIP perks'),
('Chefs Vault', 'Mythic', 'Lifetime perks')
ON CONFLICT (region_name) DO NOTHING;

-- Create Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(255),
    lifetime_miles DECIMAL(10,2) DEFAULT 0,
    redeemable_miles DECIMAL(10,2) DEFAULT 0,
    current_rank VARCHAR(50) DEFAULT 'Street Rookie' REFERENCES loyalty_ranks(rank_name),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone_number);

-- Create Rewards Table
CREATE TABLE IF NOT EXISTS loyalty_rewards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    cost_miles INTEGER NOT NULL,
    active BOOLEAN DEFAULT TRUE
);

INSERT INTO loyalty_rewards (description, cost_miles) VALUES
('Free Drink', 50),
('Free Taco', 120),
('Merch / VIP Item', 250),
('Bring-a-friend Free Taco', 400),
('Legend Night Invite', 700)
ON CONFLICT DO NOTHING;

-- Create Loyalty History (Audit Log)
CREATE TABLE IF NOT EXISTS loyalty_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    transaction_id VARCHAR(100), -- Can be NULL for bonuses
    miles_change DECIMAL(10,2) NOT NULL,
    activity_type VARCHAR(50) NOT NULL, -- 'EARN', 'REDEEM', 'BONUS', 'ADJUSTMENT'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Region Items Mapping (Manual for now)
CREATE TABLE IF NOT EXISTS region_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    region_name VARCHAR(50) REFERENCES loyalty_regions(region_name),
    menu_item_name VARCHAR(255) NOT NULL -- Matching by name for simplicity in MVP
);

-- Customer Region Progress
CREATE TABLE IF NOT EXISTS customer_region_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    region_name VARCHAR(50) REFERENCES loyalty_regions(region_name),
    items_eaten JSONB DEFAULT '[]'::jsonb, -- Array of item names eaten
    is_completed BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(customer_id, region_name)
);

-- Trigger to Update Updated_At
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to Auto-Update Rank
CREATE OR REPLACE FUNCTION update_customer_rank() RETURNS TRIGGER AS $$
DECLARE
    new_rank VARCHAR(50);
BEGIN
    SELECT rank_name INTO new_rank
    FROM loyalty_ranks
    WHERE NEW.lifetime_miles >= min_miles
    AND (max_miles IS NULL OR NEW.lifetime_miles <= max_miles)
    ORDER BY sort_order DESC
    LIMIT 1;

    IF new_rank IS NOT NULL AND new_rank != NEW.current_rank THEN
        NEW.current_rank := new_rank;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_rank
BEFORE INSERT OR UPDATE OF lifetime_miles ON customers
FOR EACH ROW
EXECUTE FUNCTION update_customer_rank();
