import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { handleUpdateTemperatureEquipment } from './helpers/updateTemperatureEquipmentHandler';
import { handleDeleteTemperatureEquipment } from './helpers/deleteTemperatureEquipmentHandler';
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return handleUpdateTemperatureEquipment(request, id);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return handleDeleteTemperatureEquipment(id);
}
