import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

/**
 * DELETE /api/account/delete
 * Delete user account (placeholder - requires confirmation)
 *
 * @returns {Promise<NextResponse>} Deletion request response
 */
export async function POST() {
  const session: any = await getServerSession(authOptions as any);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Placeholder: Queue deletion process; require confirmation path in UI
  return NextResponse.json(
    { success: true, message: 'Deletion request received. We will confirm before removing data.' },
    { status: 202 },
  );
}
