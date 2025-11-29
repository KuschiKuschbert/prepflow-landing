'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { X, Settings, Settings2, User } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { LogoutButton } from '../LogoutButton';
import { prefetchRoute } from '@/lib/cache/prefetch-config';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userButtonRef?: React.RefObject<HTMLButtonElement | null>;
}

/**
 * SettingsDrawer component.
 * Desktop: Right-side slide-in drawer for user settings.
 * Mobile: Floating bubble menu positioned near user icon with scale-in animation.
 * Triggered by clicking the User Avatar in the header.
 */
export function SettingsDrawer({ isOpen, onClose, userButtonRef }: SettingsDrawerProps) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const userName = session?.user?.name || userEmail?.split('@')[0];
  const drawerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 1024px)'); // Match custom desktop breakpoint (1025px+)
  const [buttonPosition, setButtonPosition] = useState<{ x: number; y: number } | null>(null);

  // Calculate button position for bubble animation origin (mobile only)
  useEffect(() => {
    if (isOpen && isMobile && userButtonRef?.current) {
      const button = userButtonRef.current;
      const rect = button.getBoundingClientRect();
      // Calculate center of button
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      setButtonPosition({ x, y });
    } else {
      setButtonPosition(null);
    }
  }, [isOpen, isMobile, userButtonRef]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll
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

  // Mobile: Floating bubble menu
  if (isMobile) {
    return (
      <>
        {/* Backdrop - Subtle dimming */}
        <div
          className={`fixed inset-0 z-[80] bg-black/20 backdrop-blur-[1px] transition-opacity duration-200 ${
            isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Floating Bubble Menu - Positioned near user icon */}
        <div
          ref={drawerRef}
          className={`fixed top-[calc(var(--header-height-mobile)+var(--safe-area-inset-top)+0.5rem)] right-4 z-[90] max-h-[70vh] w-[300px] overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-2xl ${
            isOpen ? '' : 'pointer-events-none'
          }`}
          style={{
            transformOrigin: buttonPosition
              ? `${buttonPosition.x}px ${buttonPosition.y}px`
              : 'top right',
            animation: isOpen
              ? 'scale-in-bubble 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards'
              : 'none',
            opacity: isOpen ? 1 : 0,
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Settings and Account"
        >
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#2a2a2a] p-4">
              <h2 className="text-lg font-semibold text-white">Account</h2>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
                aria-label="Close settings"
              >
                <Icon icon={X} size="md" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Profile Section */}
              <div className="mb-6 flex flex-col items-center justify-center space-y-3 py-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#29E7CD] to-[#29E7CD]/50 text-2xl font-bold text-black shadow-lg">
                  {userName ? userName[0].toUpperCase() : <Icon icon={User} size="lg" />}
                </div>
                <div className="text-center">
                  <div className="text-lg font-medium text-white">{userName || 'User'}</div>
                  {userEmail && <div className="text-sm text-gray-400">{userEmail}</div>}
                </div>
              </div>

              <div className="space-y-6">
                {/* Account Settings Group */}
                <div className="space-y-1">
                  <div className="mb-2 px-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Preferences
                  </div>
                  <Link
                    href="/webapp/settings"
                    onClick={onClose}
                    onMouseEnter={() => prefetchRoute('/webapp/settings')}
                    className="flex w-full items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-[#2a2a2a] hover:text-white"
                  >
                    <Icon icon={Settings2} size="sm" className="text-gray-400" />
                    <span>Settings</span>
                  </Link>

                  <Link
                    href="/webapp/setup"
                    onClick={onClose}
                    onMouseEnter={() => prefetchRoute('/webapp/setup')}
                    className="flex w-full items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-[#2a2a2a] hover:text-white"
                  >
                    <Icon icon={Settings} size="sm" className="text-gray-400" />
                    <span>Setup</span>
                  </Link>

                  <div className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-[#2a2a2a] hover:text-white">
                    <div className="flex items-center space-x-3">
                      <span className="flex h-4 w-4 items-center justify-center">🌐</span>
                      <span>Language</span>
                    </div>
                    <div className="ml-auto">
                      <LanguageSwitcher />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#2a2a2a] p-4">
              <LogoutButton />
            </div>
          </div>
        </div>
      </>
    );
  }

  // Desktop: Slide-in drawer
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className={`fixed inset-y-0 right-0 z-[90] w-[320px] max-w-[85vw] transform border-l border-[#2a2a2a] bg-[#1f1f1f] shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Settings and Account"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2a2a2a] p-4">
            <h2 className="text-lg font-semibold text-white">Account</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
              aria-label="Close settings"
            >
              <Icon icon={X} size="md" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Profile Section */}
            <div className="mb-6 flex flex-col items-center justify-center space-y-3 py-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#29E7CD] to-[#29E7CD]/50 text-2xl font-bold text-black shadow-lg">
                {userName ? userName[0].toUpperCase() : <Icon icon={User} size="lg" />}
              </div>
              <div className="text-center">
                <div className="text-lg font-medium text-white">{userName || 'User'}</div>
                {userEmail && <div className="text-sm text-gray-400">{userEmail}</div>}
              </div>
            </div>

            <div className="space-y-6">
              {/* Account Settings Group */}
              <div className="space-y-1">
                <div className="mb-2 px-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Preferences
                </div>
                <Link
                  href="/webapp/settings"
                  onClick={onClose}
                  onMouseEnter={() => prefetchRoute('/webapp/settings')}
                  className="flex w-full items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-[#2a2a2a] hover:text-white"
                >
                  <Icon icon={Settings2} size="sm" className="text-gray-400" />
                  <span>Settings</span>
                </Link>

                <Link
                  href="/webapp/setup"
                  onClick={onClose}
                  onMouseEnter={() => prefetchRoute('/webapp/setup')}
                  className="flex w-full items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-[#2a2a2a] hover:text-white"
                >
                  <Icon icon={Settings} size="sm" className="text-gray-400" />
                  <span>Setup</span>
                </Link>

                <div className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-[#2a2a2a] hover:text-white">
                  <div className="flex items-center space-x-3">
                    <span className="flex h-4 w-4 items-center justify-center">🌐</span>
                    <span>Language</span>
                  </div>
                  <div className="ml-auto">
                    <LanguageSwitcher />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-[#2a2a2a] p-4">
            <LogoutButton />
          </div>
        </div>
      </div>
    </>
  );
}
