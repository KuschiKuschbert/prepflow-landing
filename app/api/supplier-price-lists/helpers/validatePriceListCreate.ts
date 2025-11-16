import { NextResponse } from 'next/server';

/**
 * Validate price list creation request.
 *
 * @param {Object} body - Request body
 * @returns {NextResponse | null} Error response if validation fails, null if valid
 */
export function validatePriceListCreate(body: any): NextResponse | null {
  const { supplier_id, document_name, document_url } = body;

  if (!supplier_id || !document_name || !document_url) {
    return NextResponse.json(
      {
        error: 'Required fields missing',
        message: 'Please provide supplier_id, document_name, and document_url',
      },
      { status: 400 },
    );
  }

  return null; // Validation passed
}
