'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface UserAvatarButtonProps {
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  avatarUrl: string | null;
  userName: string | null;
  defaultInitials: string;
  isMenuOpen: boolean;
  onClick: () => void;
}

/**
 * User avatar button component
 */
export function UserAvatarButton({
  buttonRef,
  avatarUrl,
  userName,
  defaultInitials,
  isMenuOpen,
  onClick,
}: UserAvatarButtonProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [displayInitials, setDisplayInitials] = useState('U');

  // Prevent hydration mismatch by only rendering initials after mount
  useEffect(() => {
    setIsMounted(true);
    // Store initials after mount to ensure consistency
    setDisplayInitials(defaultInitials || 'U');
  }, [defaultInitials]);

  return (
    <div
      className={`rounded-full transition-all duration-200 ${
        isMenuOpen
          ? 'bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-[1px]'
          : ''
      }`}
    >
      <button
        ref={buttonRef}
        onClick={onClick}
        className="relative flex h-[40px] w-[40px] items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[var(--tertiary)] to-[var(--tertiary)]/50 text-xs font-bold text-[var(--button-active-text)] shadow-md transition-transform duration-200 hover:scale-105 focus:ring-2 focus:ring-[var(--tertiary)] focus:ring-offset-2 focus:ring-offset-[var(--surface)] focus:outline-none"
        style={{
          transitionTimingFunction: 'var(--easing-standard)',
        }}
        aria-label="Open user settings"
        aria-expanded={isMenuOpen}
        suppressHydrationWarning
      >
        {!isMounted ? (
          <span suppressHydrationWarning>U</span>
        ) : avatarUrl ? (
          <div className="relative h-full w-full" suppressHydrationWarning>
            <Image
              src={avatarUrl}
              alt={userName ? `${userName}'s avatar` : 'User avatar'}
              fill
              sizes="40px"
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <span suppressHydrationWarning>{displayInitials}</span>
        )}
      </button>
    </div>
  );
}
