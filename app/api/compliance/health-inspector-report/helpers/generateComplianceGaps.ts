import { checkComplianceRecords } from './checkers/checkComplianceRecords';
import { checkEmployeeQualifications } from './checkers/checkEmployeeQualifications';
import { checkIncidents } from './checkers/checkIncidents';
import { checkTemperatureViolations } from './checkers/checkTemperatureViolations';
import { Gap, ReportData } from './types';

export function generateComplianceGaps(reportData: ReportData) {
  const gaps: Gap[] = [];

  // 1. Employee Qualifications
  gaps.push(...checkEmployeeQualifications(reportData.employees));

  // 2. Compliance Records
  gaps.push(...checkComplianceRecords(reportData.compliance_records));

  // 3. Temperature Violations
  gaps.push(...checkTemperatureViolations(reportData.temperature_violations));

  // 4. Incidents
  gaps.push(...checkIncidents(reportData.incidents));

  return {
    gaps: gaps,
    total_gaps: gaps.length,
    critical: gaps.filter(g => g.severity === 'critical').length,
    high: gaps.filter(g => g.severity === 'high').length,
    medium: gaps.filter(g => g.severity === 'medium').length,
    low: gaps.filter(g => g.severity === 'low').length,
  };
}
