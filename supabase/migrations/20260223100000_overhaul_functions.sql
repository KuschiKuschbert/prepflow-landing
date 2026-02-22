-- ==============================================================================
-- Overhaul Functions: replace date/duration with datetime range,
-- remove profit_margin, replace meal stages with runsheet items
-- ==============================================================================

-- 1. Alter functions table: add new datetime columns
ALTER TABLE public.functions ADD COLUMN IF NOT EXISTS start_time TEXT;
ALTER TABLE public.functions ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE public.functions ADD COLUMN IF NOT EXISTS end_time TEXT;
ALTER TABLE public.functions ADD COLUMN IF NOT EXISTS same_day BOOLEAN DEFAULT true;

-- 2. Migrate existing data: derive end_date from start_date + duration_days
UPDATE public.functions
SET end_date = start_date + (duration_days - 1) * INTERVAL '1 day',
    same_day = (duration_days = 1);

-- 3. Drop deprecated columns
ALTER TABLE public.functions DROP COLUMN IF EXISTS profit_margin;
ALTER TABLE public.functions DROP COLUMN IF EXISTS duration_days;

-- 4. Drop function_meal_stages table (replaced by runsheet items)
DROP TABLE IF EXISTS public.function_meal_stages CASCADE;

-- 5. Create function_runsheet_items table
CREATE TABLE IF NOT EXISTS public.function_runsheet_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    function_id UUID NOT NULL REFERENCES public.functions(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL DEFAULT 1,
    item_time TIME,
    description TEXT NOT NULL,
    item_type TEXT NOT NULL DEFAULT 'activity',
    menu_id UUID REFERENCES public.menus(id) ON DELETE SET NULL,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_function_runsheet_items_function_id
    ON public.function_runsheet_items(function_id);

ALTER TABLE public.function_runsheet_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage runsheet items for their functions"
    ON public.function_runsheet_items
    FOR ALL
    USING (
         EXISTS (
             SELECT 1 FROM public.functions
             WHERE functions.id = function_runsheet_items.function_id
             AND functions.user_id = auth.uid()
         )
    )
    WITH CHECK (
         EXISTS (
             SELECT 1 FROM public.functions
             WHERE functions.id = function_runsheet_items.function_id
             AND functions.user_id = auth.uid()
         )
    );
