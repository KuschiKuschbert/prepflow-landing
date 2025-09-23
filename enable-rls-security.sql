-- Enable Row Level Security (RLS) on all tables
-- This is a security best practice recommended by Supabase

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

-- Create RLS policies for authenticated users
-- These policies allow authenticated users to perform CRUD operations on their own data

-- Ingredients: Allow authenticated users to read/write ingredients
CREATE POLICY "Allow authenticated users to manage ingredients" ON public.ingredients
    FOR ALL USING (auth.role() = 'authenticated');

-- Recipes: Allow authenticated users to read/write recipes
CREATE POLICY "Allow authenticated users to manage recipes" ON public.recipes
    FOR ALL USING (auth.role() = 'authenticated');

-- Recipe Ingredients: Allow authenticated users to read/write recipe ingredients
CREATE POLICY "Allow authenticated users to manage recipe ingredients" ON public.recipe_ingredients
    FOR ALL USING (auth.role() = 'authenticated');

-- Menu Dishes: Allow authenticated users to read/write menu dishes
CREATE POLICY "Allow authenticated users to manage menu dishes" ON public.menu_dishes
    FOR ALL USING (auth.role() = 'authenticated');

-- Sales Data: Allow authenticated users to read/write sales data
CREATE POLICY "Allow authenticated users to manage sales data" ON public.sales_data
    FOR ALL USING (auth.role() = 'authenticated');

-- Users: Allow users to read/write their own data
CREATE POLICY "Allow users to manage their own data" ON public.users
    FOR ALL USING (auth.uid() = id);

-- Subscriptions: Allow users to read/write their own subscriptions
CREATE POLICY "Allow users to manage their own subscriptions" ON public.subscriptions
    FOR ALL USING (auth.uid() = user_id);

-- Suppliers: Allow authenticated users to read/write suppliers
CREATE POLICY "Allow authenticated users to manage suppliers" ON public.suppliers
    FOR ALL USING (auth.role() = 'authenticated');

-- Cleaning Areas: Allow authenticated users to read/write cleaning areas
CREATE POLICY "Allow authenticated users to manage cleaning areas" ON public.cleaning_areas
    FOR ALL USING (auth.role() = 'authenticated');

-- Temperature Equipment: Allow authenticated users to read/write temperature equipment
CREATE POLICY "Allow authenticated users to manage temperature equipment" ON public.temperature_equipment
    FOR ALL USING (auth.role() = 'authenticated');

-- Kitchen Sections: Allow authenticated users to read/write kitchen sections
CREATE POLICY "Allow authenticated users to manage kitchen sections" ON public.kitchen_sections
    FOR ALL USING (auth.role() = 'authenticated');

-- Compliance Types: Allow authenticated users to read/write compliance types
CREATE POLICY "Allow authenticated users to manage compliance types" ON public.compliance_types
    FOR ALL USING (auth.role() = 'authenticated');

-- Recipe Items: Allow authenticated users to read/write recipe items
CREATE POLICY "Allow authenticated users to manage recipe items" ON public.recipe_items
    FOR ALL USING (auth.role() = 'authenticated');

-- AI Specials Ingredients: Allow authenticated users to read/write AI specials ingredients
CREATE POLICY "Allow authenticated users to manage ai specials ingredients" ON public.ai_specials_ingredients
    FOR ALL USING (auth.role() = 'authenticated');

-- Admin Impersonation Logs: Allow authenticated users to read/write admin impersonation logs
CREATE POLICY "Allow authenticated users to manage admin impersonation logs" ON public.admin_impersonation_logs
    FOR ALL USING (auth.role() = 'authenticated');

-- Impersonation Logs: Allow authenticated users to read/write impersonation logs
CREATE POLICY "Allow authenticated users to manage impersonation logs" ON public.impersonation_logs
    FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for service role (for API operations)
-- These policies allow the service role to bypass RLS for API operations

-- Service role policies for all tables
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