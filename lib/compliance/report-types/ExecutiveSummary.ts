/**
 * Executive summary interface for compliance reports.
 */
export interface ExecutiveSummary {
  overall_status: 'compliant' | 'attention_required' | 'non_compliant';
  total_employees: number;
  total_qualifications: number;
  expiring_qualifications: number;
  expired_qualifications: number;
  total_compliance_records: number;
  expiring_compliance: number;
  expired_compliance: number;
  temperature_logs_count: number;
  temperature_violations_count?: number;
  cleaning_tasks_count: number;
  sanitizer_logs_count?: number;
  staff_health_declarations_count?: number;
  incidents_count?: number;
  haccp_records_count?: number;
  compliance_gaps_count?: number;
  alerts: string[];
}


