import Link from 'next/link';

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

/**
 * Helper component for Navigation Links
 */
export function NavLink({ href, icon, label }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-2 tablet:px-4 py-2 rounded-lg text-sm font-bold text-neutral-400 hover:text-white hover:bg-white/5 transition-all hover:scale-105 active:scale-95 group"
      title={label}
    >
      <span className="text-neutral-500 group-hover:text-[#C0FF02] transition-colors">{icon}</span>
      <span className="hidden tablet:inline">{label}</span>
    </Link>
  );
}

