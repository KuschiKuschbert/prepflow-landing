'use client';

import { Icon } from '@/components/ui/Icon';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  ChefHat,
  CreditCard,
  Database,
  Flag,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import type { LucideIcon } from 'lucide-react';
import { logger } from '@/lib/logger';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

const navItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/system', label: 'System Health', icon: Activity },
  { href: '/admin/billing', label: 'Billing', icon: CreditCard },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/data', label: 'Data Audit', icon: Database },
  { href: '/admin/errors', label: 'Error Logs', icon: AlertTriangle },
  { href: '/admin/support-tickets', label: 'Support Tickets', icon: MessageSquare },
  { href: '/admin/features', label: 'Feature Flags', icon: Flag },
  { href: '/admin/tiers', label: 'Tiers & Features', icon: Package },
  { href: '/admin/support', label: 'Support Tools', icon: Wrench },
  { href: '/curbos', label: 'CurbOS', icon: ChefHat },
];

/**
 * Admin navigation component with sidebar and mobile menu.
 * Displays navigation items with badge counts for unresolved tickets and errors.
 *
 * @component
 * @returns {JSX.Element} Admin navigation sidebar with mobile menu support
 */
export default function AdminNavigation() {
  const { user } = useUser();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unresolvedTicketsCount, setUnresolvedTicketsCount] = useState(0);
  const [unresolvedErrorsCount, setUnresolvedErrorsCount] = useState(0);

  useEffect(() => {
    async function fetchUnresolvedCount() {
      try {
        // Fetch unresolved tickets (open or investigating)
        const [openResponse, investigatingResponse] = await Promise.all([
          fetch('/api/admin/support-tickets?status=open&pageSize=1'),
          fetch('/api/admin/support-tickets?status=investigating&pageSize=1'),
        ]);

        let count = 0;
        if (openResponse.ok) {
          const openData = await openResponse.json();
          count += openData.total || 0;
        }
        if (investigatingResponse.ok) {
          const investigatingData = await investigatingResponse.json();
          count += investigatingData.total || 0;
        }

        setUnresolvedTicketsCount(count);
      } catch (error) {
        // Don't break navigation, but log for debugging
        logger.dev('[AdminNavigation] Error fetching unresolved tickets count (non-blocking):', {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    fetchUnresolvedCount();
    const interval = setInterval(fetchUnresolvedCount, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchUnresolvedErrors() {
      try {
        // Fetch unresolved errors (new or investigating, safety or critical severity)
        const response = await fetch('/api/admin/errors?status=new&severity=safety&pageSize=1');
        if (response.ok) {
          const data = await response.json();
          // Also count critical errors
          const criticalResponse = await fetch(
            '/api/admin/errors?status=new&severity=critical&pageSize=1',
          );
          let count = data.total || 0;
          if (criticalResponse.ok) {
            const criticalData = await criticalResponse.json();
            count += criticalData.total || 0;
          }
          // Also count investigating status
          const investigatingResponse = await fetch(
            '/api/admin/errors?status=investigating&severity=safety&pageSize=1',
          );
          if (investigatingResponse.ok) {
            const investigatingData = await investigatingResponse.json();
            count += investigatingData.total || 0;
          }
          const investigatingCriticalResponse = await fetch(
            '/api/admin/errors?status=investigating&severity=critical&pageSize=1',
          );
          if (investigatingCriticalResponse.ok) {
            const investigatingCriticalData = await investigatingCriticalResponse.json();
            count += investigatingCriticalData.total || 0;
          }
          setUnresolvedErrorsCount(count);
        }
      } catch (error) {
        // Don't break navigation, but log for debugging
        logger.dev('[AdminNavigation] Error fetching unresolved errors count (non-blocking):', {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    fetchUnresolvedErrors();
    const interval = setInterval(fetchUnresolvedErrors, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = async () => {
    // Logout via Auth0 SDK - redirects to Auth0 logout then back to home
    const returnTo = `${window.location.origin}/`;
    window.location.href = `/api/auth/logout?returnTo=${encodeURIComponent(returnTo)}`;
  };

  // Update nav items with badge count
  const navItemsWithBadge = navItems.map(item => {
    if (item.href === '/admin/support-tickets') {
      return { ...item, badge: unresolvedTicketsCount };
    }
    if (item.href === '/admin/errors') {
      return { ...item, badge: unresolvedErrorsCount > 0 ? unresolvedErrorsCount : undefined };
    }
    return item;
  });

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="desktop:hidden fixed top-4 left-4 z-50 rounded-lg bg-[#1f1f1f] p-2 text-white"
        aria-label="Toggle sidebar"
      >
        <Icon icon={sidebarOpen ? X : Menu} size="md" />
      </button>

      {/* Sidebar */}
      <aside
        className={`desktop:translate-x-0 fixed top-0 left-0 z-40 h-full w-64 transform border-r border-[#2a2a2a] bg-[#1f1f1f] transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-[#2a2a2a] p-6">
            <h1 className="text-xl font-bold text-white">PrepFlow Admin</h1>
            {user?.email && <p className="mt-1 text-sm text-gray-400">{user.email}</p>}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItemsWithBadge.map(item => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/admin' && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm transition-colors ${
                        isActive
                          ? 'border border-[#29E7CD]/20 bg-[#29E7CD]/10 text-[#29E7CD]'
                          : 'text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon icon={item.icon} size="sm" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-[#2a2a2a] p-4">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a] hover:text-white"
            >
              <Icon icon={LogOut} size="sm" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="desktop:hidden fixed inset-0 z-30 bg-black/60"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
