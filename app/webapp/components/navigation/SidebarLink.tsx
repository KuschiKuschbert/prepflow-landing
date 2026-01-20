import { prefersReducedMotion } from '@/lib/arcadeGuards';
import { prefetchRoute } from '@/lib/cache/prefetch-config';
import Link from 'next/link';
import React from 'react';

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

interface SidebarLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  isActive: boolean;
  onClose: () => void;
  index: number;
}

export function SidebarLink({ href, label, icon, color, isActive, onClose, index }: SidebarLinkProps) {
  const reducedMotion = prefersReducedMotion();

  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      href={href}
      onClick={onClose}
      onMouseEnter={() => {
        // Prefetch API endpoints when hovering over any link
        prefetchRoute(href);
      }}
      className={cn(
        'group',
        'flex',
        'items-center',
        'space-x-4',
        'rounded-lg',
        'px-4',
        'py-3',
        'min-h-[44px]',
        'transition-all',
        'duration-200',
        isActive
          ? 'border border-[var(--primary)]/30 bg-[var(--primary)]/10'
          : 'hover:scale-[1.02] hover:bg-[var(--muted)]/50',
      )}
      style={{
        transitionTimingFunction: 'var(--easing-standard)',
        animation: reducedMotion ? 'none' : `fadeInUp 0.3s var(--easing-standard) forwards`,
        animationDelay: reducedMotion ? '0ms' : `${index * 20}ms`,
        opacity: reducedMotion ? 1 : 0,
      }}
    >
      <span className={cn(isActive ? color : `text-[var(--foreground-muted)]`)}>{icon}</span>
      <span
        className={cn(
          'text-sm',
          'font-medium',
          isActive
            ? 'text-[var(--foreground)]'
            : 'text-[var(--foreground)]/80 group-hover:text-[var(--foreground)]',
        )}
      >
        {label}
      </span>
    </Link>
  );
}
