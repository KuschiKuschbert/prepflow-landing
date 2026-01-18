import { NextRequest, NextResponse } from 'next/server';
import { handleGetRequest } from './helpers/handleGetRequest';
import { handlePostRequest } from './helpers/handlePostRequest';
import { handleAISpecialsError } from './helpers/handleAISpecialsError';

/**
 * GET /api/ai-specials
 * Fetch AI specials history for a user
 *
 * @param {NextRequest} request - Request object
 * @returns {Promise<NextResponse>} AI specials history response
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    return await handleGetRequest(request);
  } catch (error) {
    return handleAISpecialsError(error, 'GET');
  }
}

/**
 * POST /api/ai-specials
 * Generate AI-powered specials suggestions from image analysis
 *
 * @param {NextRequest} request - Request object
 * @returns {Promise<NextResponse>} AI specials response
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    return await handlePostRequest(request);
  } catch (error) {
    return handleAISpecialsError(error, 'POST');
  }
}
