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
  onTrack?: (href: string) => void;
  className?: string;
  iconSize?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  compact?: boolean;
}

export function NavItem({
  href,
  label,
  icon,
  color,
  isActive,
  onClick,
  onTrack,
  className = '',
  iconSize = 'md',
  showLabel = true,
  compact = false,
}: NavItemProps) {
  const handleClick = () => {
    if (onTrack) {
      onTrack(href);
    }
    if (onClick) {
      onClick();
    }
  };
  const iconSizeClasses: Record<string, string> = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  };

  if (compact) {
    return (
      <Link
        href={href}
        onClick={handleClick}
        onMouseEnter={() => prefetchRoute(href)}
        className={`group flex min-h-[36px] items-center space-x-2 rounded-lg px-2 py-1.5 transition-all duration-200 ${
          isActive
            ? `border border-[#29E7CD]/20 bg-[#29E7CD]/10 ${className}`
            : `hover:bg-[#2a2a2a]/30 ${className}`
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        <span
          className={`${isActive ? color : 'text-gray-400 group-hover:text-gray-300'} flex items-center justify-center ${iconSizeClasses.sm}`}
        >
          {icon}
        </span>
        {showLabel && (
          <span
            className={`text-xs font-medium ${
              isActive ? 'text-white/90' : 'text-gray-300/90 group-hover:text-white'
            }`}
          >
            {label}
          </span>
        )}
      </Link>
    );
  }

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
