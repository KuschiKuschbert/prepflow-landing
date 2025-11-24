'use client';

import { Icon } from '@/components/ui/Icon';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { signIn, useSession } from 'next-auth/react';
import { ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { memo, useEffect, useRef } from 'react';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  trackEngagement: (event: string) => void;
}

/**
 * Mobile menu drawer component that slides up from bottom.
 * Contains secondary navigation items and authentication buttons.
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether drawer is open
 * @param {Function} props.onClose - Callback to close drawer
 * @param {Function} props.trackEngagement - Analytics tracking function
 * @returns {JSX.Element} Bottom sheet drawer
 */
export const MobileMenuDrawer = memo(function MobileMenuDrawer({
  isOpen,
  onClose,
  trackEngagement,
}: MobileMenuDrawerProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Store previous focus when opening drawer
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Focus first focusable element in drawer
      setTimeout(() => {
        const firstFocusable = drawerRef.current?.querySelector<HTMLElement>(
          'a[href], button:not([disabled])',
        );
        firstFocusable?.focus();
      }, 100);
    } else {
      // Restore focus when closing
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    }
  }, [isOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus trap: keep focus within drawer
  useEffect(() => {
    if (!isOpen || !drawerRef.current) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = drawerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Close drawer when clicking backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle navigation link click
  const handleLinkClick = (href: string, label: string) => {
    trackEngagement(`mobile_drawer_${label.toLowerCase().replace(/\s+/g, '_')}_click`);
    if (href.startsWith('#')) {
      // Smooth scroll to anchor
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
      // Close drawer after a short delay to allow scroll
      setTimeout(() => {
        onClose();
      }, 300);
    } else {
      // Regular navigation
      onClose();
    }
  };

  // Handle sign in
  const handleSignIn = () => {
    trackEngagement('mobile_drawer_sign_in_click');
    signIn();
    onClose();
  };

  // Handle go to dashboard
  const handleGoToDashboard = () => {
    trackEngagement('mobile_drawer_dashboard_click');
    router.push('/webapp');
    onClose();
  };

  // Don't render on desktop
  if (!isMobile) {
    return null;
  }

  const drawerItems = [
    {
      href: '#how-it-works',
      label: 'How it works',
      onClick: () => handleLinkClick('#how-it-works', 'How it works'),
    },
    {
      href: '/webapp/guide',
      label: 'Guide',
      onClick: () => handleLinkClick('/webapp/guide', 'Guide'),
    },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[74] bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="desktop:hidden fixed inset-x-0 bottom-0 z-[75] flex max-h-[85vh] flex-col overflow-hidden rounded-t-3xl border-t border-gray-700/30 bg-[#1f1f1f] shadow-2xl transition-transform duration-300 ease-in-out"
        style={{
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        suppressHydrationWarning
      >
        {/* Handle bar - fixed at top */}
        <div className="flex shrink-0 items-center justify-center pt-3 pb-2">
          <div className="h-1 w-12 rounded-full bg-gray-600" aria-hidden={true} />
        </div>

        {/* Close button - fixed at top */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-800/50 hover:text-white focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
          aria-label="Close menu"
        >
          <Icon icon={X} size="md" aria-hidden={true} />
        </button>

        {/* Content - scrollable */}
        <div className="-webkit-overflow-scrolling-touch flex-1 overflow-y-auto overscroll-contain pb-[var(--safe-area-inset-bottom)]">
          <nav className="px-4 py-2" aria-label="Secondary navigation">
            <ul className="space-y-1">
              {drawerItems.map(item => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={item.onClick}
                    className="flex min-h-[44px] items-center justify-between rounded-xl px-4 py-3 text-base text-white transition-colors hover:bg-gray-800/50 focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                  >
                    <span>{item.label}</span>
                    <Icon
                      icon={ChevronRight}
                      size="sm"
                      className="text-gray-400"
                      aria-hidden={true}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Authentication section */}
          <div className="border-t border-gray-700/30 px-4 py-4">
            {session ? (
              <button
                onClick={handleGoToDashboard}
                className="w-full rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 text-base font-semibold text-white transition-all hover:shadow-lg hover:shadow-[#29E7CD]/20 focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
              >
                Go to Dashboard
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleSignIn}
                  className="w-full rounded-2xl border border-gray-700/50 bg-[#2a2a2a]/40 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#2a2a2a]/60 focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                >
                  Sign In
                </button>
                <Link
                  href="/webapp"
                  onClick={() => {
                    trackEngagement('mobile_drawer_register_click');
                    onClose();
                  }}
                  className="block w-full rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 text-center text-base font-semibold text-white transition-all hover:shadow-lg hover:shadow-[#29E7CD]/20 focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
});
