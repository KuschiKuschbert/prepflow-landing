import { LogoutButton } from '@/app/webapp/components/LogoutButton';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Icon } from '@/components/ui/Icon';
import { prefetchRoute } from '@/lib/cache/prefetch-config';
import { getUserGreeting } from '@/lib/user-name';
import { CreditCard, Settings, Settings2, Shield, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface UserMenuProps {
  isOpen: boolean;
  dropdownPosition: { top: number; right: number } | null;
  desktopMenuRef: React.RefObject<HTMLDivElement | null>;
  avatarUrl: string | null;
  userName: string | null;
  userEmail: string | undefined;
  firstName: string | null;
  lastName: string | null;
  defaultInitials: string;
  onClose: () => void;
}

/**
 * User menu popover component
 */
export function UserMenu({
  isOpen,
  dropdownPosition,
  desktopMenuRef,
  avatarUrl,
  userName,
  userEmail,
  firstName,
  lastName,
  defaultInitials,
  onClose,
}: UserMenuProps) {
  if (!isOpen || !dropdownPosition) return null;

  return (
    <div
      ref={desktopMenuRef}
      className="fixed z-[70] w-[350px] max-w-[calc(100vw-2rem)] origin-top-right overflow-hidden rounded-2xl bg-gradient-to-r from-[#29E7CD]/20 via-[#D925C7]/20 via-[#FF6B00]/20 to-[#29E7CD]/20 p-[1px] shadow-2xl"
      style={{
        animation: 'scale-in-bubble 0.25s var(--easing-emphasized) forwards',
        top: `${dropdownPosition.top}px`,
        right: `${dropdownPosition.right}px`,
      }}
    >
      <div className="rounded-xl bg-[#1f1f1f]/95 p-4">
        {/* Header: Centered Profile */}
        <div className="flex flex-col items-center space-y-2 pb-4">
          <div className="relative">
            <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF6B00]/50 text-xl font-bold text-black shadow-inner">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={userName ? `${userName}'s avatar` : 'User avatar'}
                  fill
                  sizes="64px"
                  className="object-cover"
                  unoptimized
                />
              ) : defaultInitials && defaultInitials !== 'U' ? (
                defaultInitials
              ) : userName ? (
                userName[0].toUpperCase()
              ) : (
                <Icon icon={User} size="sm" className="text-black" aria-hidden={true} />
              )}
            </div>
            {/* Camera icon overlay (optional) */}
            <div className="absolute right-0 bottom-0 flex h-6 w-6 items-center justify-center rounded-full border border-[#1f1f1f] bg-[#2a2a2a] text-white">
              <div className="h-2 w-2 rounded-full bg-[#FF6B00]" />
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-medium text-white">
              {getUserGreeting(
                {
                  first_name: firstName,
                  last_name: lastName,
                  name: userName,
                  email: userEmail,
                },
                'Hi',
              )}
            </div>
            <div className="text-sm text-gray-400">{userEmail}</div>
          </div>

          <Link
            href="/webapp/settings#profile"
            onClick={onClose}
            onMouseEnter={() => prefetchRoute('/webapp/settings')}
            className="mt-2 inline-flex items-center justify-center rounded-full border border-gray-600 px-6 py-2 text-sm font-medium text-[#FF6B00] transition-colors hover:bg-[#2a2a2a]"
          >
            Manage your Account
          </Link>
        </div>

        {/* Divider */}
        <div className="my-2 border-t border-[#2a2a2a]" />

        {/* List Options */}
        <div className="space-y-1">
          <Link
            href="/webapp/settings#preferences"
            onClick={onClose}
            onMouseEnter={() => prefetchRoute('/webapp/settings')}
            className="flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-[#2a2a2a] hover:text-white"
          >
            <Icon icon={Settings2} size="sm" className="text-gray-400" />
            <span>App Preferences</span>
          </Link>

          <Link
            href="/webapp/settings#security"
            onClick={onClose}
            onMouseEnter={() => prefetchRoute('/webapp/settings')}
            className="flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-[#2a2a2a] hover:text-white"
          >
            <Icon icon={Shield} size="sm" className="text-gray-400" />
            <span>Security</span>
          </Link>

          <Link
            href="/webapp/settings/billing"
            onClick={onClose}
            onMouseEnter={() => prefetchRoute('/webapp/settings/billing')}
            className="flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-[#2a2a2a] hover:text-white"
          >
            <Icon icon={CreditCard} size="sm" className="text-gray-400" />
            <span>Subscription & Billing</span>
          </Link>

          <Link
            href="/webapp/setup"
            onClick={onClose}
            onMouseEnter={() => prefetchRoute('/webapp/setup')}
            className="flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-[#2a2a2a] hover:text-white"
          >
            <Icon icon={Settings} size="sm" className="text-gray-400" />
            <span>Setup</span>
          </Link>

          <div className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-[#2a2a2a] hover:text-white">
            <div className="flex items-center space-x-3">
              <span className="flex h-4 w-4 items-center justify-center">🌐</span>
              <span>Language</span>
            </div>
            <div className="ml-auto">
              <LanguageSwitcher />
            </div>
          </div>

          <div className="flex w-full items-center justify-center pt-2">
            <div className="w-full">
              <LogoutButton />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-center text-[10px] text-gray-500">
          <Link href="/privacy" className="mx-2 hover:text-gray-300">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/terms" className="mx-2 hover:text-gray-300">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}
