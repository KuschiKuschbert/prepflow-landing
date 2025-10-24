import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST() {
  // cleaned: Added environment protection to prevent demo data in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      {
        error: 'Simple test data population is not allowed in production',
        message: 'This endpoint is only available in development mode',
      },
      { status: 403 },
    );
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin client not available' }, { status: 500 });
  }

  try {
    const results = {
      populated: [] as any[],
      errors: [] as any[],
    };

    // Insert cleaning areas (using correct column names)
    console.log('🧽 Populating cleaning areas...');
    const cleaningAreas = [
      {
        area_name: 'Kitchen Floor',
        description: 'Main kitchen floor area',
        cleaning_frequency: 'Daily',
      },
      {
        area_name: 'Prep Station',
        description: 'Food preparation area',
        cleaning_frequency: 'After each use',
      },
      {
        area_name: 'Storage Area',
        description: 'Dry storage and cold storage',
        cleaning_frequency: 'Weekly',
      },
      {
        area_name: 'Dining Area',
        description: 'Customer dining tables and chairs',
        cleaning_frequency: 'After each service',
      },
      {
        area_name: 'Bathroom',
        description: 'Staff and customer bathrooms',
        cleaning_frequency: 'Every 2 hours',
      },
      {
        area_name: 'Equipment',
        description: 'Kitchen equipment and appliances',
        cleaning_frequency: 'After each use',
      },
    ];

    for (const area of cleaningAreas) {
      try {
        const { error } = await supabaseAdmin.from('cleaning_areas').insert(area);

        if (error) {
          results.errors.push({
            table: 'cleaning_areas',
            area: area.area_name,
            error: error.message,
          });
        } else {
          results.populated.push({
            table: 'cleaning_areas',
            action: 'inserted',
            area: area.area_name,
          });
        }
      } catch (err: any) {
        results.errors.push({ table: 'cleaning_areas', area: area.area_name, error: err.message });
      }
    }

    // Insert suppliers (using correct column names)
    console.log('🚚 Populating suppliers...');
    const suppliers = [
      {
        supplier_name: 'Fresh Produce Co',
        contact_person: 'John Smith',
        email: 'john@freshproduce.com',
        phone: '0412 345 678',
        address: '123 Market St, Brisbane QLD 4000',
      },
      {
        supplier_name: 'Meat Suppliers Ltd',
        contact_person: 'Sarah Johnson',
        email: 'sarah@meatsuppliers.com',
        phone: '0413 456 789',
        address: '456 Industrial Ave, Brisbane QLD 4000',
      },
      {
        supplier_name: 'Dairy Direct',
        contact_person: 'Mike Brown',
        email: 'mike@dairydirect.com',
        phone: '0414 567 890',
        address: '789 Farm Rd, Brisbane QLD 4000',
      },
      {
        supplier_name: 'Local Grower',
        contact_person: 'Emma Wilson',
        email: 'emma@localgrower.com',
        phone: '0415 678 901',
        address: '321 Green St, Brisbane QLD 4000',
      },
      {
        supplier_name: 'Seafood Direct',
        contact_person: 'Tom Davis',
        email: 'tom@seafooddirect.com',
        phone: '0416 789 012',
        address: '654 Harbor View, Brisbane QLD 4000',
      },
    ];

    for (const supplier of suppliers) {
      try {
        const { error } = await supabaseAdmin.from('suppliers').insert(supplier);

        if (error) {
          results.errors.push({
            table: 'suppliers',
            supplier: supplier.supplier_name,
            error: error.message,
          });
        } else {
          results.populated.push({
            table: 'suppliers',
            action: 'inserted',
            supplier: supplier.supplier_name,
          });
        }
      } catch (err: any) {
        results.errors.push({
          table: 'suppliers',
          supplier: supplier.supplier_name,
          error: err.message,
        });
      }
    }

    // Insert compliance types (using correct column names)
    console.log('📋 Populating compliance types...');
    const complianceTypes = [
      {
        type_name: 'Temperature Check',
        description: 'Monitor food storage temperatures',
        frequency: 'Daily',
      },
      {
        type_name: 'Cleaning Schedule',
        description: 'Verify cleaning tasks completion',
        frequency: 'Daily',
      },
      {
        type_name: 'Stock Rotation',
        description: 'Check for expired products',
        frequency: 'Weekly',
      },
      {
        type_name: 'Food Safety Training',
        description: 'Staff food safety training records',
        frequency: 'Monthly',
      },
      {
        type_name: 'Pest Control',
        description: 'Pest control inspection and treatment',
        frequency: 'Monthly',
      },
    ];

    for (const type of complianceTypes) {
      try {
        const { error } = await supabaseAdmin.from('compliance_types').insert(type);

        if (error) {
          results.errors.push({
            table: 'compliance_types',
            type: type.type_name,
            error: error.message,
          });
        } else {
          results.populated.push({
            table: 'compliance_types',
            action: 'inserted',
            type: type.type_name,
          });
        }
      } catch (err: any) {
        results.errors.push({
          table: 'compliance_types',
          type: type.type_name,
          error: err.message,
        });
      }
    }

    // Insert kitchen sections (using correct column names)
    console.log('🍳 Populating kitchen sections...');
    const kitchenSections = [
      { section_name: 'Hot Kitchen', description: 'Main cooking area with stoves and ovens' },
      { section_name: 'Cold Kitchen', description: 'Salad and cold food preparation area' },
      { section_name: 'Grill Station', description: 'Grilled items and BBQ preparation' },
      { section_name: 'Pastry Section', description: 'Desserts and baked goods preparation' },
      { section_name: 'Prep Station', description: 'General food preparation and mise en place' },
      { section_name: 'Dishwashing', description: 'Dishwashing and cleaning station' },
    ];

    for (const section of kitchenSections) {
      try {
        const { error } = await supabaseAdmin.from('kitchen_sections').insert(section);

        if (error) {
          results.errors.push({
            table: 'kitchen_sections',
            section: section.section_name,
            error: error.message,
          });
        } else {
          results.populated.push({
            table: 'kitchen_sections',
            action: 'inserted',
            section: section.section_name,
          });
        }
      } catch (err: any) {
        results.errors.push({
          table: 'kitchen_sections',
          section: section.section_name,
          error: err.message,
        });
      }
    }

    // Insert temperature equipment (using correct column names)
    console.log('🌡️ Populating temperature equipment...');
    const temperatureEquipment = [
      {
        name: 'Main Refrigerator',
        equipment_type: 'Cold Storage',
        location: 'Kitchen',
        min_temp_celsius: 0,
        max_temp_celsius: 5,
      },
      {
        name: 'Walk-in Freezer',
        equipment_type: 'Freezer',
        location: 'Storage Room',
        min_temp_celsius: -24,
        max_temp_celsius: -18,
      },
      {
        name: 'Hot Holding Cabinet',
        equipment_type: 'Hot Holding',
        location: 'Service Area',
        min_temp_celsius: 60,
        max_temp_celsius: 75,
      },
      {
        name: 'Display Fridge',
        equipment_type: 'Cold Storage',
        location: 'Service Area',
        min_temp_celsius: 0,
        max_temp_celsius: 5,
      },
      {
        name: 'Ice Machine',
        equipment_type: 'Ice Production',
        location: 'Bar Area',
        min_temp_celsius: -2,
        max_temp_celsius: 0,
      },
    ];

    for (const equipment of temperatureEquipment) {
      try {
        const { error } = await supabaseAdmin.from('temperature_equipment').insert(equipment);

        if (error) {
          results.errors.push({
            table: 'temperature_equipment',
            equipment: equipment.name,
            error: error.message,
          });
        } else {
          results.populated.push({
            table: 'temperature_equipment',
            action: 'inserted',
            equipment: equipment.name,
          });
        }
      } catch (err: any) {
        results.errors.push({
          table: 'temperature_equipment',
          equipment: equipment.name,
          error: err.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Simple test data population completed',
      summary: {
        populated: results.populated.length,
        errors: results.errors.length,
      },
      results: results.populated,
      errors: results.errors,
      nextSteps: [
        'Run the COMPLETE_TABLE_STRUCTURE_FIX.sql script in Supabase SQL Editor first',
        'Then run this API again for complete data population',
        'Visit /webapp to see all populated data',
      ],
    });
  } catch (err: any) {
    console.error('Error during simple test data population:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error during test data population',
        details: err.message,
      },
      { status: 500 },
    );
  }
}
