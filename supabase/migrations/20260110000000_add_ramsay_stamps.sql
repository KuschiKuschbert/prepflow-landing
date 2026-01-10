-- Add test stamps to Gordon Ramsay's passport
UPDATE customers
SET
    unlocked_regions = ARRAY['Baja', 'Oaxaca', 'Yucatan'],
    stamp_cards = '{"Burritos": 8, "Coffee": 3, "Tacos": 5}'::jsonb,
    current_rank = 'Taco Titan'
WHERE full_name ILIKE '%Gordon Ramsay%';
