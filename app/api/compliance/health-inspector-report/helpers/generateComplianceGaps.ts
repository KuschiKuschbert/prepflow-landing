/**
 * Generate compliance gaps analysis
 */

export function generateComplianceGaps(reportData: any) {
  const gaps: any[] = [];

  // Check for missing required qualifications
  if (reportData.employees) {
    const requiredQuals = ['Food Safety Supervisor', 'Food Handler'];
    reportData.employees.forEach((emp: any) => {
      const empQuals = (emp.employee_qualifications || []).map(
        (q: any) => q.qualification_types?.name?.toLowerCase() || '',
      );

      requiredQuals.forEach(reqQual => {
        const hasQual = empQuals.some((q: string) => q.includes(reqQual.toLowerCase()));

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
    });
  }

  // Check for missing critical compliance records
  if (reportData.compliance_records) {
    const criticalTypes = ['Food License', 'Council Registration', 'Pest Control'];
    const activeTypes = (reportData.compliance_records.active || []).map((r: any) =>
      (r.compliance_types?.type_name || r.compliance_types?.name || '').toLowerCase(),
    );

    criticalTypes.forEach(criticalType => {
      const hasType = activeTypes.some((t: string) => t.includes(criticalType.toLowerCase()));

      if (!hasType) {
        gaps.push({
          type: 'missing_compliance_record',
          severity: 'critical',
          missing_item: criticalType,
          description: `Missing active ${criticalType} compliance record`,
        });
      }
    });
  }

  // Check for temperature violations
  if (reportData.temperature_violations?.total_violations > 0) {
    gaps.push({
      type: 'temperature_violations',
      severity: 'high',
      count: reportData.temperature_violations.total_violations,
      description: `${reportData.temperature_violations.total_violations} temperature violation(s) detected`,
    });
  }

  // Check for unresolved incidents
  if (reportData.incidents?.unresolved?.length > 0) {
    gaps.push({
      type: 'unresolved_incidents',
      severity: 'medium',
      count: reportData.incidents.unresolved.length,
      description: `${reportData.incidents.unresolved.length} unresolved incident(s) require attention`,
    });
  }

  return {
    gaps: gaps,
    total_gaps: gaps.length,
    critical: gaps.filter(g => g.severity === 'critical').length,
    high: gaps.filter(g => g.severity === 'high').length,
    medium: gaps.filter(g => g.severity === 'medium').length,
    low: gaps.filter(g => g.severity === 'low').length,
  };
}
