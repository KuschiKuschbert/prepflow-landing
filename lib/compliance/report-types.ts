/**
 * Type definitions for Health Inspector Report Generator
 */

export type { ReportData } from './report-types/ReportData';

export interface StatusColors {
  compliant: string;
  attention_required: string;
  non_compliant: string;
}

export interface StatusLabels {
  compliant: string;
  attention_required: string;
  non_compliant: string;
}
