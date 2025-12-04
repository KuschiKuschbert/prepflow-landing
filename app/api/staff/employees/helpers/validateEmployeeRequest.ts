/**
 * Validates employee request data.
 *
 * @param {any} body - Request body
 * @returns {{ isValid: boolean; error?: string; data?: any }} Validation result
 */
export function validateEmployeeRequest(body: any): {
  isValid: boolean;
  error?: string;
  data?: any;
} {
  if (!body.first_name) {
    return { isValid: false, error: 'First name is required' };
  }

  if (!body.last_name) {
    return { isValid: false, error: 'Last name is required' };
  }

  if (!body.email) {
    return { isValid: false, error: 'Email is required' };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  // Validate role
  const validRoles = ['admin', 'manager', 'staff'];
  if (body.role && !validRoles.includes(body.role)) {
    return { isValid: false, error: `Invalid role. Must be one of: ${validRoles.join(', ')}` };
  }

  // Validate employment type
  const validEmploymentTypes = ['full-time', 'part-time', 'casual'];
  if (body.employment_type && !validEmploymentTypes.includes(body.employment_type)) {
    return {
      isValid: false,
      error: `Invalid employment type. Must be one of: ${validEmploymentTypes.join(', ')}`,
    };
  }

  // Validate hourly rate
  if (body.hourly_rate !== undefined) {
    const rate = parseFloat(body.hourly_rate);
    if (isNaN(rate) || rate < 0) {
      return { isValid: false, error: 'Hourly rate must be a positive number' };
    }
  }

  return {
    isValid: true,
    data: {
      user_id: body.user_id || null,
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      phone: body.phone || null,
      role: body.role || 'staff',
      employment_type: body.employment_type || 'casual',
      hourly_rate: body.hourly_rate !== undefined ? parseFloat(body.hourly_rate) : 0,
      saturday_rate: body.saturday_rate !== undefined ? parseFloat(body.saturday_rate) : null,
      sunday_rate: body.sunday_rate !== undefined ? parseFloat(body.sunday_rate) : null,
      skills: body.skills || null,
      bank_account_bsb: body.bank_account_bsb || null,
      bank_account_number: body.bank_account_number || null,
      tax_file_number: body.tax_file_number || null,
      emergency_contact_name: body.emergency_contact_name || null,
      emergency_contact_phone: body.emergency_contact_phone || null,
    },
  };
}
