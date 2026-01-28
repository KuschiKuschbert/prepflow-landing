import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { onboardingDocumentSchema } from '../employees/helpers/schemas';

const onboardingSubmissionSchema = z.object({
  employee_id: z.string().uuid('Invalid employee ID'),
  bank_account_bsb: z.string().optional(),
  bank_account_number: z.string().optional(),
  tax_file_number: z.string().optional(),
  documents: z.array(onboardingDocumentSchema),
});

/**
 * POST /api/staff/onboarding
 * Submit onboarding details and documents
 */
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const body = await request.json();
    const validationResult = onboardingSubmissionSchema.safeParse(body);

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

    const { employee_id, bank_account_bsb, bank_account_number, tax_file_number, documents } =
      validationResult.data;

    // 1. Update employee basic details and status
    const { error: employeeError } = await supabaseAdmin
      .from('employees')
      .update({
        bank_account_bsb,
        bank_account_number,
        tax_file_number,
        onboarding_status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', employee_id);

    if (employeeError) {
      logger.error('[Staff Onboarding API] Error updating employee:', employeeError);
      return NextResponse.json(ApiErrorHandler.fromSupabaseError(employeeError, 500), {
        status: 500,
      });
    }

    // 2. Insert documents
    if (documents.length > 0) {
      const docsToInsert = documents.map(doc => ({
        employee_id,
        document_type: doc.document_type,
        file_url: doc.file_url || null,
        signature_data: doc.signature_data || null,
        signed_at: doc.signed_at || null,
        updated_at: new Date().toISOString(),
      }));

      const { error: docsError } = await supabaseAdmin
        .from('onboarding_documents')
        .insert(docsToInsert);

      if (docsError) {
        logger.error('[Staff Onboarding API] Error inserting documents:', docsError);
        // Note: In a production environment, you might want to rollback the employee update
        return NextResponse.json(ApiErrorHandler.fromSupabaseError(docsError, 500), {
          status: 500,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Onboarding data submitted successfully',
    });
  } catch (err) {
    logger.error('[Staff Onboarding API] Unexpected error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
