-- ==============================================================================
-- 1. Customers (CRM)
-- ==============================================================================
-- The customers table already exists from an earlier loyalty/taco passport migration.
-- We are just adding the necessary columns for the CRM functionality here.
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS notes TEXT;

-- Index for CRM lookups
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON public.customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);

-- Enable RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own customers"
    ON public.customers
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 2. Functions (formerly Events)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.functions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- Wedding, Corporate, Birthday, Conference, Other
    status TEXT NOT NULL DEFAULT 'Draft', -- Draft, Upcoming, Pending, Past, Cancelled
    start_date DATE NOT NULL,
    duration_days INTEGER NOT NULL DEFAULT 1,
    attendees INTEGER NOT NULL DEFAULT 0,
    profit_margin NUMERIC DEFAULT 65.0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_functions_user_id ON public.functions(user_id);
CREATE INDEX IF NOT EXISTS idx_functions_start_date ON public.functions(start_date);

ALTER TABLE public.functions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own functions"
    ON public.functions
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 3. Modify Menus
-- ==============================================================================
-- Add type to distinguish between standard a-la-carte menus and function menus.
ALTER TABLE public.menus ADD COLUMN IF NOT EXISTS menu_type TEXT DEFAULT 'a_la_carte';
ALTER TABLE public.menus ADD COLUMN IF NOT EXISTS food_per_person_kg NUMERIC;

-- ==============================================================================
-- 4. Function Meal Stages
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.function_meal_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    function_id UUID NOT NULL REFERENCES public.functions(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL DEFAULT 1,
    meal_type TEXT NOT NULL, -- Breakfast, Mid-morning, Lunch, Afternoon, Dinner
    menu_id UUID REFERENCES public.menus(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_function_meal_stages_function_id ON public.function_meal_stages(function_id);

ALTER TABLE public.function_meal_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage meal stages for their functions"
    ON public.function_meal_stages
    FOR ALL
    USING (
         EXISTS (
             SELECT 1 FROM public.functions
             WHERE functions.id = function_meal_stages.function_id
             AND functions.user_id = auth.uid()
         )
    )
    WITH CHECK (
         EXISTS (
             SELECT 1 FROM public.functions
             WHERE functions.id = function_meal_stages.function_id
             AND functions.user_id = auth.uid()
         )
    );

-- ==============================================================================
-- 5. Menu Recipes (for Function Menus)
-- ==============================================================================
-- Function menus bundle recipes directly rather than standard a-la-carte menu items.
CREATE TABLE IF NOT EXISTS public.menu_recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_id UUID NOT NULL REFERENCES public.menus(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    multiplier NUMERIC NOT NULL DEFAULT 1.0, -- Servings/portions needed per person
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_menu_recipes_menu_id ON public.menu_recipes(menu_id);

ALTER TABLE public.menu_recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage recipes for their menus"
    ON public.menu_recipes
    FOR ALL
    USING (
         EXISTS (
             SELECT 1 FROM public.menus
             WHERE menus.id = menu_recipes.menu_id
             AND menus.user_id = auth.uid()
         )
    )
    WITH CHECK (
         EXISTS (
             SELECT 1 FROM public.menus
             WHERE menus.id = menu_recipes.menu_id
             AND menus.user_id = auth.uid()
         )
    );

-- ==============================================================================
-- 6. Special Days (Calendar)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.special_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    date DATE NOT NULL,
    demand_level TEXT NOT NULL DEFAULT 'Medium', -- Low, Medium, High
    is_public_holiday BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_special_days_user_id ON public.special_days(user_id);
CREATE INDEX IF NOT EXISTS idx_special_days_date ON public.special_days(date);

ALTER TABLE public.special_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own special days"
    ON public.special_days
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
