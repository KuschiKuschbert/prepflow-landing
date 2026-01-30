import type { ExecutiveSummary } from './ExecutiveSummary';
import type { ReportEmployee, ReportLicense } from './report-item-types';
import type {
  ReportAllergensSection,
  ReportComplianceGapsSection,
  ReportComplianceRecordsSection,
  ReportHACCPSection,
  ReportIncidentsSection,
  ReportProceduresSection,
  ReportSupplierVerificationSection,
} from './sections/ComplianceSections';
import type {
  ReportCleaningRecordsSection,
  ReportEquipmentMaintenanceSection,
  ReportSanitizerLogsSection,
  ReportTemperatureLogsSection,
  ReportTemperatureViolationsSection,
  ReportWasteManagementSection,
} from './sections/OperationalSections';
import type {
  ReportQualificationsSection,
  ReportStaffHealthSection,
} from './sections/StaffSections';

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
  qualifications?: ReportQualificationsSection;
  compliance_records?: ReportComplianceRecordsSection;
  temperature_logs?: ReportTemperatureLogsSection;
  temperature_violations?: ReportTemperatureViolationsSection;
  cleaning_records?: ReportCleaningRecordsSection;
  sanitizer_logs?: ReportSanitizerLogsSection;
  staff_health?: ReportStaffHealthSection;
  incidents?: ReportIncidentsSection;
  haccp?: ReportHACCPSection;
  allergens?: ReportAllergensSection;
  equipment_maintenance?: ReportEquipmentMaintenanceSection;
  waste_management?: ReportWasteManagementSection;
  procedures?: ReportProceduresSection;
  supplier_verification?: ReportSupplierVerificationSection;
  compliance_gaps?: ReportComplianceGapsSection;
  executive_summary?: ExecutiveSummary;
}
