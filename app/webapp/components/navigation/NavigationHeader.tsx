'use client';
import { NavbarStats } from '@/components/Arcade/NavbarStats';
import { Icon } from '@/components/ui/Icon';
import { useUserAvatar } from '@/hooks/useUserAvatar';
import { useUserProfile } from '@/hooks/useUserProfile';
import { logger } from '@/lib/logger';
import { getAvatarUrl, getDefaultAvatar } from '@/lib/user-avatar';
import { getUserDisplayName } from '@/lib/user-name';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Search } from 'lucide-react';
import { memo, useEffect, useMemo, useState } from 'react';
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

const cn = (...classes: (string | undefined | null | false)[]): string =>
  classes.filter(Boolean).join(' ');

/**
 * Navigation header component for webapp.
 * Displays logo, breadcrumbs (desktop), search button, and user info.
 * Auto-hides on mobile/tablet when scrolling down, shows on scroll up or at top.
 *
 * @component
 */
function NavigationHeaderBase({
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
  const [isMounted, setIsMounted] = useState(false);
  const { user, error: userError, isLoading: userLoading } = useUser();
  // Handle nested user structure: user.user.email (Auth0 SDK sometimes returns nested structure)
  const userEmail = user?.email || (user as any)?.user?.email;
  const auth0UserName = user?.name || (user as any)?.user?.name;

  // Prevent hydration mismatch by only computing user-dependent values after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Log Auth0 useUser() result in NavigationHeader
  useEffect(() => {
    logger.dev('[NavigationHeader] Auth0 useUser() result:', {
      hasUser: !!user,
      user,
      userEmail,
      userError: userError?.message,
      userLoading,
      userKeys: user ? Object.keys(user) : [],
      userEmailValue: user?.email,
      userNameValue: auth0UserName,
    });
  }, [user, userEmail, userError, userLoading, auth0UserName]);

  const { profile } = useUserProfile();

  // Priority: Database first_name/last_name → Auth0 session name → Email prefix
  const userNameInput = useMemo(() => ({
    first_name: profile?.first_name,
    last_name: profile?.last_name,
    name: auth0UserName,
    email: userEmail,
  }), [profile?.first_name, profile?.last_name, auth0UserName, userEmail]);

  const userName = isMounted ? getUserDisplayName(userNameInput) : '';
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
  const avatarUrl = useMemo(() => getAvatarUrl(userAvatar), [userAvatar]);
  const initials = useMemo(() => getDefaultAvatar(userNameInput), [userNameInput]);

  return (
    <>
      <div
        className={cn(
          'fixed inset-x-0 top-0 z-50 flex h-16 transform items-center transition-all duration-300 desktop:h-20',
          !isVisible && '-translate-y-full',
          className,
        )}
      >
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-4 desktop:px-6">
          <div className="flex items-center gap-4 desktop:gap-8">
            <LogoSection
              handleLogoClick={handleLogoClick}
              handleLogoTouchStart={handleLogoTouchStart}
              handleLogoTouchEnd={handleLogoTouchEnd}
              handleLogoMouseDown={handleLogoMouseDown}
              handleLogoMouseUp={handleLogoMouseUp}
              handleLogoMouseLeave={handleLogoMouseLeave}
              shouldPreventNavigation={shouldPreventNavigation}
              seasonalBannerText={seasonalEffect || bannerText || null}
              seasonalBannerColor={bannerColor}
              isDesktop={isDesktop}
            />
            {isDesktop && (
              <Breadcrumbs
                pathname={pathname}
                navigationItems={navigationItems}
                isActive={isActive}
              />
            )}
          </div>

          <div className="flex items-center gap-2 desktop:gap-4">
            <button
              onClick={onSearchClick}
              className={cn(
                'relative flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-[var(--surface-variant)] active:scale-95',
                isSearchOpen && 'bg-[var(--surface-variant)] text-[var(--primary)]',
              )}
              aria-label="Search"
            >
              <Icon icon={Search} size="sm" />
            </button>

            <NavbarStats onClick={onAchievementsClick} />

            <div className="h-6 w-px bg-[var(--border)] desktop:h-8" />

            <UserAvatarButton
              buttonRef={buttonRef}
              onClick={handleUserAvatarClick}
              avatarUrl={avatarUrl}
              defaultInitials={initials}
              userName={userName}
              isMenuOpen={isDesktopUserMenuOpen}
            />
          </div>
        </div>

        {/* User Menu Popover */}
        <UserMenu
          isOpen={isDesktopUserMenuOpen}
          onClose={() => setIsDesktopUserMenuOpen(false)}
          desktopMenuRef={desktopMenuRef}
          dropdownPosition={dropdownPosition}
          userName={userName}
          userEmail={userEmail || ''}
          firstName={profile?.first_name || null}
          lastName={profile?.last_name || null}
          avatarUrl={avatarUrl}
          defaultInitials={initials}
        />
      </div>

      {/* Spacer for fixed header */}
      <div className="h-16 desktop:h-20" />
    </>
  );
}

export const NavigationHeader = memo(NavigationHeaderBase);
