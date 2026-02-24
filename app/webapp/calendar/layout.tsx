import { auth0 } from '@/lib/auth0';
import { logger } from '@/lib/logger';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

export default async function CalendarLayout({ children }: PropsWithChildren) {
  try {
    const session = await auth0.getSession();
    if (!session?.user) {
      redirect('/api/auth/login?returnTo=/calendar');
    }
    return <div className="w-full flex-1">{children}</div>;
  } catch (err) {
    logger.error('[Calendar Layout] Session check failed:', { error: err });
    redirect('/api/auth/login?returnTo=/calendar');
  }
}
