/**
 * Fetch employee roster with qualifications
 */

import { logger } from '@/lib/logger';
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

interface EmployeeQualification {
  id: string;
  employee_id: string;
  qualification_type_id: string;
  issue_date?: string;
  expiry_date?: string;
  notes?: string;
  qualification_types?: {
    id: string;
    name?: string;
    description?: string;
    is_required?: boolean;
    default_expiry_days?: number;
  };
}

/**
 * Fetches active employees with their qualifications.
 *
 * @returns {Promise<{employees: Employee[] | null, qualifications: Qualification[] | null}>} Employees and qualifications data
 */
export async function fetchEmployees() {
  if (!supabaseAdmin) return { employees: null, qualifications: null };

  const { data: employees, error: employeesError } = await supabaseAdmin
    .from('employees')
    .select(EMPLOYEE_SELECT)
    .eq('status', 'active')
    .order('full_name');

  if (employeesError) {
    logger.warn('[Health Inspector Report] Error fetching employees:', {
      error: employeesError.message,
      code: employeesError.code,
    });
    return { employees: null, qualifications: null };
  }

  // Qualification Summary
  const allQualifications: Array<{ employee_name: string; employee_role: string; expiry_date?: string } & Record<string, unknown>> = [];
  employees?.forEach(emp => {
    if (emp.employee_qualifications) {
      (emp.employee_qualifications as EmployeeQualification[]).forEach((qual) => {
        allQualifications.push({
          employee_name: emp.full_name as string,
          employee_role: emp.role as string,
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
