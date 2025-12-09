import { useState, useEffect, useRef } from 'react';

interface UseUserMenuProps {
  isDesktop: boolean;
  userButtonRef?: React.RefObject<HTMLButtonElement | null>;
}

/**
 * Hook for managing user menu state and positioning
 */
export function useUserMenu({ isDesktop, userButtonRef }: UseUserMenuProps) {
  const [isDesktopUserMenuOpen, setIsDesktopUserMenuOpen] = useState(false);
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const internalUserButtonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; right: number } | null>(
    null,
  );

  // Use provided ref or internal ref
  const buttonRef = userButtonRef || internalUserButtonRef;

  // Calculate dropdown position when menu opens
  useEffect(() => {
    if (!isDesktopUserMenuOpen || !buttonRef?.current) {
      setDropdownPosition(null);
      return;
    }

    const updatePosition = () => {
      if (!buttonRef?.current) return;
      const buttonRect = buttonRef.current.getBoundingClientRect();

      setDropdownPosition({
        top: buttonRect.bottom + 12, // mt-3 = 12px
        right: window.innerWidth - buttonRect.right,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isDesktopUserMenuOpen, buttonRef]);

  // Close desktop user menu when clicking outside
  useEffect(() => {
    if (!isDesktopUserMenuOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        desktopMenuRef.current &&
        !desktopMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('button[aria-label="Open user settings"]')
      ) {
        setIsDesktopUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isDesktopUserMenuOpen]);

  const handleUserAvatarClick = () => {
    setIsDesktopUserMenuOpen(!isDesktopUserMenuOpen);
  };

  return {
    isDesktopUserMenuOpen,
    setIsDesktopUserMenuOpen,
    desktopMenuRef,
    buttonRef,
    dropdownPosition,
    handleUserAvatarClick,
  };
}
