import type {
    ReportAllergenRecord,
    ReportComplianceGap,
    ReportComplianceRecord,
    ReportHACCPRecord,
    ReportIncident,
    ReportProcedure,
    ReportSupplierVerification,
} from '../report-item-types';

export interface ReportComplianceRecordsSection {
  all_records: ReportComplianceRecord[];
  active: ReportComplianceRecord[];
  expiring_soon: ReportComplianceRecord[];
  expired: ReportComplianceRecord[];
}

export interface ReportIncidentsSection {
  incidents: ReportIncident[];
  total_incidents: number;
  by_severity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  by_status: {
    open: number;
    investigating: number;
    resolved: number;
    closed: number;
  };
  unresolved: ReportIncident[];
}

export interface ReportHACCPSection {
  records: ReportHACCPRecord[];
  total_records: number;
  out_of_limit: ReportHACCPRecord[];
  by_step: Record<string, number>;
}

export interface ReportAllergensSection {
  records: ReportAllergenRecord[];
  total_records: number;
  inaccurate_declarations: ReportAllergenRecord[];
  high_risk_items: ReportAllergenRecord[];
}

export interface ReportProceduresSection {
  procedures: ReportProcedure[];
  total_procedures: number;
  overdue_reviews: ReportProcedure[];
  by_type: Record<string, number>;
}

export interface ReportSupplierVerificationSection {
  verifications: ReportSupplierVerification[];
  total_verifications: number;
  invalid_certificates: ReportSupplierVerification[];
  expired_certificates: ReportSupplierVerification[];
}

export interface ReportComplianceGapsSection {
  gaps: ReportComplianceGap[];
  total_gaps: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  // Note: 'total_gaps' is repeated in original, assuming intentional or copy-paste error.
  // Original interface:
  /*
  compliance_gaps?: {
    gaps: ReportComplianceGap[];
    total_gaps: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  */
}
