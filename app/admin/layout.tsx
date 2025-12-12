'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { isAdmin } from '@/lib/admin-auth';
import { NotificationProvider } from '@/contexts/NotificationContext';
import AdminNavigation from './components/AdminNavigation';
import '../globals.css';

function AdminLayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push('/api/auth/login?returnTo=/admin');
      return;
    }

    // Check if user is admin
    if (!isAdmin(user)) {
      router.push('/not-authorized');
      return;
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#29E7CD] border-t-transparent"></div>
          <p className="text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin(user)) {
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

/**
 * Admin layout component with authentication and authorization checks.
 * Wraps admin pages with notification provider and admin navigation.
 * Redirects non-admin users to unauthorized page.
 * Note: UserProvider is already provided at root level in app/providers.tsx
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} Admin layout with navigation and providers
 */
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NotificationProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </NotificationProvider>
  );
}
