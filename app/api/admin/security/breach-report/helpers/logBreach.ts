import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

interface BreachData {
  breachType: string;
  description: string;
  affectedUsers: string[];
  metadata?: Record<string, unknown>;
}

/**
 * Log security breach to database
 *
 * @param {BreachData} breachData - Breach data to log
 * @returns {Promise<{ id: string; detected_at: string } | NextResponse>} Breach record or error response
 */
export async function logBreachToDatabase(breachData: BreachData): Promise<
  | {
      id: string;
      detected_at: string;
    }
  | NextResponse
> {
  const { data: breachRecord, error: insertError } = await supabaseAdmin!
    .from('security_breaches')
    .insert({
      breach_type: breachData.breachType,
      description: breachData.description,
      affected_users: breachData.affectedUsers,
      status: 'pending',
      metadata: breachData.metadata || {},
    })
    .select('id, detected_at')
    .single();

  if (insertError) {
    logger.error('[Breach Report API] Failed to log breach:', {
      error: insertError.message,
      breachType: breachData.breachType,
      affectedUsersCount: breachData.affectedUsers.length,
    });

    return NextResponse.json(
      ApiErrorHandler.createError('Failed to log breach', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  return breachRecord!;
}
