import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

/**
 * Create support ticket in database
 */
export async function createTicket(
  userId: string | null,
  userEmail: string,
  subject: string,
  message: string,
  type: string,
  severity: string,
  relatedErrorId: string | null,
): Promise<{ ticketId: string } | NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  const { data: ticket, error: dbError } = await supabaseAdmin
    .from('support_tickets')
    .insert({
      user_id: userId,
      user_email: userEmail,
      subject,
      message,
      type: type || 'other',
      severity,
      status: 'open',
      related_error_id: relatedErrorId || null,
    })
    .select('id')
    .single();

  if (dbError) {
    logger.error('[Support API] Database error:', {
      error: dbError.message,
      context: { endpoint: '/api/support/contact', method: 'POST' },
    });

    return NextResponse.json(ApiErrorHandler.fromSupabaseError(dbError, 500), { status: 500 });
  }

  // Log support request
  logger.info('[Support API] Support request received:', {
    userEmail,
    subject,
    type: type || 'other',
    severity,
    ticketId: ticket?.id,
    messageLength: message.length,
  });

  return { ticketId: ticket?.id || `TICKET-${Date.now()}` };
}
