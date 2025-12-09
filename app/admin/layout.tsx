'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import { isAdmin } from '@/lib/admin-auth';
import { NotificationProvider } from '@/contexts/NotificationContext';
import AdminNavigation from './components/AdminNavigation';
import '../globals.css';

function AdminLayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      router.push('/api/auth/signin/auth0?callbackUrl=/admin');
      return;
    }

    // Check if user is admin
    if (!isAdmin(session.user)) {
      router.push('/not-authorized');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#29E7CD] border-t-transparent"></div>
          <p className="text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!session?.user || !isAdmin(session.user)) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      <AdminNavigation />
      <main className="desktop:ml-64 flex-1 overflow-auto">
        <div className="desktop:p-8 p-6">{children}</div>
      </main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <NotificationProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </NotificationProvider>
    </SessionProvider>
  );
}
