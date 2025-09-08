-- Additional ingredients needed for the 12 sample recipes
-- These ingredients are not in the original sample data

INSERT INTO ingredients (
  ingredient_name, brand, pack_size, pack_size_unit, pack_price, unit, 
  cost_per_unit, trim_peel_waste_percentage, yield_percentage, supplier, 
  storage_location, product_code
) VALUES
-- Additional ingredients for recipes
('Beef Mince', 'Coles', '500', 'GM', 8.50, 'GM', 0.017, 5, 95, 'Coles', 'Cold Room A', 'BEEF002'),
('Burger Bun', 'Local Supplier', '6', 'PC', 3.50, 'PC', 0.583, 0, 100, 'Local Supplier', 'Dry Storage', 'BUN001'),
('Lettuce', 'Local Grower', '1', 'PC', 2.50, 'GM', 0.025, 10, 90, 'Local Grower', 'Cold Room B', 'LETTUCE001'),
('Tomato', 'Local Grower', '500', 'GM', 4.20, 'GM', 0.0084, 5, 95, 'Local Grower', 'Cold Room B', 'TOMATO002'),
('Onion', 'Local Grower', '2', 'KG', 3.50, 'GM', 0.00175, 10, 90, 'Local Grower', 'Dry Storage', 'ONION002'),
('Pickles', 'Masterfoods', '500', 'GM', 3.20, 'GM', 0.0064, 0, 100, 'Masterfoods', 'Dry Storage', 'PICKLES001'),

('Pizza Dough', 'Local Supplier', '500', 'GM', 4.50, 'GM', 0.009, 0, 100, 'Local Supplier', 'Cold Room A', 'DOUGH001'),
('Tomato Sauce', 'Coles', '400', 'GM', 2.20, 'GM', 0.0055, 0, 100, 'Coles', 'Dry Storage', 'SAUCE001'),
('Mozzarella Cheese', 'Woolworths', '250', 'GM', 5.50, 'GM', 0.022, 0, 100, 'Woolworths', 'Cold Room A', 'MOZZ001'),
('Fresh Basil', 'Local Grower', '30', 'GM', 2.50, 'GM', 0.083, 15, 85, 'Local Grower', 'Cold Room B', 'BASIL002'),

('Romaine Lettuce', 'Local Grower', '1', 'PC', 3.20, 'GM', 0.032, 8, 92, 'Local Grower', 'Cold Room B', 'ROMAINE001'),
('Caesar Dressing', 'Masterfoods', '250', 'ML', 4.50, 'ML', 0.018, 0, 100, 'Masterfoods', 'Cold Room A', 'CAESAR001'),
('Croutons', 'Local Supplier', '150', 'GM', 3.80, 'GM', 0.0253, 0, 100, 'Local Supplier', 'Dry Storage', 'CROUTONS001'),
('Parmesan Cheese', 'Woolworths', '200', 'GM', 8.50, 'GM', 0.0425, 0, 100, 'Woolworths', 'Cold Room A', 'PARM001'),

('Fish Fillet', 'Seafood Market', '500', 'GM', 18.50, 'GM', 0.037, 15, 85, 'Seafood Market', 'Cold Room A', 'FISH001'),
('Beer', 'Local Supplier', '375', 'ML', 2.50, 'ML', 0.0067, 0, 100, 'Local Supplier', 'Cold Room A', 'BEER001'),
('Peas', 'Coles', '500', 'GM', 2.50, 'GM', 0.005, 0, 100, 'Coles', 'Freezer', 'PEAS002'),
('Cooking Oil', 'Coles', '1', 'L', 4.50, 'ML', 0.0045, 0, 100, 'Coles', 'Dry Storage', 'OIL002'),

('Spaghetti', 'Woolworths', '500', 'GM', 2.20, 'GM', 0.0044, 0, 100, 'Woolworths', 'Dry Storage', 'SPAGHETTI001'),
('Pancetta', 'Local Butcher', '200', 'GM', 12.50, 'GM', 0.0625, 5, 95, 'Local Butcher', 'Cold Room A', 'PANCETTA001'),
('Black Pepper', 'Masterfoods', '50', 'GM', 3.50, 'GM', 0.07, 0, 100, 'Masterfoods', 'Dry Storage', 'PEPPER002'),

('Beef Strips', 'Local Butcher', '500', 'GM', 15.00, 'GM', 0.03, 8, 92, 'Local Butcher', 'Cold Room A', 'BEEF003'),
('Bell Peppers', 'Local Grower', '500', 'GM', 5.50, 'GM', 0.011, 8, 92, 'Local Grower', 'Cold Room B', 'BELL001'),
('Broccoli', 'Local Grower', '500', 'GM', 4.20, 'GM', 0.0084, 10, 90, 'Local Grower', 'Cold Room B', 'BROCCOLI001'),
('Carrots', 'Local Grower', '1', 'KG', 2.80, 'GM', 0.0028, 8, 92, 'Local Grower', 'Cold Room B', 'CARROT002'),

('Dark Chocolate', 'Masterfoods', '200', 'GM', 6.50, 'GM', 0.0325, 0, 100, 'Masterfoods', 'Dry Storage', 'CHOCOLATE001'),
('Sugar', 'Woolworths', '1', 'KG', 2.20, 'GM', 0.0022, 0, 100, 'Woolworths', 'Dry Storage', 'SUGAR002'),
('Vanilla Ice Cream', 'Coles', '1', 'L', 5.50, 'GM', 0.0055, 0, 100, 'Coles', 'Freezer', 'ICECREAM001'),

('Tomatoes', 'Local Grower', '500', 'GM', 4.20, 'GM', 0.0084, 5, 95, 'Local Grower', 'Cold Room B', 'TOMATO003'),
('Cream', 'Woolworths', '300', 'ML', 3.20, 'ML', 0.0107, 0, 100, 'Woolworths', 'Cold Room A', 'CREAM002'),
('Basmati Rice', 'Coles', '1', 'KG', 3.50, 'GM', 0.0035, 0, 100, 'Coles', 'Dry Storage', 'RICE002'),

('Ground Beef', 'Local Butcher', '500', 'GM', 12.00, 'GM', 0.024, 5, 95, 'Local Butcher', 'Cold Room A', 'GROUND001'),
('Taco Shells', 'Coles', '12', 'PC', 4.50, 'PC', 0.375, 0, 100, 'Coles', 'Dry Storage', 'TACO001'),
('Cheddar Cheese', 'Coles', '250', 'GM', 6.50, 'GM', 0.026, 0, 100, 'Coles', 'Cold Room A', 'CHEDDAR001'),
('Sour Cream', 'Woolworths', '300', 'ML', 3.50, 'ML', 0.0117, 0, 100, 'Woolworths', 'Cold Room A', 'SOUR001'),

('Salmon Fillet', 'Seafood Market', '300', 'GM', 15.00, 'GM', 0.05, 10, 90, 'Seafood Market', 'Cold Room A', 'SALMON001'),
('Lemon', 'Local Grower', '1', 'KG', 4.50, 'PC', 0.45, 20, 80, 'Local Grower', 'Cold Room B', 'LEMON001'),
('Fresh Herbs', 'Local Grower', '50', 'GM', 4.50, 'GM', 0.09, 15, 85, 'Local Grower', 'Cold Room B', 'HERBS001'),

('Apples', 'Local Grower', '1', 'KG', 4.20, 'GM', 0.0042, 10, 90, 'Local Grower', 'Cold Room B', 'APPLE001'),
('Oats', 'Coles', '500', 'GM', 2.80, 'GM', 0.0056, 0, 100, 'Coles', 'Dry Storage', 'OATS001'),
('Cinnamon', 'Masterfoods', '50', 'GM', 3.50, 'GM', 0.07, 0, 100, 'Masterfoods', 'Dry Storage', 'CINNAMON001');
