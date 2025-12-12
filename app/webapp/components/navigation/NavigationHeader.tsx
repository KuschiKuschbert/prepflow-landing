'use client';

import { NavbarStats } from '@/components/Arcade/NavbarStats';
import { Icon } from '@/components/ui/Icon';
import { useUserAvatar } from '@/hooks/useUserAvatar';
import { getAvatarUrl, getDefaultAvatar } from '@/lib/user-avatar';
import { Search } from 'lucide-react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Breadcrumbs } from './NavigationHeader/components/Breadcrumbs';
import { LogoSection } from './NavigationHeader/components/LogoSection';
import { UserAvatarButton } from './NavigationHeader/components/UserAvatarButton';
import { UserMenu } from './NavigationHeader/components/UserMenu';
import { useHeaderVisibility } from './NavigationHeader/hooks/useHeaderVisibility';
import { useSeasonalEffects } from './NavigationHeader/hooks/useSeasonalEffects';
import { useUserMenu } from './NavigationHeader/hooks/useUserMenu';

interface NavigationHeaderProps {
  className?: string;
  onSearchClick: () => void;
  isSearchOpen: boolean;
  pathname: string;
  navigationItems: Array<{ href: string; label: string }>;
  isActive: (href: string) => boolean;
  // Logo interaction handlers from parent
  handleLogoClick: (e: React.MouseEvent) => void;
  handleLogoTouchStart: (e: React.TouchEvent) => void;
  handleLogoTouchEnd: (e: React.TouchEvent) => void;
  handleLogoMouseDown: () => void;
  handleLogoMouseUp: () => void;
  handleLogoMouseLeave: () => void;
  shouldPreventNavigation: React.RefObject<boolean | null>;
  // Ref for user button (for popover positioning)
  userButtonRef?: React.RefObject<HTMLButtonElement | null>;
  // Gamification handlers
  onAchievementsClick?: () => void;
}

const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Navigation header component for webapp.
 * Displays logo, breadcrumbs (desktop), search button, and user info.
 * Auto-hides on mobile/tablet when scrolling down, shows on scroll up or at top.
 *
 * @component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Navigation header
 */
export function NavigationHeader({
  className = '',
  onSearchClick,
  isSearchOpen,
  pathname,
  navigationItems,
  isActive,
  handleLogoClick,
  handleLogoTouchStart,
  handleLogoTouchEnd,
  handleLogoMouseDown,
  handleLogoMouseUp,
  handleLogoMouseLeave,
  shouldPreventNavigation,
  userButtonRef,
  onAchievementsClick,
}: NavigationHeaderProps) {
  const { user } = useUser();
  const userEmail = user?.email;
  const userName = user?.name || userEmail?.split('@')[0];
  const { avatar: userAvatar } = useUserAvatar();

  const { isVisible, isDesktop } = useHeaderVisibility();
  const { seasonalEffect, bannerText, bannerColor } = useSeasonalEffects();

  const {
    isDesktopUserMenuOpen,
    setIsDesktopUserMenuOpen,
    desktopMenuRef,
    buttonRef,
    dropdownPosition,
    handleUserAvatarClick,
  } = useUserMenu({
    isDesktop,
    userButtonRef,
  });

  // Get avatar URL or default initials
  const avatarUrl = getAvatarUrl(userAvatar);
  const defaultInitials = getDefaultAvatar(userName || userEmail || '');

  return (
    <header
      role="banner"
      className={cn(
        'fixed',
        'top-0',
        'left-0',
        'right-0',
        'z-50',
        'border-b',
        'border-[#2a2a2a]',
        'bg-[#1f1f1f]',
        'pt-[var(--safe-area-inset-top)]',
        'h-[var(--header-height-mobile)]',
        'desktop:h-[var(--header-height-desktop)]',
        // Auto-hide transition only on mobile/tablet (< 1025px)
        !isDesktop && 'transition-transform duration-300',
        className,
      )}
      style={{
        // Only apply transform on mobile/tablet (< 1025px)
        transform: !isDesktop && !isVisible ? 'translateY(-100%)' : 'translateY(0)',
        transitionTimingFunction: !isDesktop ? 'var(--easing-standard)' : undefined,
      }}
    >
      <div className="desktop:px-4 relative flex items-center justify-between px-3 py-2">
        <LogoSection
          shouldPreventNavigation={shouldPreventNavigation}
          handleLogoClick={handleLogoClick}
          handleLogoTouchStart={handleLogoTouchStart}
          handleLogoTouchEnd={handleLogoTouchEnd}
          handleLogoMouseDown={handleLogoMouseDown}
          handleLogoMouseUp={handleLogoMouseUp}
          handleLogoMouseLeave={handleLogoMouseLeave}
          seasonalBannerText={bannerText}
          seasonalBannerColor={bannerColor}
          isDesktop={isDesktop}
        />

        <Breadcrumbs pathname={pathname} navigationItems={navigationItems} isActive={isActive} />

        <div className="desktop:space-x-3 relative flex items-center space-x-2">
          <button
            onClick={onSearchClick}
            className={cn(
              'rounded-lg',
              'p-1.5',
              'min-h-[44px]',
              'min-w-[44px]',
              'transition-colors',
              'hover:bg-[#2a2a2a]/50',
              'focus:outline-none',
              'focus:ring-2',
              'focus:ring-[#29E7CD]',
              'focus:ring-offset-2',
              'focus:ring-offset-[#1f1f1f]',
            )}
            aria-label="Open search"
            aria-controls="search-modal"
            aria-expanded={isSearchOpen}
          >
            <Icon icon={Search} size="md" className="text-gray-400" aria-hidden={true} />
          </button>
          <NavbarStats onClick={onAchievementsClick} />

          {/* User Avatar Trigger */}
          <div className="relative">
            <UserAvatarButton
              buttonRef={buttonRef}
              avatarUrl={avatarUrl || null}
              userName={userName || null}
              defaultInitials={defaultInitials}
              isMenuOpen={isDesktopUserMenuOpen}
              onClick={handleUserAvatarClick}
            />

            <UserMenu
              isOpen={isDesktopUserMenuOpen}
              dropdownPosition={dropdownPosition}
              desktopMenuRef={desktopMenuRef}
              avatarUrl={avatarUrl || null}
              userName={userName || null}
              userEmail={userEmail || undefined}
              defaultInitials={defaultInitials}
              onClose={() => setIsDesktopUserMenuOpen(false)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
