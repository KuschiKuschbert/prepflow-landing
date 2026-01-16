import type { CreateEmployeeInput } from './schemas';

type ValidationResult =
  | { isValid: true; data: CreateEmployeeInput }
  | { isValid: false; error: string };

/**
 * Validates employee request data.
 *
 * @param {unknown} body - Request body
 * @returns {ValidationResult} Validation result
 */
export function validateEmployeeRequest(body: unknown): ValidationResult {
  if (typeof body !== 'object' || body === null) {
    return { isValid: false, error: 'Invalid request body' };
  }

  const b = body as Record<string, unknown>;

  if (!b.first_name || typeof b.first_name !== 'string') {
    return { isValid: false, error: 'First name is required' };
  }

  if (!b.last_name || typeof b.last_name !== 'string') {
    return { isValid: false, error: 'Last name is required' };
  }

  if (!b.email || typeof b.email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(b.email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  // Validate role
  const validRoles = ['admin', 'manager', 'staff'] as const;
  if (b.role && !validRoles.includes(b.role as typeof validRoles[number])) {
    return { isValid: false, error: `Invalid role. Must be one of: ${validRoles.join(', ')}` };
  }

  // Validate employment type
  const validEmploymentTypes = ['full-time', 'part-time', 'casual'] as const;
  if (b.employment_type && !validEmploymentTypes.includes(b.employment_type as typeof validEmploymentTypes[number])) {
    return {
      isValid: false,
      error: `Invalid employment type. Must be one of: ${validEmploymentTypes.join(', ')}`,
    };
  }

  // Validate hourly rate
  if (b.hourly_rate !== undefined) {
    const rate = parseFloat(String(b.hourly_rate));
    if (isNaN(rate) || rate < 0) {
      return { isValid: false, error: 'Hourly rate must be a positive number' };
    }
  }

  return {
    isValid: true,
    data: {
      user_id: typeof b.user_id === 'string' ? b.user_id : undefined,
      first_name: b.first_name,
      last_name: b.last_name as string,
      email: b.email,
      phone: typeof b.phone === 'string' ? b.phone : undefined,
      role: (b.role as typeof validRoles[number]) || 'staff',
      employment_type: (b.employment_type as typeof validEmploymentTypes[number]) || 'casual',
      hourly_rate: b.hourly_rate !== undefined ? parseFloat(String(b.hourly_rate)) : 0,
      saturday_rate: b.saturday_rate !== undefined ? parseFloat(String(b.saturday_rate)) : undefined,
      sunday_rate: b.sunday_rate !== undefined ? parseFloat(String(b.sunday_rate)) : undefined,
      skills: Array.isArray(b.skills) ? b.skills as string[] : undefined,
      bank_account_bsb: typeof b.bank_account_bsb === 'string' ? b.bank_account_bsb : undefined,
      bank_account_number: typeof b.bank_account_number === 'string' ? b.bank_account_number : undefined,
      tax_file_number: typeof b.tax_file_number === 'string' ? b.tax_file_number : undefined,
      emergency_contact_name: typeof b.emergency_contact_name === 'string' ? b.emergency_contact_name : undefined,
      emergency_contact_phone: typeof b.emergency_contact_phone === 'string' ? b.emergency_contact_phone : undefined,
    },
  };
}
