import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { NextRequest } from 'next/server';

/**
 * DELETE /api/account/delete
 * Delete user account (placeholder - requires confirmation)
 *
 * @returns {Promise<NextResponse>} Deletion request response
 */
export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);
  } catch (error) {
    // requireAuth throws NextResponse, so rethrow it
    if (error instanceof NextResponse) {
      throw error;
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Placeholder: Queue deletion process; require confirmation path in UI
  return NextResponse.json(
    { success: true, message: 'Deletion request received. We will confirm before removing data.' },
    { status: 202 },
  );
}
