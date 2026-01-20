'use client';

import { Icon } from '@/components/ui/Icon';
import { useUser } from '@auth0/nextjs-auth0/client';
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
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAdminBadges } from '../hooks/useAdminBadges';

import type { LucideIcon } from 'lucide-react';

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

interface AdminNavLinkProps {
  item: NavItem & { badge?: number };
  isActive: boolean;
  onClick: () => void;
}

function AdminNavLink({ item, isActive, onClick }: AdminNavLinkProps) {
  return (
    <li>
      <Link
        href={item.href}
        onClick={onClick}
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
}

/**
 * Admin navigation component with sidebar and mobile menu.
 * Displays navigation items with badge counts for unresolved tickets and errors.
 *
 * @component
 * @returns {JSX.Element} Admin navigation sidebar with mobile menu support
 */
function getNavItemsWithBadges(items: NavItem[], ticketsCount: number, errorsCount: number): (NavItem & { badge?: number })[] {
  return items.map(item => {
    if (item.href === '/admin/support-tickets') {
      return { ...item, badge: ticketsCount };
    }
    if (item.href === '/admin/errors') {
      return { ...item, badge: errorsCount > 0 ? errorsCount : undefined };
    }
    return item;
  });
}

export default function AdminNavigation() {
  const { user } = useUser();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { unresolvedTicketsCount, unresolvedErrorsCount } = useAdminBadges();

  const handleSignOut = async () => {
    // Logout via Auth0 SDK - redirects to Auth0 logout then back to home
    const returnTo = `${window.location.origin}/`;
    window.location.href = `/api/auth/logout?returnTo=${encodeURIComponent(returnTo)}`;
  };

  // Update nav items with badge count
  const navItemsWithBadge = getNavItemsWithBadges(navItems, unresolvedTicketsCount, unresolvedErrorsCount);

  return (
    <>
      <MobileMenuToggleButton isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Sidebar */}
      <aside
        className={`desktop:translate-x-0 fixed top-0 left-0 z-40 h-full w-64 transform border-r border-[#2a2a2a] bg-[#1f1f1f] transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <SidebarHeader userEmail={user?.email || null} />

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItemsWithBadge.map(item => (
                <AdminNavLink
                  key={item.href}
                  item={item}
                  isActive={
                    pathname === item.href ||
                    (item.href !== '/admin' && pathname.startsWith(item.href))
                  }
                  onClick={() => setSidebarOpen(false)}
                />
              ))}
            </ul>
          </nav>

          <SidebarFooter onSignOut={handleSignOut} />
        </div>
      </aside>

      <MobileOverlay isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}

function MobileMenuToggleButton({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="desktop:hidden fixed top-4 left-4 z-50 rounded-lg bg-[#1f1f1f] p-2 text-white"
      aria-label="Toggle sidebar"
    >
      <Icon icon={isOpen ? X : Menu} size="md" />
    </button>
  );
}

function SidebarHeader({ userEmail }: { userEmail: string | null }) {
  return (
    <div className="border-b border-[#2a2a2a] p-6">
      <h1 className="text-xl font-bold text-white">PrepFlow Admin</h1>
      {userEmail && <p className="mt-1 text-sm text-gray-400">{userEmail}</p>}
    </div>
  );
}

function SidebarFooter({ onSignOut }: { onSignOut: () => void }) {
  return (
    <div className="border-t border-[#2a2a2a] p-4">
      <button
        onClick={onSignOut}
        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a] hover:text-white"
      >
        <Icon icon={LogOut} size="sm" />
        <span>Sign Out</span>
      </button>
    </div>
  );
}

function MobileOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div
      className="desktop:hidden fixed inset-0 z-30 bg-black/60"
      onClick={onClose}
    />
  );
}
