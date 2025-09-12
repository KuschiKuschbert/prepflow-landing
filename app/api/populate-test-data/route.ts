import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST() {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin client not available' }, { status: 500 });
  }

  try {
    const results = {
      cleaned: [] as any[],
      populated: [] as any[],
      errors: [] as any[]
    };

    // Step 1: Clean up duplicate menu dishes and link to recipes
    console.log('🧹 Cleaning up duplicate menu dishes...');
    
    // Get unique dish names with their latest entries
    const { data: dishes, error: dishesError } = await supabaseAdmin
      .from('menu_dishes')
      .select('*')
      .order('created_at', { ascending: false });

    if (dishesError) {
      results.errors.push({ step: 'fetch_dishes', error: dishesError.message });
    } else {
      // Group by name and keep only the latest
      const uniqueDishes = new Map();
      dishes?.forEach(dish => {
        if (!uniqueDishes.has(dish.name) || new Date(dish.created_at) > new Date(uniqueDishes.get(dish.name).created_at)) {
          uniqueDishes.set(dish.name, dish);
        }
      });

      // Delete duplicates
      const duplicateIds = dishes?.filter(dish => dish.id !== uniqueDishes.get(dish.name)?.id).map(d => d.id) || [];
      
      if (duplicateIds.length > 0) {
        const { error: deleteError } = await supabaseAdmin
          .from('menu_dishes')
          .delete()
          .in('id', duplicateIds);
        
        if (deleteError) {
          results.errors.push({ step: 'delete_duplicates', error: deleteError.message });
        } else {
          results.cleaned.push({ action: 'deleted_duplicates', count: duplicateIds.length });
        }
      }

      // Link menu dishes to recipes where possible
      const { data: recipes } = await supabaseAdmin.from('recipes').select('*');
      const recipeMap = new Map(recipes?.map(r => [r.name.toLowerCase(), r.id]) || []);

      for (const [name, dish] of uniqueDishes) {
        const recipeId = recipeMap.get(name.toLowerCase());
        if (recipeId && !dish.recipe_id) {
          const { error: updateError } = await supabaseAdmin
            .from('menu_dishes')
            .update({ recipe_id: recipeId })
            .eq('id', dish.id);
          
          if (updateError) {
            results.errors.push({ step: 'link_recipe', dish: name, error: updateError.message });
          } else {
            results.cleaned.push({ action: 'linked_recipe', dish: name, recipe_id: recipeId });
          }
        }
      }
    }

    // Step 2: Populate Cleaning Areas
    console.log('🧽 Populating cleaning areas...');
    const cleaningAreas = [
      { area_name: 'Kitchen Floor', description: 'Main kitchen floor area', cleaning_frequency: 'Daily' },
      { area_name: 'Prep Station', description: 'Food preparation area', cleaning_frequency: 'After each use' },
      { area_name: 'Storage Area', description: 'Dry storage and cold storage', cleaning_frequency: 'Weekly' },
      { area_name: 'Dining Area', description: 'Customer dining tables and chairs', cleaning_frequency: 'After each service' },
      { area_name: 'Bathroom', description: 'Staff and customer bathrooms', cleaning_frequency: 'Every 2 hours' },
      { area_name: 'Equipment', description: 'Kitchen equipment and appliances', cleaning_frequency: 'After each use' },
      { area_name: 'Windows & Doors', description: 'All windows and entry doors', cleaning_frequency: 'Weekly' },
      { area_name: 'Garbage Area', description: 'Garbage bins and waste disposal area', cleaning_frequency: 'Daily' }
    ];

    for (const area of cleaningAreas) {
      const { error } = await supabaseAdmin
        .from('cleaning_areas')
        .upsert(area, { onConflict: 'area_name' });
      
      if (error) {
        results.errors.push({ step: 'cleaning_areas', area: area.area_name, error: error.message });
      }
    }

    // Step 3: Populate Cleaning Tasks
    console.log('🧹 Populating cleaning tasks...');
    const { data: areas } = await supabaseAdmin.from('cleaning_areas').select('*');
    const areaMap = new Map(areas?.map(a => [a.area_name, a.id]) || []);

    const cleaningTasks = [
      { area: 'Kitchen Floor', task_name: 'Sweep and Mop', description: 'Clean kitchen floor thoroughly', frequency: 'Daily', duration: 30 },
      { area: 'Prep Station', task_name: 'Sanitize Surfaces', description: 'Clean and sanitize all prep surfaces', frequency: 'After each use', duration: 15 },
      { area: 'Storage Area', task_name: 'Organize Storage', description: 'Check dates and organize storage areas', frequency: 'Weekly', duration: 45 },
      { area: 'Dining Area', task_name: 'Clean Tables', description: 'Wipe down all dining tables and chairs', frequency: 'After each service', duration: 20 },
      { area: 'Bathroom', task_name: 'Deep Clean', description: 'Clean toilets, sinks, and restock supplies', frequency: 'Every 2 hours', duration: 25 },
      { area: 'Equipment', task_name: 'Sanitize Equipment', description: 'Clean and sanitize all cooking equipment', frequency: 'After each use', duration: 30 },
      { area: 'Windows & Doors', task_name: 'Clean Glass', description: 'Clean all windows and door glass', frequency: 'Weekly', duration: 60 },
      { area: 'Garbage Area', task_name: 'Empty Bins', description: 'Empty garbage bins and clean area', frequency: 'Daily', duration: 15 }
    ];

    for (const task of cleaningTasks) {
      const areaId = areaMap.get(task.area);
      if (areaId) {
        const { error } = await supabaseAdmin
          .from('cleaning_tasks')
          .upsert({
            area_id: areaId,
            task_name: task.task_name,
            description: task.description,
            frequency: task.frequency,
            estimated_duration_minutes: task.duration
          }, { onConflict: 'area_id,task_name' });
        
        if (error) {
          results.errors.push({ step: 'cleaning_tasks', task: task.task_name, error: error.message });
        }
      }
    }

    // Step 4: Populate Suppliers
    console.log('🚚 Populating suppliers...');
    const suppliers = [
      { supplier_name: 'Fresh Produce Co', contact_person: 'John Smith', email: 'john@freshproduce.com', phone: '0412 345 678', address: '123 Market St, Brisbane QLD 4000' },
      { supplier_name: 'Meat Suppliers Ltd', contact_person: 'Sarah Johnson', email: 'sarah@meatsuppliers.com', phone: '0413 456 789', address: '456 Industrial Ave, Brisbane QLD 4000' },
      { supplier_name: 'Dairy Direct', contact_person: 'Mike Brown', email: 'mike@dairydirect.com', phone: '0414 567 890', address: '789 Farm Rd, Brisbane QLD 4000' },
      { supplier_name: 'Local Grower', contact_person: 'Emma Wilson', email: 'emma@localgrower.com', phone: '0415 678 901', address: '321 Green St, Brisbane QLD 4000' },
      { supplier_name: 'Seafood Direct', contact_person: 'Tom Davis', email: 'tom@seafooddirect.com', phone: '0416 789 012', address: '654 Harbor View, Brisbane QLD 4000' },
      { supplier_name: 'Bulk Foods', contact_person: 'Lisa Chen', email: 'lisa@bulkfoods.com', phone: '0417 890 123', address: '987 Warehouse Blvd, Brisbane QLD 4000' },
      { supplier_name: 'Coles', contact_person: 'Store Manager', email: 'store@coles.com', phone: '1300 765 123', address: 'Multiple locations' },
      { supplier_name: 'Woolworths', contact_person: 'Store Manager', email: 'store@woolworths.com', phone: '1300 767 123', address: 'Multiple locations' },
      { supplier_name: 'Local Butcher', contact_person: 'Dave Roberts', email: 'dave@localbutcher.com', phone: '0418 901 234', address: '147 Butcher St, Brisbane QLD 4000' },
      { supplier_name: 'Masterfoods', contact_person: 'Karen Lee', email: 'karen@masterfoods.com', phone: '0419 012 345', address: '258 Spice Ave, Brisbane QLD 4000' }
    ];

    for (const supplier of suppliers) {
      const { error } = await supabaseAdmin
        .from('suppliers')
        .upsert(supplier, { onConflict: 'supplier_name' });
      
      if (error) {
        results.errors.push({ step: 'suppliers', supplier: supplier.supplier_name, error: error.message });
      }
    }

    // Step 5: Populate Compliance Types
    console.log('📋 Populating compliance types...');
    const complianceTypes = [
      { type_name: 'Temperature Check', description: 'Monitor food storage temperatures', frequency: 'Daily' },
      { type_name: 'Cleaning Schedule', description: 'Verify cleaning tasks completion', frequency: 'Daily' },
      { type_name: 'Stock Rotation', description: 'Check for expired products', frequency: 'Weekly' },
      { type_name: 'Food Safety Training', description: 'Staff food safety training records', frequency: 'Monthly' },
      { type_name: 'Pest Control', description: 'Pest control inspection and treatment', frequency: 'Monthly' },
      { type_name: 'Equipment Maintenance', description: 'Kitchen equipment maintenance checks', frequency: 'Weekly' },
      { type_name: 'Health Inspection', description: 'Council health inspection preparation', frequency: 'Quarterly' },
      { type_name: 'Allergen Management', description: 'Allergen control and labeling verification', frequency: 'Daily' }
    ];

    for (const type of complianceTypes) {
      const { error } = await supabaseAdmin
        .from('compliance_types')
        .upsert(type, { onConflict: 'type_name' });
      
      if (error) {
        results.errors.push({ step: 'compliance_types', type: type.type_name, error: error.message });
      }
    }

    // Step 6: Populate Kitchen Sections
    console.log('🍳 Populating kitchen sections...');
    const kitchenSections = [
      { section_name: 'Hot Kitchen', description: 'Main cooking area with stoves and ovens' },
      { section_name: 'Cold Kitchen', description: 'Salad and cold food preparation area' },
      { section_name: 'Grill Station', description: 'Grilled items and BBQ preparation' },
      { section_name: 'Pastry Section', description: 'Desserts and baked goods preparation' },
      { section_name: 'Prep Station', description: 'General food preparation and mise en place' },
      { section_name: 'Dishwashing', description: 'Dishwashing and cleaning station' },
      { section_name: 'Storage', description: 'Dry and cold storage areas' },
      { section_name: 'Service', description: 'Food plating and service area' }
    ];

    for (const section of kitchenSections) {
      const { error } = await supabaseAdmin
        .from('kitchen_sections')
        .upsert(section, { onConflict: 'section_name' });
      
      if (error) {
        results.errors.push({ step: 'kitchen_sections', section: section.section_name, error: error.message });
      }
    }

    // Step 7: Populate Temperature Equipment
    console.log('🌡️ Populating temperature equipment...');
    const temperatureEquipment = [
      { name: 'Main Refrigerator', equipment_type: 'Cold Storage', location: 'Kitchen', min_temp_celsius: 0, max_temp_celsius: 5 },
      { name: 'Walk-in Freezer', equipment_type: 'Freezer', location: 'Storage Room', min_temp_celsius: -24, max_temp_celsius: -18 },
      { name: 'Hot Holding Cabinet', equipment_type: 'Hot Holding', location: 'Service Area', min_temp_celsius: 60, max_temp_celsius: 75 },
      { name: 'Display Fridge', equipment_type: 'Cold Storage', location: 'Service Area', min_temp_celsius: 0, max_temp_celsius: 5 },
      { name: 'Ice Machine', equipment_type: 'Ice Production', location: 'Bar Area', min_temp_celsius: -2, max_temp_celsius: 0 },
      { name: 'Beer Cooler', equipment_type: 'Cold Storage', location: 'Bar Area', min_temp_celsius: 2, max_temp_celsius: 8 },
      { name: 'Wine Fridge', equipment_type: 'Cold Storage', location: 'Storage Room', min_temp_celsius: 10, max_temp_celsius: 15 },
      { name: 'Prep Fridge', equipment_type: 'Cold Storage', location: 'Prep Station', min_temp_celsius: 0, max_temp_celsius: 5 }
    ];

    for (const equipment of temperatureEquipment) {
      const { error } = await supabaseAdmin
        .from('temperature_equipment')
        .upsert(equipment, { onConflict: 'name' });
      
      if (error) {
        results.errors.push({ step: 'temperature_equipment', equipment: equipment.name, error: error.message });
      }
    }

    // Step 8: Create sample compliance records for today
    console.log('📝 Creating compliance records...');
    const { data: complianceTypesData } = await supabaseAdmin.from('compliance_types').select('*');
    const today = new Date().toISOString().split('T')[0];

    for (const type of complianceTypesData || []) {
      const { error } = await supabaseAdmin
        .from('compliance_records')
        .upsert({
          compliance_type_id: type.id,
          record_date: today,
          status: 'Completed',
          notes: `Daily ${type.type_name} completed successfully`,
          recorded_by: 'System Admin'
        }, { onConflict: 'compliance_type_id,record_date' });
      
      if (error) {
        results.errors.push({ step: 'compliance_records', type: type.type_name, error: error.message });
      }
    }

    // Step 9: Create sample prep lists for today
    console.log('📋 Creating prep lists...');
    const { data: sections } = await supabaseAdmin.from('kitchen_sections').select('*');

    for (const section of sections || []) {
      const { error } = await supabaseAdmin
        .from('prep_lists')
        .upsert({
          prep_date: today,
          section_id: section.id,
          status: 'Pending'
        }, { onConflict: 'prep_date,section_id' });
      
      if (error) {
        results.errors.push({ step: 'prep_lists', section: section.section_name, error: error.message });
      }
    }

    // Step 10: Create sample order lists for today
    console.log('📦 Creating order lists...');
    const { data: suppliersData } = await supabaseAdmin.from('suppliers').select('*');
    const sampleSuppliers = suppliersData?.slice(0, 3) || [];

    for (const supplier of sampleSuppliers) {
      const { error } = await supabaseAdmin
        .from('order_lists')
        .upsert({
          order_date: today,
          supplier_id: supplier.id,
          status: 'Draft',
          total_amount: 0
        }, { onConflict: 'order_date,supplier_id' });
      
      if (error) {
        results.errors.push({ step: 'order_lists', supplier: supplier.supplier_name, error: error.message });
      }
    }

    results.populated.push(
      { table: 'cleaning_areas', count: cleaningAreas.length },
      { table: 'cleaning_tasks', count: cleaningTasks.length },
      { table: 'suppliers', count: suppliers.length },
      { table: 'compliance_types', count: complianceTypes.length },
      { table: 'kitchen_sections', count: kitchenSections.length },
      { table: 'temperature_equipment', count: temperatureEquipment.length },
      { table: 'compliance_records', count: complianceTypesData?.length || 0 },
      { table: 'prep_lists', count: sections?.length || 0 },
      { table: 'order_lists', count: sampleSuppliers.length }
    );

    return NextResponse.json({
      success: true,
      message: 'Test data population completed',
      summary: {
        cleaned: results.cleaned.length,
        populated: results.populated.length,
        errors: results.errors.length
      },
      results,
      nextSteps: [
        'Visit /webapp to see all populated data',
        'Check /webapp/setup for data management',
        'Use /webapp/cleaning for cleaning tasks',
        'Use /webapp/compliance for compliance tracking'
      ]
    });

  } catch (err: any) {
    console.error('Error during test data population:', err);
    return NextResponse.json({
      success: false,
      error: 'Internal server error during test data population',
      details: err.message
    }, { status: 500 });
  }
}
