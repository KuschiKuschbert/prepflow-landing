import { auth0 } from '@/lib/auth0';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

export default async function CalendarLayout({ children }: PropsWithChildren) {
  if (process.env.AUTH0_BYPASS_DEV === 'true') {
    return <div className="w-full flex-1">{children}</div>;
  }

  const session = await auth0.getSession();

  if (!session?.user) {
    redirect('/api/auth/login?returnTo=/calendar');
  }

  return <div className="w-full flex-1">{children}</div>;
}
