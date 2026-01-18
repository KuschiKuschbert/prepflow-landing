import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { fetchTicket } from './helpers/fetchTicket';
import { handleTicketApiError } from './helpers/handleError';
import { updateTicket, updateTicketSchema } from './helpers/updateTicket';

// Helper to safely parse request body
async function safeParseBody(request: NextRequest) {
  try {
    return await request.json();
  } catch (err) {
    logger.warn('[Admin Support Tickets API] Failed to parse request body:', {
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

/**
 * GET /api/admin/support-tickets/[id]
 * Get ticket details
 */
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await standardAdminChecks(request);
    if (error) return error;

    const { id } = await context.params;

    const result = await fetchTicket(id);
    if (result instanceof NextResponse) return result;

    return NextResponse.json({
      success: true,
      ticket: result.ticket,
    });
  } catch (error) {
    logger.error('[route.ts] Error in catch block:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return handleTicketApiError(error, 'GET');
  }
}

/**
 * PUT /api/admin/support-tickets/[id]
 * Update ticket (status, severity, notes, link to error)
 */
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { adminUser, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!adminUser) throw new Error('Unexpected authentication state');

    const { id } = await context.params;
    const body = await safeParseBody(request);

    if (!body) {
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Validate request body
    const validationResult = updateTicketSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Invalid request data',
          'VALIDATION_ERROR',
          400,
          validationResult.error.issues,
        ),
        { status: 400 },
      );
    }

    const result = await updateTicket(id, validationResult.data, adminUser);
    if (result instanceof NextResponse) return result;

    return NextResponse.json({
      success: true,
      ticket: result.ticket,
      message: 'Ticket updated successfully',
    });
  } catch (error) {
    logger.error('[route.ts] Error in catch block:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return handleTicketApiError(error, 'PUT');
  }
}
