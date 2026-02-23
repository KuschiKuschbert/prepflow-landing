-- Add expected_guests to menus for function menu total estimation
-- Price per person × expected_guests = total for guests (in menu builder)
-- When linked to a function, attendees from the function are used instead

ALTER TABLE public.menus
  ADD COLUMN IF NOT EXISTS expected_guests INTEGER;
