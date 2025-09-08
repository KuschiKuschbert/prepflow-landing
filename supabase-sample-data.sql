-- Sample Data for PrepFlow Database

-- Insert sample suppliers
INSERT INTO suppliers (name) VALUES
('Coles'),
('Woolworths'),
('Local Grower'),
('Masterfoods'),
('Local Supplier'),
('Fresh Direct'),
('Organic Co-op'),
('Bulk Foods'),
('Local Butcher'),
('Seafood Market');

-- Insert 50 essential ingredients with realistic Australian pricing
INSERT INTO ingredients (
  ingredient_name, brand, pack_size, pack_size_unit, pack_price, unit, 
  cost_per_unit, trim_peel_waste_percentage, yield_percentage, supplier, 
  storage_location, product_code
) VALUES
-- Proteins
('Beef Mince Premium', 'Coles', '500', 'GM', 8.50, 'GM', 0.017, 5, 95, 'Coles', 'Cold Room A', 'BEEF001'),
('Chicken Breast', 'Woolworths', '1', 'KG', 12.00, 'GM', 0.012, 8, 92, 'Woolworths', 'Cold Room A', 'CHICK001'),
('Salmon Fillet', 'Local Supplier', '300', 'GM', 15.00, 'GM', 0.050, 10, 90, 'Local Supplier', 'Cold Room A', 'SALM001'),
('Pork Shoulder', 'Local Butcher', '2', 'KG', 18.00, 'GM', 0.009, 15, 85, 'Local Butcher', 'Cold Room A', 'PORK001'),
('Lamb Chops', 'Local Butcher', '800', 'GM', 22.00, 'GM', 0.0275, 12, 88, 'Local Butcher', 'Cold Room A', 'LAMB001'),

-- Vegetables
('Onions Brown', 'Local Grower', '2', 'KG', 3.50, 'GM', 0.00175, 10, 90, 'Local Grower', 'Dry Storage', 'ONION001'),
('Carrots', 'Local Grower', '1', 'KG', 2.80, 'GM', 0.0028, 8, 92, 'Local Grower', 'Cold Room B', 'CARROT001'),
('Tomatoes Fresh', 'Local Grower', '500', 'GM', 4.20, 'GM', 0.0084, 5, 95, 'Local Grower', 'Cold Room B', 'TOMATO001'),
('Potatoes', 'Local Grower', '2', 'KG', 3.20, 'GM', 0.0016, 8, 92, 'Local Grower', 'Dry Storage', 'POTATO001'),
('Capsicum Red', 'Local Grower', '500', 'GM', 5.50, 'GM', 0.011, 8, 92, 'Local Grower', 'Cold Room B', 'CAPS001'),

-- Herbs & Spices
('Basil Fresh', 'Local Grower', '30', 'GM', 2.50, 'GM', 0.083, 15, 85, 'Local Grower', 'Cold Room B', 'BASIL001'),
('Parsley Fresh', 'Local Grower', '25', 'GM', 1.80, 'GM', 0.072, 12, 88, 'Local Grower', 'Cold Room B', 'PARSLEY001'),
('Garlic', 'Local Grower', '100', 'GM', 2.20, 'GM', 0.022, 20, 80, 'Local Grower', 'Dry Storage', 'GARLIC001'),
('Ginger Fresh', 'Local Grower', '150', 'GM', 3.50, 'GM', 0.023, 15, 85, 'Local Grower', 'Cold Room B', 'GINGER001'),
('Chilli Fresh', 'Local Grower', '50', 'GM', 2.80, 'GM', 0.056, 10, 90, 'Local Grower', 'Cold Room B', 'CHILLI001'),

-- Dairy
('Milk Full Cream', 'Coles', '1', 'L', 1.50, 'ML', 0.0015, 0, 100, 'Coles', 'Cold Room A', 'MILK001'),
('Butter Unsalted', 'Woolworths', '500', 'GM', 4.50, 'GM', 0.009, 0, 100, 'Woolworths', 'Cold Room A', 'BUTTER001'),
('Cheese Cheddar', 'Coles', '250', 'GM', 6.50, 'GM', 0.026, 0, 100, 'Coles', 'Cold Room A', 'CHEESE001'),
('Cream Thick', 'Woolworths', '300', 'ML', 3.20, 'ML', 0.0107, 0, 100, 'Woolworths', 'Cold Room A', 'CREAM001'),
('Yoghurt Natural', 'Coles', '1', 'KG', 4.80, 'GM', 0.0048, 0, 100, 'Coles', 'Cold Room A', 'YOGHURT001'),

-- Pantry Staples
('Flour Plain', 'Coles', '1', 'KG', 1.80, 'GM', 0.0018, 0, 100, 'Coles', 'Dry Storage', 'FLOUR001'),
('Sugar White', 'Woolworths', '1', 'KG', 2.20, 'GM', 0.0022, 0, 100, 'Woolworths', 'Dry Storage', 'SUGAR001'),
('Salt Table', 'Coles', '500', 'GM', 1.20, 'GM', 0.0024, 0, 100, 'Coles', 'Dry Storage', 'SALT001'),
('Pepper Black', 'Masterfoods', '50', 'GM', 3.50, 'GM', 0.07, 0, 100, 'Masterfoods', 'Dry Storage', 'PEPPER001'),
('Olive Oil Extra Virgin', 'Local Supplier', '500', 'ML', 8.50, 'ML', 0.017, 0, 100, 'Local Supplier', 'Dry Storage', 'OIL001'),

-- Condiments & Sauces
('Tomato Paste', 'Coles', '140', 'GM', 1.80, 'GM', 0.0129, 0, 100, 'Coles', 'Dry Storage', 'PASTE001'),
('Worcestershire Sauce', 'Masterfoods', '150', 'ML', 2.50, 'ML', 0.0167, 0, 100, 'Masterfoods', 'Dry Storage', 'WORC001'),
('Soy Sauce', 'Masterfoods', '150', 'ML', 2.20, 'ML', 0.0147, 0, 100, 'Masterfoods', 'Dry Storage', 'SOY001'),
('Balsamic Vinegar', 'Local Supplier', '250', 'ML', 4.50, 'ML', 0.018, 0, 100, 'Local Supplier', 'Dry Storage', 'BALSAMIC001'),
('Honey', 'Local Supplier', '500', 'GM', 8.50, 'GM', 0.017, 0, 100, 'Local Supplier', 'Dry Storage', 'HONEY001'),

-- Grains & Legumes
('Rice Basmati', 'Coles', '1', 'KG', 3.50, 'GM', 0.0035, 0, 100, 'Coles', 'Dry Storage', 'RICE001'),
('Pasta Spaghetti', 'Woolworths', '500', 'GM', 2.20, 'GM', 0.0044, 0, 100, 'Woolworths', 'Dry Storage', 'PASTA001'),
('Lentils Red', 'Coles', '500', 'GM', 3.80, 'GM', 0.0076, 0, 100, 'Coles', 'Dry Storage', 'LENTIL001'),
('Quinoa', 'Woolworths', '500', 'GM', 8.50, 'GM', 0.017, 0, 100, 'Woolworths', 'Dry Storage', 'QUINOA001'),
('Bread Sourdough', 'Local Supplier', '800', 'GM', 6.50, 'GM', 0.0081, 5, 95, 'Local Supplier', 'Dry Storage', 'BREAD001'),

-- Frozen Items
('Peas Frozen', 'Coles', '500', 'GM', 2.50, 'GM', 0.005, 0, 100, 'Coles', 'Freezer', 'PEAS001'),
('Corn Frozen', 'Woolworths', '500', 'GM', 2.80, 'GM', 0.0056, 0, 100, 'Woolworths', 'Freezer', 'CORN001'),
('Spinach Frozen', 'Coles', '250', 'GM', 2.20, 'GM', 0.0088, 0, 100, 'Coles', 'Freezer', 'SPINACH001'),

-- Beverages
('Stock Chicken', 'Coles', '1', 'L', 2.50, 'ML', 0.0025, 0, 100, 'Coles', 'Dry Storage', 'STOCK001'),
('Stock Vegetable', 'Woolworths', '1', 'L', 2.20, 'ML', 0.0022, 0, 100, 'Woolworths', 'Dry Storage', 'VEGSTOCK001'),
('Wine White Cooking', 'Local Supplier', '750', 'ML', 8.50, 'ML', 0.0113, 0, 100, 'Local Supplier', 'Dry Storage', 'WINE001'),

-- Baking
('Eggs Free Range', 'Local Grower', '12', 'PC', 5.50, 'PC', 0.458, 0, 100, 'Local Grower', 'Cold Room A', 'EGGS001'),
('Vanilla Extract', 'Masterfoods', '50', 'ML', 4.50, 'ML', 0.09, 0, 100, 'Masterfoods', 'Dry Storage', 'VANILLA001'),
('Baking Powder', 'Coles', '100', 'GM', 1.80, 'GM', 0.018, 0, 100, 'Coles', 'Dry Storage', 'BAKING001'),

-- Nuts & Seeds
('Almonds', 'Bulk Foods', '200', 'GM', 6.50, 'GM', 0.0325, 0, 100, 'Bulk Foods', 'Dry Storage', 'ALMOND001'),
('Walnuts', 'Bulk Foods', '200', 'GM', 8.50, 'GM', 0.0425, 0, 100, 'Bulk Foods', 'Dry Storage', 'WALNUT001'),
('Sesame Seeds', 'Bulk Foods', '100', 'GM', 3.50, 'GM', 0.035, 0, 100, 'Bulk Foods', 'Dry Storage', 'SESAME001'),

-- Specialty Items
('Truffle Oil', 'Local Supplier', '50', 'ML', 25.00, 'ML', 0.5, 0, 100, 'Local Supplier', 'Dry Storage', 'TRUFFLE001'),
('Caviar', 'Seafood Market', '50', 'GM', 45.00, 'GM', 0.9, 0, 100, 'Seafood Market', 'Cold Room A', 'CAVIAR001');
