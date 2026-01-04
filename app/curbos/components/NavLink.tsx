import Link from 'next/link';

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

/**
 * Helper component for Navigation Links
 * Compact navigation with icon + label for all breakpoints (mobile-style layout)
 */
export function NavLink({ href, icon, label }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-0.5 px-1.5 py-1.5 rounded-lg text-sm font-bold text-neutral-400 hover:text-white hover:bg-white/5 transition-all hover:scale-105 active:scale-95 group min-h-[44px] flex-shrink-0"
      title={label}
    >
      <span className="text-neutral-500 group-hover:text-[#C0FF02] transition-colors flex-shrink-0">{icon}</span>
      <span className="text-[9px] font-bold uppercase tracking-wider text-center leading-tight whitespace-nowrap text-neutral-500 group-hover:text-neutral-300 transition-colors">{label}</span>
    </Link>
  );
}
