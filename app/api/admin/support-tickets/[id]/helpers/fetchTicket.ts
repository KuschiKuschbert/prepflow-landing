import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

/**
 * Fetches a support ticket by ID from the database.
 *
 * @param {string} ticketId - The ID of the ticket to fetch.
 * @returns {Promise<{ ticket: any } | NextResponse>} Ticket data or error response.
 */
export async function fetchTicket(ticketId: string): Promise<{ ticket: unknown } | NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  const { data: ticket, error } = await supabaseAdmin
    .from('support_tickets')
    .select('*')
    .eq('id', ticketId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json(ApiErrorHandler.createError('Ticket not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }

    logger.error('[Admin Support Tickets API] Database error:', {
      error: error.message,
      context: { endpoint: `/api/admin/support-tickets/${ticketId}`, method: 'GET' },
    });

    return NextResponse.json(ApiErrorHandler.fromSupabaseError(error, 500), { status: 500 });
  }

  return { ticket };
}
