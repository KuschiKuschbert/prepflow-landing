import { Employee, Gap } from '../types';

export function checkEmployeeQualifications(employees?: Employee[]): Gap[] {
  const gaps: Gap[] = [];
  if (!employees) return gaps;

  const requiredQuals = ['Food Safety Supervisor', 'Food Handler'];

  employees.forEach(emp => {
    const empGaps = checkSingleEmployee(emp, requiredQuals);
    gaps.push(...empGaps);
  });

  return gaps;
}

function checkSingleEmployee(emp: Employee, requiredQuals: string[]): Gap[] {
  const gaps: Gap[] = [];
  const empQuals = (emp.employee_qualifications || []).map(
    q => q.qualification_types?.name?.toLowerCase() || '',
  );

  requiredQuals.forEach(reqQual => {
    const hasQual = empQuals.some(q => q.includes(reqQual.toLowerCase()));

    if (!hasQual) {
      gaps.push({
        type: 'missing_qualification',
        severity: 'high',
        employee_name: emp.full_name,
        employee_role: emp.role,
        missing_item: reqQual,
        description: `${emp.full_name} (${emp.role}) is missing required ${reqQual} certificate`,
      });
    }
  });
  return gaps;
}
