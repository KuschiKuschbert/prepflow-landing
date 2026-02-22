import { auth0 } from '@/lib/auth0';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

export default async function CalendarLayout({ children }: PropsWithChildren) {
  const session = await auth0.getSession();

  if (!session?.user) {
    redirect('/api/auth/login?returnTo=/calendar');
  }

  return <div className="w-full flex-1">{children}</div>;
}
