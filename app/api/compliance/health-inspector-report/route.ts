import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { fetchReportSections } from './helpers/fetchReportSections';
import { generateComplianceGaps } from './helpers/generateComplianceGaps';
import { generateExecutiveSummary } from './helpers/generateExecutiveSummary';

/**
 * GET /api/compliance/health-inspector-report
 * Generate comprehensive health inspector report aggregating data from multiple sources
 */
const MS_IN_YEAR = 365 * 24 * 60 * 60 * 1000;
const MS_IN_MONTH = 30 * 24 * 60 * 60 * 1000;

/**
 * GET /api/compliance/health-inspector-report
 */
export async function GET(request: NextRequest) {
  try {
    const { error } = await standardAdminChecks(request);
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date') || new Date().toISOString().split('T')[0];
    const includeSections = searchParams.get('include_sections')?.split(',') || [
      'business',
      'employees',
      'qualifications',
      'compliance',
      'temperature',
      'temperature_violations',
      'cleaning',
      'sanitizer',
      'staff_health',
      'incidents',
      'haccp',
      'allergens',
      'equipment',
      'waste',
      'procedures',
      'suppliers',
      'compliance_gaps',
      'summary',
    ];

    // Calculate default start dates
    const complianceStart =
      startDate || new Date(Date.now() - MS_IN_YEAR).toISOString().split('T')[0];
    const recentStart = startDate || new Date(Date.now() - MS_IN_MONTH).toISOString().split('T')[0];

    // Fetch report data
    const reportData: Record<string, unknown> = {
      generated_at: new Date().toISOString(),
      report_period: { start_date: complianceStart, end_date: endDate },
    };

    const sectionsData = await fetchReportSections(
      includeSections,
      complianceStart,
      recentStart,
      endDate,
    );
    Object.assign(reportData, sectionsData);

    if (includeSections.includes('compliance_gaps')) {
      reportData.compliance_gaps = generateComplianceGaps(reportData);
    }

    if (includeSections.includes('summary')) {
      reportData.executive_summary = generateExecutiveSummary(reportData);
    }

    return NextResponse.json({ success: true, data: reportData });
  } catch (err) {
    if (err instanceof NextResponse) return err;

    logger.error('[Health Inspector Report API] Unexpected error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
