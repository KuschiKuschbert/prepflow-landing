'use client';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import { LogoutButton } from '../LogoutButton';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { memo, useEffect, useRef } from 'react';
import { Settings2 } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface AccountMenuProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | HTMLButtonElement | null>;
}

/**
 * Account menu component for header burger menu.
 * Displays user info, language switcher, settings link, and logout button.
 * Material 3 popover menu anchored to burger button.
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Controls the visibility of the menu
 * @param {Function} props.onClose - Callback to close the menu
 * @param {RefObject} props.triggerRef - Ref to the trigger button element
 * @returns {JSX.Element | null} The rendered account menu or null if not open
 *
 * @example
 * ```tsx
 * <AccountMenu
 *   isOpen={isAccountMenuOpen}
 *   onClose={() => setIsAccountMenuOpen(false)}
 *   triggerRef={burgerButtonRef}
 * />
 * ```
 */
export const AccountMenu = memo(function AccountMenu({
  isOpen,
  onClose,
  triggerRef,
}: AccountMenuProps) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const userName = session?.user?.name || userEmail?.split('@')[0];
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

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

  // Focus trap implementation
  useEffect(() => {
    if (isOpen && menuRef.current) {
      // Store trigger element for focus return
      triggerElementRef.current = document.activeElement as HTMLElement;

      // Get all focusable elements within the menu
      const getFocusableElements = (): HTMLElement[] => {
        if (!menuRef.current) return [];
        return Array.from(
          menuRef.current.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        ) as HTMLElement[];
      };

      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Focus first element if available
      if (firstElement) {
        firstElement.focus();
      }

      // Handle Tab key to trap focus
      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        if (e.shiftKey) {
          // Shift + Tab (backwards)
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab (forwards)
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      document.addEventListener('keydown', handleTab);

      return () => {
        document.removeEventListener('keydown', handleTab);
        // Return focus to trigger element when menu closes
        if (triggerElementRef.current && typeof triggerElementRef.current.focus === 'function') {
          triggerElementRef.current.focus();
        }
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[55] bg-black/20 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
        aria-hidden={true}
      />

      {/* Menu */}
      <div
        ref={menuRef}
        className="desktop:top-[calc(var(--header-height-desktop)+0.5rem)] fixed top-[calc(var(--header-height-mobile)+0.5rem)] left-4 z-[60] w-[calc(100vw-2rem)] max-w-xs rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-2xl backdrop-blur-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Account menu"
      >
        {/* User Info Section */}
        {userName && (
          <div className="border-b border-[#2a2a2a]/20 px-4 py-3">
            <div className="rounded-lg bg-[#2a2a2a]/15 px-3 py-2">
              <div className="text-[10px] text-gray-500">Logged in as</div>
              <div
                className="text-sm font-medium text-white/90"
                title={userEmail || 'Logged in user'}
              >
                {userName}
              </div>
              {userEmail && <div className="mt-0.5 text-xs text-gray-400">{userEmail}</div>}
            </div>
          </div>
        )}

        {/* Settings Section */}
        <div className="px-3 py-2">
          <div className="mb-1.5 text-[10px] tracking-wider text-gray-500 uppercase">Settings</div>
          <div className="space-y-1">
            {/* Settings Link */}
            <Link
              href="/webapp/settings"
              onClick={onClose}
              className="flex min-h-[44px] items-center justify-between rounded-lg px-3 py-2 text-left transition-colors hover:bg-[#2a2a2a]/30 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none"
            >
              <div className="flex items-center space-x-3">
                <Icon icon={Settings2} size="sm" className="text-gray-400" aria-hidden={true} />
                <span className="text-sm text-gray-300">Settings</span>
              </div>
            </Link>

            {/* Language Switcher */}
            <div className="flex min-h-[44px] items-center justify-between rounded-lg px-3 py-2">
              <span className="text-sm text-gray-300">Language</span>
              <LanguageSwitcher />
            </div>

            {/* Logout Button */}
            <div className="flex min-h-[44px] items-center justify-between rounded-lg px-3 py-2">
              <span className="text-sm text-gray-300">Account</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
