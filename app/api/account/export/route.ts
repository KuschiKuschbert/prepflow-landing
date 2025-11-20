import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { exportUserData } from '@/lib/backup/export';

/**
 * GET /api/account/export
 * Export user data as JSON download (GDPR compliance).
 *
 * @returns {Promise<NextResponse>} Export response with JSON file download
 */
export async function GET() {
  const session: any = await getServerSession(authOptions as any);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userId = session.user.email;

    // Export user data
    const backupData = await exportUserData(userId);

    // Convert to JSON string
    const jsonData = JSON.stringify(backupData, null, 2);
    const filename = `prepflow-export-${new Date().toISOString().split('T')[0]}.json`;

    // Return as download
    return new NextResponse(jsonData, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to export data', message: error.message },
      { status: 500 },
    );
  }
}
