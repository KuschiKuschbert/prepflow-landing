-- Add dish_id and recipe_id columns to function_runsheet_items
-- Allows linking individual dishes or recipes to runsheet items (in addition to full menus)

ALTER TABLE public.function_runsheet_items
  ADD COLUMN IF NOT EXISTS dish_id UUID REFERENCES public.dishes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS recipe_id UUID REFERENCES public.recipes(id) ON DELETE SET NULL;
