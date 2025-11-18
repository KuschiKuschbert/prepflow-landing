/**
 * Fetch employee roster with qualifications
 */

import { supabaseAdmin } from '@/lib/supabase';

const EMPLOYEE_SELECT = `
  *,
  employee_qualifications (
    *,
    qualification_types (
      id,
      name,
      description,
      is_required,
      default_expiry_days
    )
  )
`;

export async function fetchEmployees() {
  if (!supabaseAdmin) return { employees: null, qualifications: null };

  const { data: employees, error: employeesError } = await supabaseAdmin
    .from('employees')
    .select(EMPLOYEE_SELECT)
    .eq('status', 'active')
    .order('full_name');

  if (employeesError) {
    return { employees: null, qualifications: null };
  }

  // Qualification Summary
  const allQualifications: any[] = [];
  employees?.forEach(emp => {
    if (emp.employee_qualifications) {
      emp.employee_qualifications.forEach((qual: any) => {
        allQualifications.push({
          employee_name: emp.full_name,
          employee_role: emp.role,
          ...qual,
        });
      });
    }
  });

  const qualifications = {
    all_qualifications: allQualifications,
    expiring_soon: allQualifications.filter(qual => {
      if (!qual.expiry_date) return false;
      const expiry = new Date(qual.expiry_date);
      const today = new Date();
      const daysUntilExpiry = Math.ceil(
        (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );
      return daysUntilExpiry > 0 && daysUntilExpiry <= 90; // Expiring within 90 days
    }),
    expired: allQualifications.filter(qual => {
      if (!qual.expiry_date) return false;
      return new Date(qual.expiry_date) < new Date();
    }),
  };

  return {
    employees: employees || [],
    qualifications,
  };
}
