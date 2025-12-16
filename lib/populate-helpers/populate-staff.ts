/**
 * Helper function for populating staff/employee test data
 */

import { createSupabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

interface PopulateResults {
  cleaned: number;
  populated: Array<{ table: string; count: number }>;
  errors: Array<{ table: string; error: string }>;
}

/**
 * Populate staff/employee test data
 */
export async function populateStaff(
  supabaseAdmin: ReturnType<typeof createSupabaseAdmin>,
  results: PopulateResults,
): Promise<any[]> {
  try {
    // Check if employees table exists
    const { error: tableCheckError } = await supabaseAdmin.from('employees').select('id').limit(1);
    if (tableCheckError && tableCheckError.code === '42P01') {
      results.errors.push({
        table: 'employees',
        error:
          'Employees table does not exist. Please run add-employee-management.sql migration first.',
      });
      logger.error('Employees table does not exist. Run add-employee-management.sql migration.');
      return [];
    }

    // Check for existing employees
    const { data: existingEmployees } = await supabaseAdmin.from('employees').select('full_name');
    const existingEmployeeNames = new Set(
      (existingEmployees || []).map(e => e.full_name?.toLowerCase().trim()).filter(Boolean),
    );

    // Define 5 test staff members
    const staffMembers = [
      {
        full_name: 'Sarah Chen',
        role: 'Head Chef',
        employment_start_date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0], // 1 year ago
        status: 'active',
        phone: '+61 400 123 456',
        email: 'sarah.chen@prepflow.test',
        emergency_contact: 'John Chen - +61 400 123 457',
        notes: 'Experienced chef with 10+ years in fine dining',
      },
      {
        full_name: 'Marcus Johnson',
        role: 'Sous Chef',
        employment_start_date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0], // 6 months ago
        status: 'active',
        phone: '+61 400 123 458',
        email: 'marcus.johnson@prepflow.test',
        emergency_contact: 'Lisa Johnson - +61 400 123 459',
        notes: 'Specializes in pastry and desserts',
      },
      {
        full_name: 'Emma Williams',
        role: 'Line Cook',
        employment_start_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0], // 3 months ago
        status: 'active',
        phone: '+61 400 123 460',
        emergency_contact: 'David Williams - +61 400 123 461',
        notes: 'Fast learner, great with grill station',
      },
      {
        full_name: 'James Taylor',
        role: 'Prep Cook',
        employment_start_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0], // 2 months ago
        status: 'active',
        phone: '+61 400 123 462',
        notes: 'Reliable morning prep, excellent knife skills',
      },
      {
        full_name: 'Olivia Brown',
        role: 'Dishwasher',
        employment_start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0], // 1 month ago
        status: 'active',
        phone: '+61 400 123 463',
        notes: 'Part-time evening shifts',
      },
    ];

    // Filter out existing employees
    const staffToInsert = staffMembers.filter(
      s => !existingEmployeeNames.has(s.full_name.toLowerCase().trim()),
    );

    if (staffToInsert.length === 0) {
      logger.dev('All staff members already exist, skipping insert');
      // Fetch existing employees for return
      const { data } = await supabaseAdmin.from('employees').select().eq('status', 'active');
      return data || [];
    }

    // Insert staff members
    const { data, error } = await supabaseAdmin.from('employees').insert(staffToInsert).select();

    if (error) {
      results.errors.push({ table: 'employees', error: error.message });
      logger.error('Error populating staff:', error);
      return [];
    }

    const insertedStaff = data || [];
    results.populated.push({ table: 'employees', count: insertedStaff.length });
    logger.dev(`✅ Populated ${insertedStaff.length} staff members`);

    if (staffToInsert.length < staffMembers.length) {
      logger.dev(`Skipped ${staffMembers.length - staffToInsert.length} duplicate staff members`);
    }

    // Return all active employees (including existing ones)
    const { data: allActiveStaff } = await supabaseAdmin
      .from('employees')
      .select()
      .eq('status', 'active');
    return allActiveStaff || [];
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    results.errors.push({ table: 'employees', error: errorMessage });
    logger.error('Error populating staff:', err);
    return [];
  }
}




