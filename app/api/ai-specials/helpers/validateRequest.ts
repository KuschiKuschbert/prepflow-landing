import { NextResponse } from 'next/server';

/**
 * Validates the AI specials request body.
 *
 * @param {any} body - The request body.
 * @returns {{ userId: string; imageData: string; prompt?: string; countryCode?: string } | NextResponse} Validated data or error response.
 */
export function validateAISpecialsRequest(body: any):
  | {
      userId: string;
      imageData: string;
      prompt?: string;
      countryCode?: string;
    }
  | NextResponse {
  const { userId, imageData, prompt, countryCode } = body;

  if (!userId || !imageData) {
    return NextResponse.json(
      {
        error: 'Missing required fields',
        message: 'User ID and image data are required',
      },
      { status: 400 },
    );
  }

  return { userId, imageData, prompt, countryCode };
}
