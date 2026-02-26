/**
 * Template Shifts API Route
 * Handles GET (list template shifts) and POST (create template shift) operations.
 *
 * @module api/roster/templates/[id]/template-shifts
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { getAuthenticatedUserByEmail } from '@/lib/api-helpers/getAuthenticatedUserByEmail';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { catchTemplateShiftsHandler } from './helpers/catchHandler';
import { fetchTemplateShifts } from './helpers/fetchShifts';
import { verifyTemplateAndCreateShift } from './helpers/validateAndCreate';

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

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid JSON body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const result = await verifyTemplateAndCreateShift(
      supabaseAdmin,
      id,
      userId,
      body as Parameters<typeof verifyTemplateAndCreateShift>[3],
    );

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
