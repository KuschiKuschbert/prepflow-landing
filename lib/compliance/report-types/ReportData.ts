import type { ExecutiveSummary } from './ExecutiveSummary';
import type {
  ReportAllergenRecord,
  ReportCleaningTask,
  ReportComplianceGap,
  ReportComplianceRecord,
  ReportEmployee,
  ReportEquipmentMaintenance,
  ReportHACCPRecord,
  ReportIncident,
  ReportLicense,
  ReportProcedure,
  ReportQualification,
  ReportSanitizerLog,
  ReportStaffHealthDeclaration,
  ReportSupplierVerification,
  ReportTemperatureLog,
  ReportTemperatureViolation,
  ReportWasteLog,
} from './report-item-types';

export interface ReportData {
  generated_at: string;
  report_period: {
    start_date: string;
    end_date: string;
  };
  business_info?: {
    active_licenses: ReportLicense[];
    total_compliance_records: number;
  };
  employees?: ReportEmployee[];
  qualifications?: {
    all_qualifications: ReportQualification[];
    expiring_soon: ReportQualification[];
    expired: ReportQualification[];
  };
  compliance_records?: {
    all_records: ReportComplianceRecord[];
    active: ReportComplianceRecord[];
    expiring_soon: ReportComplianceRecord[];
    expired: ReportComplianceRecord[];
  };
  temperature_logs?: {
    logs: ReportTemperatureLog[];
    total_logs: number;
    date_range: {
      start: string;
      end: string;
    };
  };
  temperature_violations?: {
    total_violations: number;
    out_of_range: ReportTemperatureViolation[];
    danger_zone: ReportTemperatureViolation[];
    violation_summary: {
      below_minimum: number;
      above_maximum: number;
      danger_zone_count: number;
    };
  };
  cleaning_records?: {
    tasks: ReportCleaningTask[];
    completed: ReportCleaningTask[];
    pending: ReportCleaningTask[];
    overdue: ReportCleaningTask[];
    total_tasks: number;
    date_range: {
      start: string;
      end: string;
    };
  };
  sanitizer_logs?: {
    logs: ReportSanitizerLog[];
    total_logs: number;
    out_of_range: ReportSanitizerLog[];
    date_range: {
      start: string;
      end: string;
    };
  };
  staff_health?: {
    declarations: ReportStaffHealthDeclaration[];
    total_declarations: number;
    unhealthy_count: number;
    excluded_count: number;
    date_range: {
      start: string;
      end: string;
    };
  };
  incidents?: {
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
  };
  haccp?: {
    records: ReportHACCPRecord[];
    total_records: number;
    out_of_limit: ReportHACCPRecord[];
    by_step: Record<string, number>;
  };
  allergens?: {
    records: ReportAllergenRecord[];
    total_records: number;
    inaccurate_declarations: ReportAllergenRecord[];
    high_risk_items: ReportAllergenRecord[];
  };
  equipment_maintenance?: {
    records: ReportEquipmentMaintenance[];
    total_records: number;
    critical_equipment: ReportEquipmentMaintenance[];
    overdue_maintenance: ReportEquipmentMaintenance[];
  };
  waste_management?: {
    logs: ReportWasteLog[];
    total_logs: number;
    by_type: Record<string, number>;
  };
  procedures?: {
    procedures: ReportProcedure[];
    total_procedures: number;
    overdue_reviews: ReportProcedure[];
    by_type: Record<string, number>;
  };
  supplier_verification?: {
    verifications: ReportSupplierVerification[];
    total_verifications: number;
    invalid_certificates: ReportSupplierVerification[];
    expired_certificates: ReportSupplierVerification[];
  };
  compliance_gaps?: {
    gaps: ReportComplianceGap[];
    total_gaps: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  executive_summary?: ExecutiveSummary;
}
