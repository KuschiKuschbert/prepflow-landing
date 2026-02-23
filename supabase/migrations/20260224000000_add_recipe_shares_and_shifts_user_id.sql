-- Recipe Shares: Create table if missing (required for /api/recipe-share)
CREATE TABLE IF NOT EXISTS public.recipe_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  user_id UUID,
  share_type TEXT NOT NULL,
  recipient_email TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recipe_shares_user_id ON public.recipe_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_recipe_shares_recipe_id ON public.recipe_shares(recipe_id);

ALTER TABLE public.recipe_shares ENABLE ROW LEVEL SECURITY;

-- Shifts: Add user_id for multi-tenancy (table is 'shifts', not 'roster_shifts')
-- Multi-tenancy migration referenced 'roster_shifts' which doesn't exist
ALTER TABLE public.shifts ADD COLUMN IF NOT EXISTS user_id UUID;

-- Backfill user_id from employees for existing shifts
UPDATE public.shifts s
SET user_id = e.user_id
FROM public.employees e
WHERE s.employee_id = e.id AND s.user_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_shifts_user_id ON public.shifts(user_id);
