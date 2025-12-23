import { z } from 'zod';

export const validateComplianceSchema = z.object({
  shift: z.any(), // Shift object is complex, validate structure if needed
  employee_id: z.string().optional(),
  check_availability: z.boolean().optional().default(true),
  check_skills: z.boolean().optional().default(true),
}).refine(data => data.shift !== undefined && data.shift !== null, {
  message: 'Shift data is required',
  path: ['shift'],
}).refine(data => {
  const shiftEmployeeId = data.shift?.employee_id || data.employee_id;
  return !!shiftEmployeeId;
}, {
  message: 'Employee ID is required',
  path: ['employee_id'],
});
