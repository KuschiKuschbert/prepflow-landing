-- =====================================================
-- PREPFLOW RLS SECURITY SETUP
-- =====================================================
-- This script enables Row Level Security (RLS) on all tables
-- Run this in the Supabase SQL Editor to fix security warnings

-- =====================================================
-- STEP 1: ENABLE RLS ON ALL TABLES
-- =====================================================

-- Core application tables
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_data ENABLE ROW LEVEL SECURITY;

-- User and subscription tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Restaurant management tables
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaning_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temperature_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kitchen_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_types ENABLE ROW LEVEL SECURITY;

-- Additional tables
ALTER TABLE public.recipe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_specials_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_impersonation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impersonation_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 2: CREATE RLS POLICIES FOR AUTHENTICATED USERS
-- =====================================================

-- Core tables - allow authenticated users to manage data
CREATE POLICY "Allow authenticated users to manage ingredients" ON public.ingredients
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage recipes" ON public.recipes
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage recipe ingredients" ON public.recipe_ingredients
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage menu dishes" ON public.menu_dishes
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage sales data" ON public.sales_data
    FOR ALL USING (auth.role() = 'authenticated');

-- User-specific tables - users can only access their own data
CREATE POLICY "Allow users to manage their own data" ON public.users
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Allow users to manage their own subscriptions" ON public.subscriptions
    FOR ALL USING (auth.uid() = user_id);

-- Restaurant management tables - allow authenticated users
CREATE POLICY "Allow authenticated users to manage suppliers" ON public.suppliers
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage cleaning areas" ON public.cleaning_areas
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage temperature equipment" ON public.temperature_equipment
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage kitchen sections" ON public.kitchen_sections
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage compliance types" ON public.compliance_types
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage recipe items" ON public.recipe_items
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage ai specials ingredients" ON public.ai_specials_ingredients
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage admin impersonation logs" ON public.admin_impersonation_logs
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage impersonation logs" ON public.impersonation_logs
    FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- STEP 3: CREATE SERVICE ROLE POLICIES FOR API OPERATIONS
-- =====================================================
-- These policies allow the service role to bypass RLS for API operations

CREATE POLICY "Service role can manage all ingredients" ON public.ingredients
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all recipes" ON public.recipes
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all recipe ingredients" ON public.recipe_ingredients
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all menu dishes" ON public.menu_dishes
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all sales data" ON public.sales_data
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all users" ON public.users
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all subscriptions" ON public.subscriptions
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all suppliers" ON public.suppliers
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all cleaning areas" ON public.cleaning_areas
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all temperature equipment" ON public.temperature_equipment
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all kitchen sections" ON public.kitchen_sections
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all compliance types" ON public.compliance_types
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all recipe items" ON public.recipe_items
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all ai specials ingredients" ON public.ai_specials_ingredients
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all admin impersonation logs" ON public.admin_impersonation_logs
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all impersonation logs" ON public.impersonation_logs
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify RLS is enabled

-- Check which tables have RLS enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;