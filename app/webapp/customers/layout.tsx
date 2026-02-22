import { auth0 } from '@/lib/auth0';
import { redirect } from 'next/navigation';

export default async function CustomersLayout({ children }: { children: React.ReactNode }) {
  const session = await auth0.getSession();

  if (!session?.user) {
    redirect('/api/auth/login');
  }

  return <div className="w-full flex-1">{children}</div>;
}
