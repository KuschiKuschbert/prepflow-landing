import { auth0 } from '@/lib/auth0';
import { logger } from '@/lib/logger';
import { redirect } from 'next/navigation';

export default async function FunctionsLayout({ children }: { children: React.ReactNode }) {
  try {
    const session = await auth0.getSession();
    if (!session?.user) {
      redirect('/api/auth/login');
    }
    return <div className="w-full flex-1">{children}</div>;
  } catch (err) {
    logger.error('[Functions Layout] Session check failed:', { error: err });
    redirect('/api/auth/login');
  }
}
