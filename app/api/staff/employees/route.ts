/**
 * Staff Employees API Route
 * Handles GET (list employees) and POST (create employee) operations for roster system.
 *
 * 📚 Square Integration: This route automatically triggers Square sync hooks after employee
 * create operations. See `docs/SQUARE_API_REFERENCE.md` (Automatic Sync section) for details.
 *
 * @module api/staff/employees
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { buildEmployeeQuery } from './helpers/buildEmployeeQuery';
import { handleStaffEmployeeError } from './helpers/handleError';
import { handleCreateEmployee } from './helpers/createEmployeeHandler';

/**
 * GET /api/staff/employees
 * List employees with optional filters and pagination.
 *
 * Query parameters:
 * - role: Filter by role (admin, manager, staff)
 * - employment_type: Filter by employment type (full-time, part-time, casual)
 * - search: Search by name or email
 * - page: Page number (default: 1)
 * - pageSize: Page size (default: 100)
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
    const params = {
      role: searchParams.get('role'),
      employment_type: searchParams.get('employment_type'),
      search: searchParams.get('search'),
      page: parseInt(searchParams.get('page') || '1', 10),
      pageSize: parseInt(searchParams.get('pageSize') || '100', 10),
    };

    const { data: employees, error, count } = await buildEmployeeQuery(supabaseAdmin, params);

    if (error) {
      logger.error('[Staff Employees API] Database error fetching employees:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/staff/employees', operation: 'GET', table: 'employees' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      employees: employees || [],
      count: count || 0,
      page: params.page,
      pageSize: params.pageSize,
    });
  } catch (err) {
    logger.error('[Staff Employees API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/staff/employees', method: 'GET' },
    });
    return handleStaffEmployeeError(err);
  }
}

/**
 * POST /api/staff/employees
 * Create a new employee.
 *
 * Request body:
 * - first_name: First name (required)
 * - last_name: Last name (required)
 * - email: Email address (required)
 * - phone: Phone number (optional)
 * - role: Role (admin, manager, staff) (optional, default: staff)
 * - employment_type: Employment type (full-time, part-time, casual) (optional, default: casual)
 * - hourly_rate: Hourly rate in AUD (optional, default: 0)
 * - saturday_rate: Saturday rate multiplier or absolute rate (optional)
 * - sunday_rate: Sunday rate multiplier or absolute rate (optional)
 * - skills: Array of skills (optional)
 * - bank_account_bsb: Bank BSB (optional)
 * - bank_account_number: Bank account number (optional)
 * - tax_file_number: Tax file number (optional)
 * - emergency_contact_name: Emergency contact name (optional)
 * - emergency_contact_phone: Emergency contact phone (optional)
 * - user_id: Link to auth user (optional)
 */
export async function POST(request: NextRequest) {
  return handleCreateEmployee(request);
}
