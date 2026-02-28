/**
 * Template Shifts API Route
 * Handles GET (list template shifts) and POST (create template shift) operations.
 *
 * @module api/roster/templates/[id]/template-shifts
 */

import { getAuthenticatedUserByEmail } from '@/lib/api-helpers/getAuthenticatedUserByEmail';
import { parseAndValidate } from '@/lib/api/parse-request-body';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { catchTemplateShiftsHandler } from './helpers/catchHandler';
import { fetchTemplateShifts } from './helpers/fetchShifts';
import { verifyTemplateAndCreateShift } from './helpers/validateAndCreate';

const createTemplateShiftSchema = z.object({
  day_of_week: z.number().int().min(0).max(6),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  role_required: z.string().nullable().optional(),
  min_employees: z.number().int().min(0).optional(),
});

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { userId, supabaseAdmin } = await getAuthenticatedUserByEmail(request);
    const { id } = await context.params;

    const result = await fetchTemplateShifts(supabaseAdmin, id, userId);
    if (result instanceof NextResponse) return result;

    return NextResponse.json({ success: true, templateShifts: result.templateShifts });
  } catch (err) {
    logger.error('[Roster Template Shifts] GET error:', { error: err });
    return catchTemplateShiftsHandler(err, 'GET');
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { userId, supabaseAdmin } = await getAuthenticatedUserByEmail(request);
    const { id } = await context.params;

    const parsed = await parseAndValidate(
      request,
      createTemplateShiftSchema,
      '[Roster Template Shifts API]',
    );
    if (!parsed.ok) return parsed.response;

    const result = await verifyTemplateAndCreateShift(supabaseAdmin, id, userId, parsed.data);

    if (result instanceof NextResponse) return result;

    return NextResponse.json({
      success: true,
      templateShift: result.templateShift,
      message: 'Template shift created successfully',
    });
  } catch (err) {
    logger.error('[Roster Template Shifts] POST error:', { error: err });
    return catchTemplateShiftsHandler(err, 'POST');
  }
}
