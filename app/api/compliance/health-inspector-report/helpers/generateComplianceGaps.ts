/**
 * Generate compliance gaps analysis
 */

interface Employee {
  full_name?: string;
  role?: string;
  employee_qualifications?: Array<{
    qualification_types?: {
      name?: string;
    };
  }>;
}

interface ComplianceRecord {
  compliance_types?: {
    type_name?: string;
    name?: string;
  };
}

interface ComplianceRecords {
  active?: ComplianceRecord[];
}

interface TemperatureViolations {
  total_violations?: number;
}

interface Incidents {
  unresolved?: unknown[];
}

interface ReportData {
  employees?: Employee[];
  compliance_records?: ComplianceRecords;
  temperature_violations?: TemperatureViolations;
  incidents?: Incidents;
}

interface Gap {
  type: string;
  severity: string;
  employee_name?: string;
  employee_role?: string;
  missing_item?: string;
  description: string;
  count?: number;
}

export function generateComplianceGaps(reportData: ReportData) {
  const gaps: Gap[] = [];

  // Check for missing required qualifications
  if (reportData.employees) {
    const requiredQuals = ['Food Safety Supervisor', 'Food Handler'];
    reportData.employees.forEach(emp => {
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
    });
  }

  // Check for missing critical compliance records
  if (reportData.compliance_records) {
    const criticalTypes = ['Food License', 'Council Registration', 'Pest Control'];
    const activeTypes = (reportData.compliance_records.active || []).map(r =>
      (r.compliance_types?.type_name || r.compliance_types?.name || '').toLowerCase(),
    );

    criticalTypes.forEach(criticalType => {
      const hasType = activeTypes.some(t => t.includes(criticalType.toLowerCase()));

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
  if (
    reportData.temperature_violations?.total_violations &&
    reportData.temperature_violations.total_violations > 0
  ) {
    gaps.push({
      type: 'temperature_violations',
      severity: 'high',
      count: reportData.temperature_violations.total_violations,
      description: `${reportData.temperature_violations.total_violations} temperature violation(s) detected`,
    });
  }

  // Check for unresolved incidents
  if (reportData.incidents?.unresolved && reportData.incidents.unresolved.length > 0) {
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
