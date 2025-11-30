import { NextResponse } from 'next/server';
import { getStandardTaskTemplates } from '@/lib/cleaning/standard-tasks';

/**
 * GET /api/cleaning-tasks/standard-templates
 * Get list of standard task templates
 *
 * @returns {Promise<NextResponse>} List of standard task templates
 */
export async function GET() {
  try {
    const templates = getStandardTaskTemplates();

    return NextResponse.json({
      success: true,
      data: templates,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: err?.message || 'Failed to fetch standard task templates',
      },
      { status: 500 },
    );
  }
}


