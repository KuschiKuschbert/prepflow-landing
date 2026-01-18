'use client';

import { Icon } from '@/components/ui/Icon';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, X } from 'lucide-react';
import { useUser } from '@auth0/nextjs-auth0/client';
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
 * Updated with glassmorphism and smooth animations.
 */
export const MobileMenuDrawer = memo(function MobileMenuDrawer({
  isOpen,
  onClose,
  trackEngagement,
}: MobileMenuDrawerProps) {
  const { user } = useUser();
  const _pathname = usePathname();
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const drawerRef = useRef<HTMLDivElement>(null);

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
    window.location.href = '/api/auth/login?returnTo=/webapp';
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[74] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden={true}
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                onClose();
              }
            }}
            className="desktop:hidden fixed inset-x-0 bottom-0 z-[75] flex max-h-[85vh] flex-col overflow-hidden rounded-t-3xl border-t border-white/10 bg-[#1f1f1f]/90 shadow-2xl backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Handle bar - fixed at top */}
            <div className="flex shrink-0 items-center justify-center pt-3 pb-2">
              <div className="h-1 w-12 rounded-full bg-white/20" aria-hidden={true} />
            </div>

            {/* Close button - fixed at top */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 rounded-full p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
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
                        className="flex min-h-[44px] items-center justify-between rounded-xl px-4 py-3 text-base text-white transition-colors hover:bg-white/5 focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
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
              <div className="border-t border-white/10 px-4 py-4">
                {user ? (
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
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10 focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
