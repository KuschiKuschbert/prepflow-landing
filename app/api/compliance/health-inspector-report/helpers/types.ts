export interface Employee {
  full_name?: string;
  role?: string;
  employee_qualifications?: Array<{
    qualification_types?: {
      name?: string;
    };
  }>;
}

export interface ComplianceRecord {
  compliance_types?: {
    type_name?: string;
    name?: string;
  };
}

export interface ComplianceRecords {
  active?: ComplianceRecord[];
}

export interface TemperatureViolations {
  total_violations?: number;
}

export interface Incidents {
  unresolved?: unknown[];
}

export interface ReportData {
  employees?: Employee[];
  compliance_records?: ComplianceRecords;
  temperature_violations?: TemperatureViolations;
  incidents?: Incidents;
}

export interface Gap {
  type: string;
  severity: string;
  employee_name?: string;
  employee_role?: string;
  missing_item?: string;
  description: string;
  count?: number;
}
