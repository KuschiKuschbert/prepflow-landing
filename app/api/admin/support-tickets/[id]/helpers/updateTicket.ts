import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { AdminUser } from '@/lib/admin-auth';

const updateTicketSchema = z.object({
  status: z.enum(['open', 'investigating', 'resolved', 'closed']).optional(),
  severity: z.enum(['safety', 'critical', 'high', 'medium', 'low']).optional(),
  admin_notes: z.string().optional(),
  related_error_id: z.string().uuid().nullable().optional(),
});

/**
 * Updates a support ticket in the database.
 *
 * @param {string} ticketId - The ID of the ticket to update.
 * @param {z.infer<typeof updateTicketSchema>} updates - Validated update data.
 * @param {AdminUser} adminUser - The admin user making the update.
 * @returns {Promise<{ ticket: any } | NextResponse>} Updated ticket data or error response.
 */
export async function updateTicket(
  ticketId: string,
  updates: z.infer<typeof updateTicketSchema>,
  adminUser: AdminUser,
): Promise<{ ticket: any } | NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  // Build update object
  const updateData: Record<string, unknown> = {};
  if (updates.status) {
    updateData.status = updates.status;
    // Set resolved_at if status is resolved or closed
    if (updates.status === 'resolved' || updates.status === 'closed') {
      updateData.resolved_at = new Date().toISOString();
      // Try to get admin user_id from email
      try {
        const { data: adminData, error: adminDataError } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', adminUser.email)
          .single();
        if (adminDataError && adminDataError.code !== 'PGRST116') {
          logger.warn('[Admin Support Tickets] Error fetching admin user:', {
            error: adminDataError.message,
            code: (adminDataError as any).code,
            adminEmail: adminUser.email,
          });
        }
        if (adminData) {
          updateData.resolved_by = adminData.id;
        }
      } catch (err) {
        // Continue without resolved_by if admin not found
        logger.warn('[Admin Support Tickets] Error fetching admin user:', {
          error: err instanceof Error ? err.message : String(err),
          adminEmail: adminUser.email,
        });
      }
    }
  }
  if (updates.severity) {
    updateData.severity = updates.severity;
  }
  if (updates.admin_notes !== undefined) {
    updateData.admin_notes = updates.admin_notes;
  }
  if (updates.related_error_id !== undefined) {
    updateData.related_error_id = updates.related_error_id;
  }

  const { data: ticket, error } = await supabaseAdmin
    .from('support_tickets')
    .update(updateData)
    .eq('id', ticketId)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json(ApiErrorHandler.createError('Ticket not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }

    logger.error('[Admin Support Tickets API] Database error:', {
      error: error.message,
      context: { endpoint: `/api/admin/support-tickets/${ticketId}`, method: 'PUT' },
    });

    return NextResponse.json(ApiErrorHandler.fromSupabaseError(error, 500), { status: 500 });
  }

  return { ticket };
}

export { updateTicketSchema };
