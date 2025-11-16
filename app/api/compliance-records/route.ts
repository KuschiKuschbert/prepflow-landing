import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

const COMPLIANCE_TYPES_SELECT = `
  *,
  compliance_types (
    id,
    name,
    description,
    renewal_frequency_days
  )
`;

function calculateComplianceStatus(expiryDate: string | null, reminderDaysBefore?: number): string {
  if (!expiryDate) return 'active';
  const today = new Date();
  const expiry = new Date(expiryDate);
  if (expiry < today) return 'expired';
  if (reminderDaysBefore) {
    const reminderDate = new Date(expiry);
    reminderDate.setDate(reminderDate.getDate() - reminderDaysBefore);
    if (today >= reminderDate) return 'pending_renewal';
  }
  return 'active';
}

function handleUnexpectedError(err: unknown, method: string) {
  logger.error('[Compliance Records API] Unexpected error:', {
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
    context: { endpoint: '/api/compliance-records', method },
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
    return handleUnexpectedError(err, 'GET');
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

    const status = calculateComplianceStatus(expiry_date || null, reminder_days_before);

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('compliance_records')
      .insert({
        compliance_type_id,
        document_name,
        issue_date: issue_date || null,
        expiry_date: expiry_date || null,
        status,
        document_url: document_url || null,
        photo_url: photo_url || null,
        notes: notes || null,
        reminder_enabled: reminder_enabled !== undefined ? reminder_enabled : true,
        reminder_days_before: reminder_days_before || 30,
      })
      .select(COMPLIANCE_TYPES_SELECT)
      .single();

    if (error) {
      logger.error('[Compliance Records API] Database error creating record:', {
        error: error.message,
        code: (error as any).code,
        context: {
          endpoint: '/api/compliance-records',
          operation: 'POST',
          table: 'compliance_records',
        },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Compliance record created successfully',
      data,
    });
  } catch (err) {
    return handleUnexpectedError(err, 'POST');
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

    const updateData: any = {};
    if (document_name !== undefined) updateData.document_name = document_name;
    if (issue_date !== undefined) updateData.issue_date = issue_date;
    if (expiry_date !== undefined) {
      updateData.expiry_date = expiry_date;
      updateData.status = calculateComplianceStatus(expiry_date, reminder_days_before);
    }
    if (document_url !== undefined) updateData.document_url = document_url;
    if (photo_url !== undefined) updateData.photo_url = photo_url;
    if (notes !== undefined) updateData.notes = notes;
    if (reminder_enabled !== undefined) updateData.reminder_enabled = reminder_enabled;
    if (reminder_days_before !== undefined) updateData.reminder_days_before = reminder_days_before;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('compliance_records')
      .update(updateData)
      .eq('id', id)
      .select(COMPLIANCE_TYPES_SELECT)
      .single();

    if (error) {
      logger.error('[Compliance Records API] Database error updating record:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/compliance-records', operation: 'PUT', recordId: id },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Compliance record updated successfully',
      data,
    });
  } catch (err) {
    return handleUnexpectedError(err, 'PUT');
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

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { error } = await supabaseAdmin.from('compliance_records').delete().eq('id', id);

    if (error) {
      logger.error('[Compliance Records API] Database error deleting record:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/compliance-records', operation: 'DELETE', recordId: id },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Compliance record deleted successfully',
    });
  } catch (err) {
    return handleUnexpectedError(err, 'DELETE');
  }
}
