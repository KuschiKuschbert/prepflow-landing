-- Migration to add POS Data Schema to PrepFlow Database
-- Run this in the Supabase SQL Editor for project 'dulkrqgjfohsuxhsmofo'

-- 1. Create Transactions Table (Mirroring Android 'Transaction' Entity)
CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid NOT NULL PRIMARY KEY, -- Android generates these UUIDs
  timestamp bigint NOT NULL,
  total_amount numeric NOT NULL,
  tax_amount numeric NOT NULL,
  items_json jsonb, -- Stores the list of items
  status text NOT NULL,
  payment_method text NOT NULL,
  fulfillment_status text DEFAULT 'PENDING',
  order_number serial, -- Auto-incrementing order number for display
  customer_name text,
  customer_id text,
  discount_amount numeric DEFAULT 0.0,
  promo_code text,
  miles_earned numeric DEFAULT 0.0,
  miles_redeemed numeric DEFAULT 0.0,
  square_transaction_id text,
  is_synced boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS (Row Level Security) for Transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow Anon (Public) to Insert/Select/Update for now (Development Mode)
-- In production, restrict this to authenticated users or specific API keys
CREATE POLICY "Enable all access for anon" ON public.transactions
FOR ALL USING (true) WITH CHECK (true);

-- 2. Create Menu Items Table (POS specific)
-- Note: PrepFlow has a 'dishes' table, but POS uses 'menu_items' with specific schema.
-- Renaming to 'pos_menu_items' to avoid conflict with existing Menu Builder 'menu_items' table.
CREATE TABLE IF NOT EXISTS public.pos_menu_items (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  category text NOT NULL,
  price numeric NOT NULL,
  tax_rate numeric DEFAULT 0.1,
  is_available boolean DEFAULT true,
  image_url text, -- Android expects 'imageUrl' mapped to this
  square_id text UNIQUE, -- For Square Sync
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.pos_menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for anon" ON public.pos_menu_items
FOR ALL USING (true) WITH CHECK (true);

-- 3. Create Modifier Options Table
-- Renaming to 'pos_modifier_options' for consistency and safety.
CREATE TABLE IF NOT EXISTS public.pos_modifier_options (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  category text, -- e.g. 'Size', 'Topping'
  price numeric DEFAULT 0.0,
  is_available boolean DEFAULT true,
  square_id text UNIQUE, -- For Square Sync
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.pos_modifier_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for anon" ON public.pos_modifier_options
FOR ALL USING (true) WITH CHECK (true);

-- 4. Create Customers Table (POS specific loyalty)
-- 'users' table exists for Admin/Web auth, but 'customers' is for POS Walk-in/Loyalty
-- Renaming to 'pos_customers' to avoid potential conflicts.
CREATE TABLE IF NOT EXISTS public.pos_customers (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text,
  email text,
  phone_number text,
  loyalty_points numeric DEFAULT 0,
  total_spend numeric DEFAULT 0,
  last_visit_date bigint,
  join_date bigint,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.pos_customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for anon" ON public.pos_customers
FOR ALL USING (true) WITH CHECK (true);

-- 5. Seed Initial Data (Optional - prevents empty app)
INSERT INTO public.pos_menu_items (name, category, price, is_available)
VALUES
  ('PrepFlow Burger', 'Mains', 15.00, true),
  ('Truffle Fries', 'Sides', 8.50, true),
  ('Sparkling Water', 'Drinks', 4.00, true)
ON CONFLICT DO NOTHING;
