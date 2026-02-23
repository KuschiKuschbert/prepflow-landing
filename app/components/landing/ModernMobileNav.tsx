'use client';

import { Icon } from '@/components/ui/Icon';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { AnimatePresence, motion } from 'framer-motion';
import { DollarSign, Home, Menu, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, useEffect, useState } from 'react';

interface ModernMobileNavProps {
  onMenuClick: () => void;
  trackEngagement: (event: string) => void;
}

/**
 * Modern floating mobile navigation with glassmorphism and smooth animations.
 * Replaces the traditional bottom bar with a floating "island" design.
 */
export const ModernMobileNav = memo(function ModernMobileNav({
  onMenuClick,
  trackEngagement,
}: ModernMobileNavProps) {
  const pathname = usePathname();
  const { direction, isAtTop } = useScrollDirection();
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-hide on scroll down, show on scroll up or at top
  useEffect(() => {
    if (!mounted) return;
    if (isAtTop) {
      setIsVisible(true);
    } else if (direction === 'down') {
      setIsVisible(false);
    } else if (direction === 'up') {
      setIsVisible(true);
    }
  }, [direction, isAtTop, mounted]);

  // Determine active state based on pathname and scroll position
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' && (typeof window !== 'undefined' ? window.scrollY < 100 : true);
    }
    if (href.startsWith('#')) {
      // For anchor links, check if we're on the landing page
      return pathname === '/';
    }
    return pathname === href;
  };

  // Handle smooth scroll to anchor
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        trackEngagement(`mobile_nav_${targetId}_click`);
        const headerOffset = 80; // Account for fixed header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    } else {
      trackEngagement(`mobile_nav_${href.replace('/', '_')}_click`);
    }
  };

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: Home,
      ariaLabel: 'Go to home',
    },
    {
      href: '#features',
      label: 'Features',
      icon: Sparkles,
      ariaLabel: 'View features',
    },
    {
      href: '#cta',
      label: 'Get Started',
      icon: DollarSign,
      ariaLabel: 'Get started',
    },
  ];

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="desktop:hidden fixed right-4 bottom-6 left-4 z-[60] mx-auto max-w-md"
          aria-label="Mobile navigation"
        >
          <div className="flex h-16 items-center justify-between rounded-full border border-white/10 bg-black/60 px-6 shadow-2xl backdrop-blur-xl backdrop-saturate-150">
            {navItems.map(item => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={e => handleAnchorClick(e, item.href)}
                  className="relative flex flex-col items-center justify-center gap-1"
                  aria-label={item.ariaLabel}
                  aria-current={active ? 'page' : undefined}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute -inset-3 rounded-full bg-white/10 blur-md"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div
                    className={`relative p-2 transition-colors duration-200 ${active ? 'text-[#29E7CD]' : 'text-gray-400'}`}
                  >
                    <Icon
                      icon={item.icon}
                      size="sm"
                      className={active ? 'text-[#29E7CD]' : 'text-gray-400'}
                      aria-hidden={true}
                    />
                  </div>
                </Link>
              );
            })}

            {/* Menu button */}
            <button
              onClick={() => {
                trackEngagement('mobile_nav_menu_click');
                onMenuClick();
              }}
              className="relative flex flex-col items-center justify-center gap-1 p-2"
              aria-label="More navigation options"
            >
              <Icon icon={Menu} size="sm" className="text-gray-400" aria-hidden={true} />
            </button>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
});
