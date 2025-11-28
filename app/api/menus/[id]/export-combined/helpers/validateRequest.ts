/**
 * Helper to validate export request parameters.
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { NextResponse } from 'next/server';

export interface ExportOptions {
  format: 'html' | 'csv' | 'pdf';
  includeMenu: boolean;
  includeMatrix: boolean;
  includeRecipes: boolean;
}

/**
 * Validate request parameters and return export options.
 */
export function validateRequest(
  menuId: string | null,
  format: string | null,
  include: string | null,
): { options: ExportOptions } | { error: NextResponse } {
  if (!menuId) {
    return {
      error: NextResponse.json(
        ApiErrorHandler.createError('Menu ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      ),
    };
  }

  const validFormat = format || 'html';
  if (!['html', 'csv', 'pdf'].includes(validFormat)) {
    return {
      error: NextResponse.json(
        ApiErrorHandler.createError(
          'Invalid format. Must be html, csv, or pdf',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      ),
    };
  }

  // Parse include parameter
  const includeParts = (include || 'menu,matrix').split(',').map(s => s.trim());
  const includeMenu = include === 'all' || includeParts.includes('menu');
  const includeMatrix = include === 'all' || includeParts.includes('matrix');
  const includeRecipes = include === 'all' || includeParts.includes('recipes');

  return {
    options: {
      format: validFormat as 'html' | 'csv' | 'pdf',
      includeMenu,
      includeMatrix,
      includeRecipes,
    },
  };
}
