export interface TemplateApplicationRequest {
  templateId: string;
  targetWeekStartDate: string;
  overwriteExisting?: boolean;
}

export interface TemplateApplicationResult {
  success: boolean;
  shiftsCreated: number;
  shiftsUpdated: number;
  shiftsSkipped: number;
  errors: string[];
}
