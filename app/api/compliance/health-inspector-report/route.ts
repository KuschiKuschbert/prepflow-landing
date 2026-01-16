import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { fetchReportSections } from './helpers/fetchReportSections';
import { generateComplianceGaps } from './helpers/generateComplianceGaps';
import { generateExecutiveSummary } from './helpers/generateExecutiveSummary';

/**
 * GET /api/compliance/health-inspector-report
 * Generate comprehensive health inspector report aggregating data from multiple sources
 */
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

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
    const complianceStartDate =
      startDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 12 months ago
    const tempCleaningStartDate =
      startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 30 days ago

    const reportData: unknown = {
      generated_at: new Date().toISOString(),
      report_period: {
        start_date: complianceStartDate,
        end_date: endDate,
      },
    };

    // Fetch all report sections
    const sectionsData = await fetchReportSections(
      includeSections,
      complianceStartDate,
      tempCleaningStartDate,
      endDate,
    );
    Object.assign(reportData, sectionsData);

    // 15. Compliance Gaps (depends on other data)
    if (includeSections.includes('compliance_gaps')) {
      reportData.compliance_gaps = generateComplianceGaps(reportData);
    }

    // 16. Executive Summary (depends on all data)
    if (includeSections.includes('summary')) {
      reportData.executive_summary = generateExecutiveSummary(reportData);
    }

    return NextResponse.json({
      success: true,
      data: reportData,
    });
  } catch (err) {
    logger.error('[Health Inspector Report API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/compliance/health-inspector-report', method: 'GET' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
