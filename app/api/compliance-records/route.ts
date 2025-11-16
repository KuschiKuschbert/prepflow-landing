import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { createComplianceRecord } from './helpers/createComplianceRecord';
import { deleteComplianceRecord } from './helpers/deleteComplianceRecord';
import { handleComplianceError } from './helpers/handleComplianceError';
import { updateComplianceRecord } from './helpers/updateComplianceRecord';

const COMPLIANCE_TYPES_SELECT = `
      *,
      compliance_types (
        id,
        type_name,
        description
      )
    `;

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const typeId = searchParams.get('type_id');
    const status = searchParams.get('status');

    let query = supabaseAdmin
      .from('compliance_records')
      .select(COMPLIANCE_TYPES_SELECT)
      .order('expiry_date', { ascending: true });

    if (typeId) {
      query = query.eq('compliance_type_id', typeId);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('[Compliance Records API] Database error fetching records:', {
        error: error.message,
        code: (error as any).code,
        context: {
          endpoint: '/api/compliance-records',
          operation: 'GET',
          table: 'compliance_records',
        },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (err) {
    return handleComplianceError(err, 'GET');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      compliance_type_id,
      document_name,
      issue_date,
      expiry_date,
      document_url,
      photo_url,
      notes,
      reminder_enabled,
      reminder_days_before,
    } = body;

    if (!compliance_type_id || !document_name) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'compliance_type_id and document_name are required',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const data = await createComplianceRecord({
      compliance_type_id,
      document_name,
      issue_date,
      expiry_date,
      document_url,
      photo_url,
      notes,
      reminder_enabled,
      reminder_days_before,
    });

    return NextResponse.json({
      success: true,
      message: 'Compliance record created successfully',
      data,
    });
  } catch (err: any) {
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handleComplianceError(err, 'POST');
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      document_name,
      issue_date,
      expiry_date,
      document_url,
      photo_url,
      notes,
      reminder_enabled,
      reminder_days_before,
    } = body;

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Compliance record ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const data = await updateComplianceRecord(id, {
      document_name,
      issue_date,
      expiry_date,
      document_url,
      photo_url,
      notes,
      reminder_enabled,
      reminder_days_before,
    });

    return NextResponse.json({
      success: true,
      message: 'Compliance record updated successfully',
      data,
    });
  } catch (err: any) {
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handleComplianceError(err, 'PUT');
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Compliance record ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    await deleteComplianceRecord(id);

    return NextResponse.json({
      success: true,
      message: 'Compliance record deleted successfully',
    });
  } catch (err: any) {
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handleComplianceError(err, 'DELETE');
  }
}
