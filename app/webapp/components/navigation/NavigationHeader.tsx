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
  handleLogoClick: (e: React.MouseEvent) => void;
  handleLogoTouchStart: (e: React.TouchEvent) => void;
  handleLogoTouchEnd: (e: React.TouchEvent) => void;
  handleLogoMouseDown: () => void;
  handleLogoMouseUp: () => void;
  handleLogoMouseLeave: () => void;
  shouldPreventNavigation: React.RefObject<boolean | null>;
  userButtonRef?: React.RefObject<HTMLButtonElement | null>;
  onAchievementsClick?: () => void;
}

const cn = (...classes: (string | undefined | null | false)[]): string =>
  classes.filter(Boolean).join(' ');

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
  const authUser = user as unknown as Record<string, unknown> | undefined;
  const nestedUser = authUser?.user as Record<string, unknown> | undefined;
  const userEmail = user?.email || (nestedUser?.email as string) || '';
  const auth0UserName = user?.name || (nestedUser?.name as string) || '';

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const userNameInput = useMemo(
    () => ({
      first_name: profile?.first_name,
      last_name: profile?.last_name,
      name: auth0UserName,
      email: userEmail,
    }),
    [profile?.first_name, profile?.last_name, auth0UserName, userEmail],
  );

  const userName = isMounted ? getUserDisplayName(userNameInput) : '';
  const { avatar: userAvatar } = useUserAvatar();
  const { isVisible, isDesktop, isScrolled } = useHeaderVisibility();
  const { seasonalEffect, bannerText, bannerColor } = useSeasonalEffects();

  const shouldHideHeader = isMounted ? !isVisible : false;

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

  const avatarUrl = useMemo(() => getAvatarUrl(userAvatar), [userAvatar]);
  const initials = useMemo(() => getDefaultAvatar(userNameInput), [userNameInput]);

  return (
    <>
      <header
        className={cn(
          'desktop:h-20 fixed inset-x-0 top-0 z-50 flex h-16 transition-all duration-300',
          shouldHideHeader && '-translate-y-full',
          isScrolled
            ? 'glass-surface border-b border-[var(--border)]/30 shadow-md'
            : 'bg-transparent',
          className,
        )}
      >
        <div className="tablet:px-6 desktop:px-8 mx-auto flex h-full w-full max-w-[2560px] items-center justify-between px-4">
          <div className="desktop:gap-8 flex items-center gap-4">
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

          <div className="desktop:gap-4 flex items-center gap-2">
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

            <div className="desktop:h-8 h-6 w-px bg-[var(--border)]" />

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
      </header>
    </>
  );
}

export const NavigationHeader = memo(NavigationHeaderBase);
