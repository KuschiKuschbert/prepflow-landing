import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { handleCreateComplianceRecord } from './helpers/createComplianceRecordHandler';
import { handleDeleteComplianceRecord } from './helpers/deleteComplianceRecordHandler';
import { handleComplianceError } from './helpers/handleComplianceError';
import { updateComplianceRecordSchema } from './helpers/schemas';
import { updateComplianceRecord } from './helpers/updateComplianceRecord';

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
      .select('*')
      .order('expiry_date', { ascending: true });

    if (typeId) {
      query = query.eq('compliance_type_id', typeId);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data: records, error } = await query;

    if (error) {
      const errorCode = error.code;

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

    const items = records || [];

    // Enrich with compliance_types if we have records (avoids PGRST200 join when FK not exposed)
    if (items.length > 0) {
      const typeIds = [...new Set(items.map(r => r.compliance_type_id).filter(Boolean))];
      const { data: types } = await supabaseAdmin
        .from('compliance_types')
        .select('id, type_name, description')
        .in('id', typeIds);

      const typeMap = new Map((types || []).map(t => [t.id, t]));
      const enriched = items.map(r => ({
        ...r,
        compliance_types: r.compliance_type_id ? (typeMap.get(r.compliance_type_id) ?? null) : null,
      }));

      return NextResponse.json({ success: true, data: enriched });
    }

    return NextResponse.json({ success: true, data: [] });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          err.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }
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
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          err.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }
    return handleComplianceError(err, 'PUT');
  }
}

export async function DELETE(request: NextRequest) {
  return handleDeleteComplianceRecord(request);
}
