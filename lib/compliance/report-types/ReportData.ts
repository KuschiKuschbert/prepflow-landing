import type { ExecutiveSummary } from './ExecutiveSummary';

export interface ReportData {
  generated_at: string;
  report_period: {
    start_date: string;
    end_date: string;
  };
  business_info?: {
    active_licenses: any[];
    total_compliance_records: number;
  };
  employees?: any[];
  qualifications?: {
    all_qualifications: any[];
    expiring_soon: any[];
    expired: any[];
  };
  compliance_records?: {
    all_records: any[];
    active: any[];
    expiring_soon: any[];
    expired: any[];
  };
  temperature_logs?: {
    logs: any[];
    total_logs: number;
    date_range: {
      start: string;
      end: string;
    };
  };
  temperature_violations?: {
    total_violations: number;
    out_of_range: any[];
    danger_zone: any[];
    violation_summary: {
      below_minimum: number;
      above_maximum: number;
      danger_zone_count: number;
    };
  };
  cleaning_records?: {
    tasks: any[];
    completed: any[];
    pending: any[];
    overdue: any[];
    total_tasks: number;
    date_range: {
      start: string;
      end: string;
    };
  };
  sanitizer_logs?: {
    logs: any[];
    total_logs: number;
    out_of_range: any[];
    date_range: {
      start: string;
      end: string;
    };
  };
  staff_health?: {
    declarations: any[];
    total_declarations: number;
    unhealthy_count: number;
    excluded_count: number;
    date_range: {
      start: string;
      end: string;
    };
  };
  incidents?: {
    incidents: any[];
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
    unresolved: any[];
  };
  haccp?: {
    records: any[];
    total_records: number;
    out_of_limit: any[];
    by_step: Record<string, number>;
  };
  allergens?: {
    records: any[];
    total_records: number;
    inaccurate_declarations: any[];
    high_risk_items: any[];
  };
  equipment_maintenance?: {
    records: any[];
    total_records: number;
    critical_equipment: any[];
    overdue_maintenance: any[];
  };
  waste_management?: {
    logs: any[];
    total_logs: number;
    by_type: Record<string, number>;
  };
  procedures?: {
    procedures: any[];
    total_procedures: number;
    overdue_reviews: any[];
    by_type: Record<string, number>;
  };
  supplier_verification?: {
    verifications: any[];
    total_verifications: number;
    invalid_certificates: any[];
    expired_certificates: any[];
  };
  compliance_gaps?: {
    gaps: any[];
    total_gaps: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  executive_summary?: ExecutiveSummary;
}
