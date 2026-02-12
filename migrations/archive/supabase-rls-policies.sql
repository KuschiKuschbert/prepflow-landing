-- PrepFlow RLS Policies for All Tables
-- This script enables Row Level Security and creates policies allowing public access
-- Since Auth0 + NextAuth middleware already protects routes, RLS acts as a second layer
-- Run this script in your Supabase SQL Editor

-- =====================================================
-- DROP ALL EXISTING POLICIES FIRST
-- =====================================================

-- Drop all existing policies to avoid conflicts
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT schemaname, tablename, policyname
              FROM pg_policies
              WHERE schemaname = 'public')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Ingredients
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations"
ON ingredients
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Recipes
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations"
ON recipes
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Recipe Ingredients
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations"
ON recipe_ingredients
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Menu Dishes
ALTER TABLE menu_dishes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations"
ON menu_dishes
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Suppliers
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations"
ON suppliers
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Supplier Price Lists
ALTER TABLE supplier_price_lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations"
ON supplier_price_lists
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- =====================================================
-- TEMPERATURE MONITORING
-- =====================================================

-- Temperature Equipment
ALTER TABLE temperature_equipment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations"
ON temperature_equipment
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Temperature Logs
ALTER TABLE temperature_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations"
ON temperature_logs
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Temperature Thresholds
ALTER TABLE temperature_thresholds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations"
ON temperature_thresholds
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- =====================================================
-- CLEANING MANAGEMENT
-- =====================================================

-- Cleaning Areas
ALTER TABLE cleaning_areas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations"
ON cleaning_areas
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Cleaning Tasks
ALTER TABLE cleaning_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations"
ON cleaning_tasks
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- =====================================================
-- COMPLIANCE TRACKING
-- =====================================================

-- Compliance Types
ALTER TABLE compliance_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations"
ON compliance_types
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Compliance Records
ALTER TABLE compliance_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations"
ON compliance_records
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- =====================================================
-- INVENTORY MANAGEMENT
-- =====================================================

-- Par Levels
ALTER TABLE par_levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations"
ON par_levels
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Order Lists
ALTER TABLE order_lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations"
ON order_lists
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Order Items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations"
ON order_items
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- =====================================================
-- KITCHEN OPERATIONS
-- =====================================================

-- Kitchen Sections
ALTER TABLE kitchen_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations"
ON kitchen_sections
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Dish Sections
ALTER TABLE dish_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations"
ON dish_sections
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Prep Lists
ALTER TABLE prep_lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations"
ON prep_lists
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Prep List Items
ALTER TABLE prep_list_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations"
ON prep_list_items
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- =====================================================
-- RECIPE SHARING & AI
-- =====================================================

-- Shared Recipes
ALTER TABLE shared_recipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations"
ON shared_recipes
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- AI Specials
ALTER TABLE ai_specials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations"
ON ai_specials
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- AI Specials Ingredients (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ai_specials_ingredients') THEN
        ALTER TABLE ai_specials_ingredients ENABLE ROW LEVEL SECURITY;
        EXECUTE 'CREATE POLICY "Allow all operations" ON ai_specials_ingredients FOR ALL TO public USING (true) WITH CHECK (true)';
    END IF;
END $$;

-- =====================================================
-- ADDITIONAL TABLES (from existing policies)
-- =====================================================

-- Sales Data (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sales_data') THEN
        ALTER TABLE sales_data ENABLE ROW LEVEL SECURITY;
        EXECUTE 'CREATE POLICY "Allow all operations" ON sales_data FOR ALL TO public USING (true) WITH CHECK (true)';
    END IF;
END $$;

-- Recipe Items (if exists, different from recipe_ingredients)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'recipe_items') THEN
        ALTER TABLE recipe_items ENABLE ROW LEVEL SECURITY;
        EXECUTE 'CREATE POLICY "Allow all operations" ON recipe_items FOR ALL TO public USING (true) WITH CHECK (true)';
    END IF;
END $$;

-- =====================================================
-- SYSTEM SETTINGS
-- =====================================================

-- System Settings
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations"
ON system_settings
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify RLS is enabled on all tables
SELECT
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename IN (
        'ingredients', 'recipes', 'recipe_ingredients', 'menu_dishes',
        'suppliers', 'supplier_price_lists',
        'temperature_equipment', 'temperature_logs', 'temperature_thresholds',
        'cleaning_areas', 'cleaning_tasks',
        'compliance_types', 'compliance_records',
        'par_levels', 'order_lists', 'order_items',
        'kitchen_sections', 'dish_sections',
        'prep_lists', 'prep_list_items',
        'shared_recipes', 'ai_specials', 'system_settings'
    )
ORDER BY tablename;

-- Verify policies exist
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
