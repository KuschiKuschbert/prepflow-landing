import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { handleDeleteTemperatureEquipment } from './helpers/deleteTemperatureEquipmentHandler';
import { handleUpdateTemperatureEquipment } from './helpers/updateTemperatureEquipmentHandler';
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    return handleUpdateTemperatureEquipment(request, id);
  } catch (error) {
    logger.error('[PUT /api/temperature-equipment/[id]] Error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context: { endpoint: '/api/temperature-equipment/[id]', method: 'PUT' },
    });
    const apiError = ApiErrorHandler.createError(
      error instanceof Error ? error.message : 'Internal server error',
      'SERVER_ERROR',
      500,
      process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined,
    );
    return NextResponse.json(apiError, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    return handleDeleteTemperatureEquipment(id);
  } catch (error) {
    logger.error('[DELETE /api/temperature-equipment/[id]] Error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context: { endpoint: '/api/temperature-equipment/[id]', method: 'DELETE' },
    });
    const apiError = ApiErrorHandler.createError(
      error instanceof Error ? error.message : 'Internal server error',
      'SERVER_ERROR',
      500,
      process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined,
    );
    return NextResponse.json(apiError, { status: 500 });
  }
}
