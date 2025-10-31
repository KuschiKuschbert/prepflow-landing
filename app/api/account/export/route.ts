import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET() {
  const session: any = await getServerSession(authOptions as any);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Placeholder: In a full export, gather user-owned records and return as JSON download
  return NextResponse.json(
    { success: true, message: 'Export ready soon. Please contact support if urgent.' },
    { status: 200 },
  );
}
