import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('Starting recipe population...');

    // First, ensure we have all the required ingredients
    const additionalIngredients = [
      { ingredient_name: 'Beef Mince', brand: 'Coles', pack_size: '500', pack_size_unit: 'GM', pack_price: 8.50, unit: 'GM', cost_per_unit: 0.017, trim_peel_waste_percentage: 5, yield_percentage: 95, supplier: 'Coles', storage_location: 'Cold Room A', product_code: 'BEEF002' },
      { ingredient_name: 'Burger Bun', brand: 'Local Supplier', pack_size: '6', pack_size_unit: 'PC', pack_price: 3.50, unit: 'PC', cost_per_unit: 0.583, trim_peel_waste_percentage: 0, yield_percentage: 100, supplier: 'Local Supplier', storage_location: 'Dry Storage', product_code: 'BUN001' },
      { ingredient_name: 'Lettuce', brand: 'Local Grower', pack_size: '1', pack_size_unit: 'PC', pack_price: 2.50, unit: 'GM', cost_per_unit: 0.025, trim_peel_waste_percentage: 10, yield_percentage: 90, supplier: 'Local Grower', storage_location: 'Cold Room B', product_code: 'LETTUCE001' },
      { ingredient_name: 'Tomato', brand: 'Local Grower', pack_size: '500', pack_size_unit: 'GM', pack_price: 4.20, unit: 'GM', cost_per_unit: 0.0084, trim_peel_waste_percentage: 5, yield_percentage: 95, supplier: 'Local Grower', storage_location: 'Cold Room B', product_code: 'TOMATO002' },
      { ingredient_name: 'Onion', brand: 'Local Grower', pack_size: '2', pack_size_unit: 'KG', pack_price: 3.50, unit: 'GM', cost_per_unit: 0.00175, trim_peel_waste_percentage: 10, yield_percentage: 90, supplier: 'Local Grower', storage_location: 'Dry Storage', product_code: 'ONION002' },
      { ingredient_name: 'Pickles', brand: 'Masterfoods', pack_size: '500', pack_size_unit: 'GM', pack_price: 3.20, unit: 'GM', cost_per_unit: 0.0064, trim_peel_waste_percentage: 0, yield_percentage: 100, supplier: 'Masterfoods', storage_location: 'Dry Storage', product_code: 'PICKLES001' },
      { ingredient_name: 'Pizza Dough', brand: 'Local Supplier', pack_size: '500', pack_size_unit: 'GM', pack_price: 4.50, unit: 'GM', cost_per_unit: 0.009, trim_peel_waste_percentage: 0, yield_percentage: 100, supplier: 'Local Supplier', storage_location: 'Cold Room A', product_code: 'DOUGH001' },
      { ingredient_name: 'Tomato Sauce', brand: 'Coles', pack_size: '400', pack_size_unit: 'GM', pack_price: 2.20, unit: 'GM', cost_per_unit: 0.0055, trim_peel_waste_percentage: 0, yield_percentage: 100, supplier: 'Coles', storage_location: 'Dry Storage', product_code: 'SAUCE001' },
      { ingredient_name: 'Mozzarella Cheese', brand: 'Woolworths', pack_size: '250', pack_size_unit: 'GM', pack_price: 5.50, unit: 'GM', cost_per_unit: 0.022, trim_peel_waste_percentage: 0, yield_percentage: 100, supplier: 'Woolworths', storage_location: 'Cold Room A', product_code: 'MOZZ001' },
      { ingredient_name: 'Fresh Basil', brand: 'Local Grower', pack_size: '30', pack_size_unit: 'GM', pack_price: 2.50, unit: 'GM', cost_per_unit: 0.083, trim_peel_waste_percentage: 15, yield_percentage: 85, supplier: 'Local Grower', storage_location: 'Cold Room B', product_code: 'BASIL002' },
      { ingredient_name: 'Romaine Lettuce', brand: 'Local Grower', pack_size: '1', pack_size_unit: 'PC', pack_price: 3.20, unit: 'GM', cost_per_unit: 0.032, trim_peel_waste_percentage: 8, yield_percentage: 92, supplier: 'Local Grower', storage_location: 'Cold Room B', product_code: 'ROMAINE001' },
      { ingredient_name: 'Caesar Dressing', brand: 'Masterfoods', pack_size: '250', pack_size_unit: 'ML', pack_price: 4.50, unit: 'ML', cost_per_unit: 0.018, trim_peel_waste_percentage: 0, yield_percentage: 100, supplier: 'Masterfoods', storage_location: 'Cold Room A', product_code: 'CAESAR001' },
      { ingredient_name: 'Croutons', brand: 'Local Supplier', pack_size: '150', pack_size_unit: 'GM', pack_price: 3.80, unit: 'GM', cost_per_unit: 0.0253, trim_peel_waste_percentage: 0, yield_percentage: 100, supplier: 'Local Supplier', storage_location: 'Dry Storage', product_code: 'CROUTONS001' },
      { ingredient_name: 'Parmesan Cheese', brand: 'Woolworths', pack_size: '200', pack_size_unit: 'GM', pack_price: 8.50, unit: 'GM', cost_per_unit: 0.0425, trim_peel_waste_percentage: 0, yield_percentage: 100, supplier: 'Woolworths', storage_location: 'Cold Room A', product_code: 'PARM001' },
      { ingredient_name: 'Fish Fillet', brand: 'Seafood Market', pack_size: '500', pack_size_unit: 'GM', pack_price: 18.50, unit: 'GM', cost_per_unit: 0.037, trim_peel_waste_percentage: 15, yield_percentage: 85, supplier: 'Seafood Market', storage_location: 'Cold Room A', product_code: 'FISH001' },
      { ingredient_name: 'Beer', brand: 'Local Supplier', pack_size: '375', pack_size_unit: 'ML', pack_price: 2.50, unit: 'ML', cost_per_unit: 0.0067, trim_peel_waste_percentage: 0, yield_percentage: 100, supplier: 'Local Supplier', storage_location: 'Cold Room A', product_code: 'BEER001' },
      { ingredient_name: 'Peas', brand: 'Coles', pack_size: '500', pack_size_unit: 'GM', pack_price: 2.50, unit: 'GM', cost_per_unit: 0.005, trim_peel_waste_percentage: 0, yield_percentage: 100, supplier: 'Coles', storage_location: 'Freezer', product_code: 'PEAS002' },
      { ingredient_name: 'Cooking Oil', brand: 'Coles', pack_size: '1', pack_size_unit: 'L', pack_price: 4.50, unit: 'ML', cost_per_unit: 0.0045, trim_peel_waste_percentage: 0, yield_percentage: 100, supplier: 'Coles', storage_location: 'Dry Storage', product_code: 'OIL002' },
      { ingredient_name: 'Spaghetti', brand: 'Woolworths', pack_size: '500', pack_size_unit: 'GM', pack_price: 2.20, unit: 'GM', cost_per_unit: 0.0044, trim_peel_waste_percentage: 0, yield_percentage: 100, supplier: 'Woolworths', storage_location: 'Dry Storage', product_code: 'SPAGHETTI001' },
      { ingredient_name: 'Pancetta', brand: 'Local Butcher', pack_size: '200', pack_size_unit: 'GM', pack_price: 12.50, unit: 'GM', cost_per_unit: 0.0625, trim_peel_waste_percentage: 5, yield_percentage: 95, supplier: 'Local Butcher', storage_location: 'Cold Room A', product_code: 'PANCETTA001' },
      { ingredient_name: 'Black Pepper', brand: 'Masterfoods', pack_size: '50', pack_size_unit: 'GM', pack_price: 3.50, unit: 'GM', cost_per_unit: 0.07, trim_peel_waste_percentage: 0, yield_percentage: 100, supplier: 'Masterfoods', storage_location: 'Dry Storage', product_code: 'PEPPER002' },
      { ingredient_name: 'Beef Strips', brand: 'Local Butcher', pack_size: '500', pack_size_unit: 'GM', pack_price: 15.00, unit: 'GM', cost_per_unit: 0.03, trim_peel_waste_percentage: 8, yield_percentage: 92, supplier: 'Local Butcher', storage_location: 'Cold Room A', product_code: 'BEEF003' },
      { ingredient_name: 'Bell Peppers', brand: 'Local Grower', pack_size: '500', pack_size_unit: 'GM', pack_price: 5.50, unit: 'GM', cost_per_unit: 0.011, trim_peel_waste_percentage: 8, yield_percentage: 92, supplier: 'Local Grower', storage_location: 'Cold Room B', product_code: 'BELL001' },
      { ingredient_name: 'Broccoli', brand: 'Local Grower', pack_size: '500', pack_size_unit: 'GM', pack_price: 4.20, unit: 'GM', cost_per_unit: 0.0084, trim_peel_waste_percentage: 10, yield_percentage: 90, supplier: 'Local Grower', storage_location: 'Cold Room B', product_code: 'BROCCOLI001' },
      { ingredient_name: 'Carrots', brand: 'Local Grower', pack_size: '1', pack_size_unit: 'KG', pack_price: 2.80, unit: 'GM', cost_per_unit: 0.0028, trim_peel_waste_percentage: 8, yield_percentage: 92, supplier: 'Local Grower', storage_location: 'Cold Room B', product_code: 'CARROT002' },
      { ingredient_name: 'Dark Chocolate', brand: 'Masterfoods', pack_size: '200', pack_size_unit: 'GM', pack_price: 6.50, unit: 'GM', cost_per_unit: 0.0325, trim_peel_waste_percentage: 0, yield_percentage: 100, supplier: 'Masterfoods', storage_location: 'Dry Storage', product_code: 'CHOCOLATE001' },
      { ingredient_name: 'Sugar', brand: 'Woolworths', pack_size: '1', pack_size_unit: 'KG', pack_price: 2.20, unit: 'GM', cost_per_unit: 0.0022, trim_peel_waste_percentage: 0, yield_percentage: 100, supplier: 'Woolworths', storage_location: 'Dry Storage', product_code: 'SUGAR002' },
      { ingredient_name: 'Vanilla Ice Cream', brand: 'Coles', pack_size: '1', pack_size_unit: 'L', pack_price: 5.50, unit: 'GM', cost_per_unit: 0.0055, trim_peel_waste_percentage: 0, yield_percentage: 100, supplier: 'Coles', storage_location: 'Freezer', product_code: 'ICECREAM001' },
      { ingredient_name: 'Tomatoes', brand: 'Local Grower', pack_size: '500', pack_size_unit: 'GM', pack_price: 4.20, unit: 'GM', cost_per_unit: 0.0084, trim_peel_waste_percentage: 5, yield_percentage: 95, supplier: 'Local Grower', storage_location: 'Cold Room B', product_code: 'TOMATO003' },
      { ingredient_name: 'Cream', brand: 'Woolworths', pack_size: '300', pack_size_unit: 'ML', pack_price: 3.20, unit: 'ML', cost_per_unit: 0.0107, trim_peel_waste_percentage: 0, yield_percentage: 100, supplier: 'Woolworths', storage_location: 'Cold Room A', product_code: 'CREAM002' },
      { ingredient_name: 'Basmati Rice', brand: 'Coles', pack_size: '1', pack_size_unit: 'KG', pack_price: 3.50, unit: 'GM', cost_per_unit: 0.0035, trim_peel_waste_percentage: 0, yield_percentage: 100, supplier: 'Coles', storage_location: 'Dry Storage', product_code: 'RICE002' },
      { ingredient_name: 'Ground Beef', brand: 'Local Butcher', pack_size: '500', pack_size_unit: 'GM', pack_price: 12.00, unit: 'GM', cost_per_unit: 0.024, trim_peel_waste_percentage: 5, yield_percentage: 95, supplier: 'Local Butcher', storage_location: 'Cold Room A', product_code: 'GROUND001' },
      { ingredient_name: 'Taco Shells', brand: 'Coles', pack_size: '12', pack_size_unit: 'PC', pack_price: 4.50, unit: 'PC', cost_per_unit: 0.375, trim_peel_waste_percentage: 0, yield_percentage: 100, supplier: 'Coles', storage_location: 'Dry Storage', product_code: 'TACO001' },
      { ingredient_name: 'Cheddar Cheese', brand: 'Coles', pack_size: '250', pack_size_unit: 'GM', pack_price: 6.50, unit: 'GM', cost_per_unit: 0.026, trim_peel_waste_percentage: 0, yield_percentage: 100, supplier: 'Coles', storage_location: 'Cold Room A', product_code: 'CHEDDAR001' },
      { ingredient_name: 'Sour Cream', brand: 'Woolworths', pack_size: '300', pack_size_unit: 'ML', pack_price: 3.50, unit: 'ML', cost_per_unit: 0.0117, trim_peel_waste_percentage: 0, yield_percentage: 100, supplier: 'Woolworths', storage_location: 'Cold Room A', product_code: 'SOUR001' },
      { ingredient_name: 'Salmon Fillet', brand: 'Seafood Market', pack_size: '300', pack_size_unit: 'GM', pack_price: 15.00, unit: 'GM', cost_per_unit: 0.05, trim_peel_waste_percentage: 10, yield_percentage: 90, supplier: 'Seafood Market', storage_location: 'Cold Room A', product_code: 'SALMON001' },
      { ingredient_name: 'Lemon', brand: 'Local Grower', pack_size: '1', pack_size_unit: 'KG', pack_price: 4.50, unit: 'PC', cost_per_unit: 0.45, trim_peel_waste_percentage: 20, yield_percentage: 80, supplier: 'Local Grower', storage_location: 'Cold Room B', product_code: 'LEMON001' },
      { ingredient_name: 'Fresh Herbs', brand: 'Local Grower', pack_size: '50', pack_size_unit: 'GM', pack_price: 4.50, unit: 'GM', cost_per_unit: 0.09, trim_peel_waste_percentage: 15, yield_percentage: 85, supplier: 'Local Grower', storage_location: 'Cold Room B', product_code: 'HERBS001' },
      { ingredient_name: 'Apples', brand: 'Local Grower', pack_size: '1', pack_size_unit: 'KG', pack_price: 4.20, unit: 'GM', cost_per_unit: 0.0042, trim_peel_waste_percentage: 10, yield_percentage: 90, supplier: 'Local Grower', storage_location: 'Cold Room B', product_code: 'APPLE001' },
      { ingredient_name: 'Oats', brand: 'Coles', pack_size: '500', pack_size_unit: 'GM', pack_price: 2.80, unit: 'GM', cost_per_unit: 0.0056, trim_peel_waste_percentage: 0, yield_percentage: 100, supplier: 'Coles', storage_location: 'Dry Storage', product_code: 'OATS001' },
      { ingredient_name: 'Cinnamon', brand: 'Masterfoods', pack_size: '50', pack_size_unit: 'GM', pack_price: 3.50, unit: 'GM', cost_per_unit: 0.07, trim_peel_waste_percentage: 0, yield_percentage: 100, supplier: 'Masterfoods', storage_location: 'Dry Storage', product_code: 'CINNAMON001' }
    ];

    // Insert additional ingredients
    for (const ingredient of additionalIngredients) {
      const { error } = await supabaseAdmin
        .from('ingredients')
        .upsert(ingredient, { onConflict: 'product_code' });
      
      if (error) {
        console.log(`Error inserting ingredient ${ingredient.ingredient_name}:`, error.message);
      }
    }

    // Insert 12 complete recipes
    const recipes = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Classic Beef Burger',
        description: 'Juicy beef patty with fresh vegetables and classic condiments',
        yield_quantity: 1,
        yield_unit: 'serving',
        instructions: '1. Form beef mince into patty and season with salt and pepper\n2. Heat grill pan over medium-high heat\n3. Cook patty for 4-5 minutes per side until internal temperature reaches 71°C\n4. Toast burger bun lightly\n5. Assemble: bottom bun, lettuce, tomato, patty, onion, pickles, top bun\n6. Serve immediately with fries',
        total_cost: 8.50,
        cost_per_serving: 8.50
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Margherita Pizza',
        description: 'Traditional Italian pizza with fresh mozzarella and basil',
        yield_quantity: 1,
        yield_unit: 'serving',
        instructions: '1. Preheat oven to 250°C\n2. Roll out pizza dough to 30cm diameter\n3. Spread tomato sauce evenly over dough\n4. Tear mozzarella into chunks and distribute\n5. Drizzle with olive oil and season with salt\n6. Bake for 12-15 minutes until crust is golden\n7. Remove from oven and top with fresh basil leaves\n8. Slice and serve hot',
        total_cost: 6.25,
        cost_per_serving: 6.25
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Chicken Caesar Salad',
        description: 'Classic Caesar salad with grilled chicken breast',
        yield_quantity: 1,
        yield_unit: 'serving',
        instructions: '1. Season chicken breast with salt, pepper, and garlic powder\n2. Grill chicken for 6-7 minutes per side until cooked through\n3. Let chicken rest for 5 minutes, then slice\n4. Toss romaine lettuce with Caesar dressing\n5. Add croutons and grated parmesan\n6. Top with sliced chicken breast\n7. Garnish with additional parmesan and black pepper',
        total_cost: 7.80,
        cost_per_serving: 7.80
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        name: 'Fish and Chips',
        description: 'Beer-battered fish with crispy chips and mushy peas',
        yield_quantity: 1,
        yield_unit: 'serving',
        instructions: '1. Cut potatoes into thick chips and parboil for 5 minutes\n2. Heat oil to 180°C for deep frying\n3. Make beer batter: mix flour, beer, and salt until smooth\n4. Dip fish fillets in batter and fry for 4-5 minutes until golden\n5. Fry chips for 3-4 minutes until crispy\n6. Make mushy peas: cook peas with butter and mint\n7. Serve fish and chips with mushy peas and tartar sauce',
        total_cost: 12.40,
        cost_per_serving: 12.40
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440005',
        name: 'Spaghetti Carbonara',
        description: 'Creamy Italian pasta with pancetta and parmesan',
        yield_quantity: 1,
        yield_unit: 'serving',
        instructions: '1. Cook spaghetti according to package directions\n2. Cut pancetta into small cubes and fry until crispy\n3. Beat eggs with grated parmesan and black pepper\n4. Drain pasta, reserving 1 cup of pasta water\n5. Return pasta to pot with pancetta and pasta water\n6. Remove from heat and quickly stir in egg mixture\n7. Toss until creamy sauce coats pasta\n8. Serve immediately with extra parmesan',
        total_cost: 9.20,
        cost_per_serving: 9.20
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440006',
        name: 'Beef Stir Fry',
        description: 'Quick and healthy beef with mixed vegetables',
        yield_quantity: 1,
        yield_unit: 'serving',
        instructions: '1. Slice beef into thin strips and marinate in soy sauce\n2. Heat wok or large pan over high heat\n3. Add oil and stir-fry beef for 2-3 minutes until browned\n4. Remove beef and set aside\n5. Add vegetables and stir-fry for 3-4 minutes\n6. Return beef to pan with sauce\n7. Toss everything together for 1 minute\n8. Serve over steamed rice',
        total_cost: 11.60,
        cost_per_serving: 11.60
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440007',
        name: 'Chocolate Lava Cake',
        description: 'Decadent chocolate cake with molten center',
        yield_quantity: 1,
        yield_unit: 'serving',
        instructions: '1. Preheat oven to 220°C\n2. Butter and flour ramekins\n3. Melt chocolate and butter together\n4. Beat eggs and sugar until pale and thick\n5. Fold in chocolate mixture and flour\n6. Pour batter into ramekins\n7. Bake for 12-14 minutes until edges are set but center is molten\n8. Let rest for 1 minute, then invert onto plate\n9. Serve with vanilla ice cream and berries',
        total_cost: 4.80,
        cost_per_serving: 4.80
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440008',
        name: 'Chicken Tikka Masala',
        description: 'Creamy Indian curry with tender chicken',
        yield_quantity: 1,
        yield_unit: 'serving',
        instructions: '1. Marinate chicken in yogurt and spices for 30 minutes\n2. Cook chicken in tandoor or grill until charred\n3. Make masala sauce: sauté onions, garlic, and ginger\n4. Add tomatoes, cream, and spices\n5. Simmer sauce for 20 minutes until thick\n6. Add cooked chicken and simmer for 10 minutes\n7. Garnish with fresh cilantro\n8. Serve with basmati rice and naan bread',
        total_cost: 13.20,
        cost_per_serving: 13.20
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440009',
        name: 'Caesar Salad (Vegetarian)',
        description: 'Classic Caesar salad without chicken',
        yield_quantity: 1,
        yield_unit: 'serving',
        instructions: '1. Wash and dry romaine lettuce thoroughly\n2. Tear lettuce into bite-sized pieces\n3. Make Caesar dressing: whisk together ingredients\n4. Toss lettuce with dressing until well coated\n5. Add croutons and grated parmesan\n6. Toss gently to combine\n7. Serve immediately with extra parmesan on top',
        total_cost: 5.40,
        cost_per_serving: 5.40
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440010',
        name: 'Beef Tacos',
        description: 'Spicy ground beef tacos with fresh toppings',
        yield_quantity: 3,
        yield_unit: 'serving',
        instructions: '1. Heat oil in large pan over medium-high heat\n2. Add ground beef and cook until browned\n3. Add taco seasoning and water, simmer for 5 minutes\n4. Warm tortillas in dry pan for 30 seconds each side\n5. Fill tortillas with beef mixture\n6. Top with lettuce, tomato, cheese, and sour cream\n7. Serve with lime wedges and hot sauce',
        total_cost: 7.50,
        cost_per_serving: 2.50
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440011',
        name: 'Pan-Seared Salmon Fillet',
        description: 'Perfectly cooked salmon with herb butter',
        yield_quantity: 1,
        yield_unit: 'serving',
        instructions: '1. Season salmon fillet with salt and pepper\n2. Heat oil in non-stick pan over medium-high heat\n3. Place salmon skin-side up and cook for 4-5 minutes\n4. Flip and cook for 3-4 minutes until flaky\n5. Make herb butter: mix butter with herbs and lemon\n6. Remove salmon from pan and top with herb butter\n7. Serve with roasted vegetables and rice',
        total_cost: 15.80,
        cost_per_serving: 15.80
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440012',
        name: 'Apple Crumble',
        description: 'Warm apple dessert with crispy topping',
        yield_quantity: 1,
        yield_unit: 'serving',
        instructions: '1. Preheat oven to 180°C\n2. Peel and slice apples, toss with sugar and cinnamon\n3. Place apples in baking dish\n4. Make crumble: rub butter into flour and sugar\n5. Add oats and mix until crumbly\n6. Sprinkle crumble over apples\n7. Bake for 30-35 minutes until golden and bubbling\n8. Serve warm with vanilla ice cream or custard',
        total_cost: 3.60,
        cost_per_serving: 3.60
      }
    ];

    // Insert recipes
    for (const recipe of recipes) {
      const { error } = await supabaseAdmin
        .from('recipes')
        .upsert(recipe, { onConflict: 'id' });
      
      if (error) {
        console.log(`Error inserting recipe ${recipe.name}:`, error.message);
      }
    }

    // Get ingredient IDs for recipe ingredients
    const { data: ingredients } = await supabaseAdmin
      .from('ingredients')
      .select('id, ingredient_name');

    const ingredientMap = new Map();
    ingredients?.forEach(ing => {
      ingredientMap.set(ing.ingredient_name, ing.id);
    });

    // Recipe ingredients data
    const recipeIngredients = [
      // Classic Beef Burger
      { recipe_id: '550e8400-e29b-41d4-a716-446655440001', ingredient_name: 'Beef Mince', quantity: 150, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440001', ingredient_name: 'Burger Bun', quantity: 1, unit: 'PC' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440001', ingredient_name: 'Lettuce', quantity: 20, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440001', ingredient_name: 'Tomato', quantity: 30, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440001', ingredient_name: 'Onion', quantity: 15, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440001', ingredient_name: 'Pickles', quantity: 10, unit: 'GM' },

      // Margherita Pizza
      { recipe_id: '550e8400-e29b-41d4-a716-446655440002', ingredient_name: 'Pizza Dough', quantity: 200, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440002', ingredient_name: 'Tomato Sauce', quantity: 80, unit: 'ML' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440002', ingredient_name: 'Mozzarella Cheese', quantity: 120, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440002', ingredient_name: 'Olive Oil Extra Virgin', quantity: 10, unit: 'ML' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440002', ingredient_name: 'Fresh Basil', quantity: 5, unit: 'GM' },

      // Chicken Caesar Salad
      { recipe_id: '550e8400-e29b-41d4-a716-446655440003', ingredient_name: 'Chicken Breast', quantity: 180, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440003', ingredient_name: 'Romaine Lettuce', quantity: 100, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440003', ingredient_name: 'Caesar Dressing', quantity: 30, unit: 'ML' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440003', ingredient_name: 'Croutons', quantity: 20, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440003', ingredient_name: 'Parmesan Cheese', quantity: 15, unit: 'GM' },

      // Fish and Chips
      { recipe_id: '550e8400-e29b-41d4-a716-446655440004', ingredient_name: 'Fish Fillet', quantity: 200, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440004', ingredient_name: 'Potatoes', quantity: 300, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440004', ingredient_name: 'Flour Plain', quantity: 50, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440004', ingredient_name: 'Beer', quantity: 100, unit: 'ML' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440004', ingredient_name: 'Peas', quantity: 80, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440004', ingredient_name: 'Cooking Oil', quantity: 200, unit: 'ML' },

      // Spaghetti Carbonara
      { recipe_id: '550e8400-e29b-41d4-a716-446655440005', ingredient_name: 'Spaghetti', quantity: 100, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440005', ingredient_name: 'Pancetta', quantity: 80, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440005', ingredient_name: 'Eggs Free Range', quantity: 2, unit: 'PC' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440005', ingredient_name: 'Parmesan Cheese', quantity: 40, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440005', ingredient_name: 'Black Pepper', quantity: 2, unit: 'GM' },

      // Beef Stir Fry
      { recipe_id: '550e8400-e29b-41d4-a716-446655440006', ingredient_name: 'Beef Strips', quantity: 150, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440006', ingredient_name: 'Bell Peppers', quantity: 100, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440006', ingredient_name: 'Broccoli', quantity: 80, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440006', ingredient_name: 'Carrots', quantity: 60, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440006', ingredient_name: 'Soy Sauce', quantity: 20, unit: 'ML' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440006', ingredient_name: 'Garlic', quantity: 5, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440006', ingredient_name: 'Ginger Fresh', quantity: 5, unit: 'GM' },

      // Chocolate Lava Cake
      { recipe_id: '550e8400-e29b-41d4-a716-446655440007', ingredient_name: 'Dark Chocolate', quantity: 100, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440007', ingredient_name: 'Butter Unsalted', quantity: 80, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440007', ingredient_name: 'Eggs Free Range', quantity: 2, unit: 'PC' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440007', ingredient_name: 'Sugar', quantity: 50, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440007', ingredient_name: 'Flour Plain', quantity: 30, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440007', ingredient_name: 'Vanilla Ice Cream', quantity: 60, unit: 'GM' },

      // Chicken Tikka Masala
      { recipe_id: '550e8400-e29b-41d4-a716-446655440008', ingredient_name: 'Chicken Breast', quantity: 200, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440008', ingredient_name: 'Yoghurt Natural', quantity: 100, unit: 'ML' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440008', ingredient_name: 'Tomatoes', quantity: 200, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440008', ingredient_name: 'Cream', quantity: 100, unit: 'ML' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440008', ingredient_name: 'Onion', quantity: 100, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440008', ingredient_name: 'Garlic', quantity: 10, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440008', ingredient_name: 'Ginger Fresh', quantity: 10, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440008', ingredient_name: 'Basmati Rice', quantity: 100, unit: 'GM' },

      // Caesar Salad (Vegetarian)
      { recipe_id: '550e8400-e29b-41d4-a716-446655440009', ingredient_name: 'Romaine Lettuce', quantity: 120, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440009', ingredient_name: 'Caesar Dressing', quantity: 40, unit: 'ML' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440009', ingredient_name: 'Croutons', quantity: 25, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440009', ingredient_name: 'Parmesan Cheese', quantity: 20, unit: 'GM' },

      // Beef Tacos
      { recipe_id: '550e8400-e29b-41d4-a716-446655440010', ingredient_name: 'Ground Beef', quantity: 200, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440010', ingredient_name: 'Taco Shells', quantity: 3, unit: 'PC' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440010', ingredient_name: 'Lettuce', quantity: 50, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440010', ingredient_name: 'Tomato', quantity: 60, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440010', ingredient_name: 'Cheddar Cheese', quantity: 40, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440010', ingredient_name: 'Sour Cream', quantity: 30, unit: 'ML' },

      // Pan-Seared Salmon Fillet
      { recipe_id: '550e8400-e29b-41d4-a716-446655440011', ingredient_name: 'Salmon Fillet', quantity: 200, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440011', ingredient_name: 'Butter Unsalted', quantity: 20, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440011', ingredient_name: 'Lemon', quantity: 1, unit: 'PC' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440011', ingredient_name: 'Fresh Herbs', quantity: 5, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440011', ingredient_name: 'Cooking Oil', quantity: 15, unit: 'ML' },

      // Apple Crumble
      { recipe_id: '550e8400-e29b-41d4-a716-446655440012', ingredient_name: 'Apples', quantity: 200, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440012', ingredient_name: 'Sugar', quantity: 60, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440012', ingredient_name: 'Flour Plain', quantity: 80, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440012', ingredient_name: 'Butter Unsalted', quantity: 60, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440012', ingredient_name: 'Oats', quantity: 40, unit: 'GM' },
      { recipe_id: '550e8400-e29b-41d4-a716-446655440012', ingredient_name: 'Cinnamon', quantity: 2, unit: 'GM' }
    ];

    // Insert recipe ingredients
    for (const ri of recipeIngredients) {
      const ingredientId = ingredientMap.get(ri.ingredient_name);
      if (ingredientId) {
        const { error } = await supabaseAdmin
          .from('recipe_ingredients')
          .upsert({
            recipe_id: ri.recipe_id,
            ingredient_id: ingredientId,
            quantity: ri.quantity,
            unit: ri.unit
          }, { onConflict: 'recipe_id,ingredient_id' });
        
        if (error) {
          console.log(`Error inserting recipe ingredient ${ri.ingredient_name}:`, error.message);
        }
      } else {
        console.log(`Ingredient not found: ${ri.ingredient_name}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully populated 12 sample recipes with complete ingredient lists!',
      data: {
        recipes_added: 12,
        ingredients_added: additionalIngredients.length,
        recipe_ingredients_added: recipeIngredients.length
      }
    });

  } catch (error) {
    console.error('Error populating recipes:', error);
    return NextResponse.json({
      error: 'Failed to populate recipes',
      message: 'There was an error adding the sample recipes to the database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
