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
  return (
    <div
      className={`rounded-full transition-all duration-200 ${
        isMenuOpen
          ? 'bg-gradient-to-r from-[#29E7CD]/20 via-[#D925C7]/20 via-[#FF6B00]/20 to-[#29E7CD]/20 p-[1px]'
          : ''
      }`}
    >
      <button
        ref={buttonRef}
        onClick={onClick}
        className="relative flex h-[40px] w-[40px] items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF6B00]/50 text-xs font-bold text-black shadow-md transition-transform duration-200 hover:scale-105 focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none"
        style={{
          transitionTimingFunction: 'var(--easing-standard)',
        }}
        aria-label="Open user settings"
        aria-expanded={isMenuOpen}
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={userName ? `${userName}'s avatar` : 'User avatar'}
            fill
            sizes="40px"
            className="object-cover"
            unoptimized
          />
        ) : (
          <span>{defaultInitials}</span>
        )}
      </button>
    </div>
  );
}
