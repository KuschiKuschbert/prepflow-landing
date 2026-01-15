import { UpdateEmployeeInput } from '../../helpers/schemas';

/**
 * Build update data object from request body
 */
export function buildUpdateData(body: Record<string, any>): UpdateEmployeeInput & { updated_at: string } {
  const updateData: UpdateEmployeeInput & { updated_at: string } = {
    updated_at: new Date().toISOString(),
  };

  if (body.first_name !== undefined) updateData.first_name = body.first_name;
  if (body.last_name !== undefined) updateData.last_name = body.last_name;
  if (body.email !== undefined) updateData.email = body.email;
  if (body.phone !== undefined) updateData.phone = body.phone;
  if (body.role !== undefined) updateData.role = body.role;
  if (body.employment_type !== undefined) updateData.employment_type = body.employment_type;
  if (body.hourly_rate !== undefined) updateData.hourly_rate = parseFloat(body.hourly_rate);
  if (body.saturday_rate !== undefined)
    updateData.saturday_rate = body.saturday_rate ? parseFloat(body.saturday_rate) : null;
  if (body.sunday_rate !== undefined)
    updateData.sunday_rate = body.sunday_rate ? parseFloat(body.sunday_rate) : null;
  if (body.skills !== undefined) updateData.skills = body.skills;
  if (body.bank_account_bsb !== undefined) updateData.bank_account_bsb = body.bank_account_bsb;
  if (body.bank_account_number !== undefined)
    updateData.bank_account_number = body.bank_account_number;
  if (body.tax_file_number !== undefined) updateData.tax_file_number = body.tax_file_number;
  if (body.emergency_contact_name !== undefined)
    updateData.emergency_contact_name = body.emergency_contact_name;
  if (body.emergency_contact_phone !== undefined)
    updateData.emergency_contact_phone = body.emergency_contact_phone;
  if (body.user_id !== undefined) updateData.user_id = body.user_id;

  return updateData;
}
