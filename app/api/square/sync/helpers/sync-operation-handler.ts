/**
 * Sync operation handler for Square sync API
 */

import {
  syncCatalogFromSquare,
  syncCatalogToSquare,
  syncCatalogBidirectional,
} from '@/lib/square/sync/catalog';
import { syncOrdersFromSquare, syncRecentOrdersFromSquare } from '@/lib/square/sync/orders';
import {
  syncStaffFromSquare,
  syncStaffToSquare,
  syncStaffBidirectional,
} from '@/lib/square/sync/staff';
import { syncCostsToSquare } from '@/lib/square/sync/costs';
import { performInitialSync } from '@/lib/square/sync/initial-sync';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { NextResponse } from 'next/server';

export async function handleSyncOperation(
  operation: 'catalog' | 'orders' | 'staff' | 'costs' | 'initial_sync',
  direction: 'from_square' | 'to_square' | 'bidirectional' | undefined,
  options: any,
  userId: string,
) {
  switch (operation) {
    case 'catalog':
      if (direction === 'from_square') {
        return await syncCatalogFromSquare(userId, options?.locationId);
      } else if (direction === 'to_square') {
        return await syncCatalogToSquare(userId, options?.dishIds);
      } else {
        return await syncCatalogBidirectional(userId);
      }

    case 'orders':
      if (options?.startDate && options?.endDate) {
        return await syncOrdersFromSquare(
          userId,
          options.startDate,
          options.endDate,
          options?.locationId,
        );
      } else {
        return await syncRecentOrdersFromSquare(
          userId,
          options?.days || 30,
          options?.locationId,
        );
      }

    case 'staff':
      if (direction === 'from_square') {
        return await syncStaffFromSquare(userId);
      } else if (direction === 'to_square') {
        return await syncStaffToSquare(userId, options?.employeeIds);
      } else {
        return await syncStaffBidirectional(userId);
      }

    case 'costs':
      return await syncCostsToSquare(userId, options?.dishIds);

    case 'initial_sync': {
      const { getSquareConfig } = await import('@/lib/square/config');
      const config = await getSquareConfig(userId);
      if (!config) {
        throw NextResponse.json(
          ApiErrorHandler.createError('Square configuration not found', 'CONFIG_NOT_FOUND', 404),
          { status: 404 },
        );
      }
      return await performInitialSync(userId, config);
    }

    default:
      throw NextResponse.json(
        ApiErrorHandler.createError(
          `Unknown sync operation: ${operation}`,
          'INVALID_OPERATION',
          400,
        ),
        { status: 400 },
      );
  }
}
