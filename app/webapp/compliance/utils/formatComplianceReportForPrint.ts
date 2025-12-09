/**
 * Format comprehensive compliance report for print/export
 * Combines compliance records, temperature logs, and cleaning records into audit-ready format
 */

import type { ComplianceRecord } from '../types';
import type { TemperatureLog, TemperatureEquipment } from '@/app/webapp/temperature/types';
import type { TaskWithCompletions } from '@/lib/cleaning/completion-logic';
import { formatReportPeriodSection } from './formatComplianceReportForPrint/formatReportPeriod';
import { formatComplianceRecordsSection } from './formatComplianceReportForPrint/formatComplianceRecords';
import { formatTemperatureLogsSection } from './formatComplianceReportForPrint/formatTemperatureLogs';
import { formatCleaningTasksSection } from './formatComplianceReportForPrint/formatCleaningTasks';
import { formatSummarySection } from './formatComplianceReportForPrint/formatSummary';

export interface ComplianceReportData {
  complianceRecords?: ComplianceRecord[];
  temperatureLogs?: TemperatureLog[];
  temperatureEquipment?: TemperatureEquipment[];
  cleaningTasks?: TaskWithCompletions[];
  reportPeriod?: {
    start: string;
    end: string;
  };
}

/**
 * Format compliance report as HTML for print/export
 *
 * @param {ComplianceReportData} data - Compliance report data
 * @returns {string} HTML content for compliance report
 */
export function formatComplianceReportForPrint(data: ComplianceReportData): string {
  const { complianceRecords, temperatureLogs, temperatureEquipment, cleaningTasks, reportPeriod } =
    data;

  let html = '<div class="compliance-report-content">';

  // Report Period Section
  if (reportPeriod) {
    html += formatReportPeriodSection(reportPeriod);
  }

  // Compliance Records Section
  if (complianceRecords && complianceRecords.length > 0) {
    html += formatComplianceRecordsSection(complianceRecords);
  }

  // Temperature Logs Section
  if (temperatureLogs && temperatureLogs.length > 0 && temperatureEquipment) {
    html += formatTemperatureLogsSection(temperatureLogs, temperatureEquipment);
  }

  // Cleaning Records Section
  if (cleaningTasks && cleaningTasks.length > 0) {
    html += formatCleaningTasksSection(cleaningTasks);
  }

  // Summary Section
  html += formatSummarySection({
    complianceRecords,
    temperatureLogs,
    cleaningTasks,
  });

  html += '</div>';

  return html;
}
