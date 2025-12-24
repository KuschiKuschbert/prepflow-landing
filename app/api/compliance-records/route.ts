import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { handleComplianceError } from './helpers/handleComplianceError';
import { updateComplianceRecord } from './helpers/updateComplianceRecord';
import { updateComplianceRecordSchema, COMPLIANCE_TYPES_SELECT } from './helpers/schemas';
import { handleDeleteComplianceRecord } from './helpers/deleteComplianceRecordHandler';
import { handleCreateComplianceRecord } from './helpers/createComplianceRecordHandler';

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
      const errorCode = (error as any).code;

      // Handle missing table gracefully
      if (errorCode === '42P01') {
        logger.dev('[Compliance Records API] Table does not exist, returning empty array');
        return NextResponse.json({
          success: true,
          data: [],
        });
      }

      logger.error('[Compliance Records API] Database error fetching records:', {
        error: error.message,
        code: errorCode,
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
  } catch (err: any) {
    logger.error('[Compliance Records API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/compliance-records', method: 'GET' },
    });
    return handleComplianceError(err, 'GET');
  }
}

export async function POST(request: NextRequest) {
  return handleCreateComplianceRecord(request);
}

export async function PUT(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Compliance Records API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = updateComplianceRecordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validationResult.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

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
    } = validationResult.data;

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
    logger.error('[Compliance Records API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/compliance-records', method: 'PUT' },
    });
    return handleComplianceError(err, 'PUT');
  }
}

export async function DELETE(request: NextRequest) {
  return handleDeleteComplianceRecord(request);
}
