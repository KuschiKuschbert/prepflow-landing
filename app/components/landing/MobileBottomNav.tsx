'use client';

import { Icon } from '@/components/ui/Icon';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { DollarSign, Home, Menu, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, useEffect, useRef, useState } from 'react';

interface MobileBottomNavProps {
  onMenuClick: () => void;
  trackEngagement: (event: string) => void;
}

/**
 * Mobile bottom navigation bar component for landing page.
 * Displays primary navigation items (Home, Features, Pricing, Menu).
 * Auto-hides on scroll down, shows on scroll up or at top.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onMenuClick - Callback when "Menu" button is clicked
 * @param {Function} props.trackEngagement - Analytics tracking function
 * @returns {JSX.Element} Bottom navigation bar
 */
export const MobileBottomNav = memo(function MobileBottomNav({
  onMenuClick,
  trackEngagement,
}: MobileBottomNavProps) {
  const pathname = usePathname();
  const { direction, isAtTop } = useScrollDirection();
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

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
        trackEngagement(`mobile_bottom_nav_${targetId}_click`);
        const headerOffset = 80; // Account for fixed header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    } else {
      trackEngagement(`mobile_bottom_nav_${href.replace('/', '_')}_click`);
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
      href: '#pricing',
      label: 'Pricing',
      icon: DollarSign,
      ariaLabel: 'View pricing',
    },
  ];

  return (
    <nav
      className="desktop:hidden fixed right-0 bottom-0 left-0 z-[60] border-t border-gray-700/30 bg-[#0a0a0a]/95 pb-[var(--safe-area-inset-bottom)] backdrop-blur-xl transition-transform duration-300 ease-in-out"
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
      }}
      aria-label="Bottom navigation"
      suppressHydrationWarning
    >
      <div className="flex h-14 w-full">
        {navItems.map(item => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={e => handleAnchorClick(e, item.href)}
              className={`flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 transition-colors duration-200 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none ${
                active ? 'border-t-2 border-[#29E7CD] bg-[#29E7CD]/10' : 'hover:bg-gray-800/30'
              }`}
              aria-label={item.ariaLabel}
              aria-current={active ? 'page' : undefined}
            >
              <Icon
                icon={item.icon}
                size="sm"
                className={active ? 'text-[#29E7CD]' : 'text-gray-400'}
                aria-hidden={true}
              />
              <span
                className={`text-[10px] font-medium ${active ? 'text-[#29E7CD]' : 'text-gray-400'}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Menu button */}
        <button
          ref={menuButtonRef}
          onClick={() => {
            trackEngagement('mobile_bottom_nav_menu_click');
            onMenuClick();
          }}
          className="flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 transition-colors duration-200 hover:bg-gray-800/30 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none"
          aria-label="More navigation options"
        >
          <Icon icon={Menu} size="sm" className="text-gray-400" aria-hidden={true} />
          <span className="text-[10px] font-medium text-gray-400">Menu</span>
        </button>
      </div>
    </nav>
  );
});
