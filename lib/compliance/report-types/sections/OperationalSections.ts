import type {
    ReportCleaningTask,
    ReportEquipmentMaintenance,
    ReportSanitizerLog,
    ReportTemperatureLog,
    ReportTemperatureViolation,
    ReportWasteLog,
} from '../report-item-types';

export interface ReportTemperatureLogsSection {
  logs: ReportTemperatureLog[];
  total_logs: number;
  date_range: {
    start: string;
    end: string;
  };
}

export interface ReportTemperatureViolationsSection {
  total_violations: number;
  out_of_range: ReportTemperatureViolation[];
  danger_zone: ReportTemperatureViolation[];
  violation_summary: {
    below_minimum: number;
    above_maximum: number;
    danger_zone_count: number;
  };
}

export interface ReportCleaningRecordsSection {
  tasks: ReportCleaningTask[];
  completed: ReportCleaningTask[];
  pending: ReportCleaningTask[];
  overdue: ReportCleaningTask[];
  total_tasks: number;
  date_range: {
    start: string;
    end: string;
  };
}

export interface ReportSanitizerLogsSection {
  logs: ReportSanitizerLog[];
  total_logs: number;
  out_of_range: ReportSanitizerLog[];
  date_range: {
    start: string;
    end: string;
  };
}

export interface ReportEquipmentMaintenanceSection {
  records: ReportEquipmentMaintenance[];
  total_records: number;
  critical_equipment: ReportEquipmentMaintenance[];
  overdue_maintenance: ReportEquipmentMaintenance[];
}

export interface ReportWasteManagementSection {
  logs: ReportWasteLog[];
  total_logs: number;
  by_type: Record<string, number>;
}
