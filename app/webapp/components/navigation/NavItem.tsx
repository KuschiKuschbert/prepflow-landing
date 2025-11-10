'use client';

import { prefetchRoute } from '@/lib/cache/prefetch-config';
import Link from 'next/link';
import React from 'react';

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  isActive: boolean;
  onClick?: () => void;
  className?: string;
  iconSize?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function NavItem({
  href,
  label,
  icon,
  color,
  isActive,
  onClick,
  className = '',
  iconSize = 'md',
  showLabel = true,
}: NavItemProps) {
  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={() => prefetchRoute(href)}
      className={`group flex min-h-[44px] items-center space-x-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${
        isActive
          ? `border border-[#29E7CD]/20 bg-[#29E7CD]/10 ${className}`
          : `hover:bg-[#2a2a2a]/50 ${className}`
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      <span
        className={`${isActive ? color : 'text-gray-400 group-hover:text-gray-300'} flex items-center justify-center ${iconSizeClasses[iconSize]}`}
      >
        {icon}
      </span>
      {showLabel && (
        <span
          className={`text-sm font-medium ${
            isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
          }`}
        >
          {label}
        </span>
      )}
    </Link>
  );
}
