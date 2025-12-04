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

/**
 * Navigation item component for links in navigation menus.
 * Supports both compact and full modes with proper touch targets (≥44px).
 * Includes focus indicators and prefetching on hover.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.href - Navigation href
 * @param {string} props.label - Item label
 * @param {ReactNode} props.icon - Icon component
 * @param {string} props.color - Color class for active state
 * @param {boolean} props.isActive - Whether the item is active
 * @param {Function} [props.onClick] - Optional click handler
 * @param {Function} [props.onTrack] - Optional tracking callback
 * @param {string} [props.className] - Additional CSS classes
 * @param {'sm' | 'md' | 'lg'} [props.iconSize='md'] - Icon size
 * @param {boolean} [props.showLabel=true] - Whether to show label
 * @param {boolean} [props.compact=false] - Whether to use compact mode
 * @returns {JSX.Element} Navigation item
 *
 * @example
 * ```tsx
 * <NavItem
 *   href="/webapp/recipes"
 *   label="Recipes"
 *   icon={<Icon icon={UtensilsCrossed} />}
 *   color="text-[#29E7CD]"
 *   isActive={pathname.startsWith('/webapp/recipes')}
 *   compact={false}
 * />
 * ```
 */
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
        className={`group flex min-h-[44px] items-center py-3 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none ${
          showLabel
            ? `space-x-3 rounded-lg px-4 transition-all duration-200 ${
                isActive
                  ? 'border border-[#29E7CD]/30 bg-[#29E7CD]/10'
                  : 'hover:scale-[1.02] hover:bg-[#2a2a2a]/30'
              }`
            : 'justify-center rounded-none !border-0 !bg-transparent px-3 !shadow-none !outline-none hover:!bg-transparent'
        } ${showLabel ? className : ''}`}
        style={{
          ...(showLabel
            ? {
                transitionTimingFunction: 'var(--easing-standard)',
              }
            : {
                backgroundColor: 'transparent !important',
                border: 'none !important',
                borderRadius: '0 !important',
                boxShadow: 'none !important',
                outline: 'none !important',
                transition: 'none',
              }),
        }}
        aria-current={isActive ? 'page' : undefined}
      >
        <span
          className={`flex flex-shrink-0 items-center justify-center ${
            showLabel
              ? `${isActive ? color : 'text-gray-400 group-hover:text-gray-300'} ${iconSizeClasses.sm}`
              : `flex aspect-square h-10 w-10 items-center justify-center rounded-full border-2 ${
                  isActive
                    ? 'border-[#29E7CD]/50'
                    : 'border-transparent group-hover:border-[#2a2a2a]/50'
                } ${isActive ? color : 'text-gray-400 group-hover:text-gray-300'}`
          }`}
        >
          {showLabel ? (
            icon
          ) : (
            <span className={`${iconSizeClasses.sm} flex items-center justify-center`}>{icon}</span>
          )}
        </span>
        {showLabel && (
          <span
            className={`text-sm font-medium ${
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
      className={`${showLabel ? 'group' : ''} flex ${showLabel ? 'min-h-[44px]' : ''} items-center ${showLabel ? 'py-3' : 'py-0'} ${
        showLabel
          ? `space-x-4 rounded-lg px-4 transition-all duration-200 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none ${
              isActive
                ? 'border border-[#29E7CD]/30 bg-[#29E7CD]/10'
                : 'hover:scale-[1.02] hover:bg-[#2a2a2a]/50'
            }`
          : 'justify-center rounded-none !border-0 !bg-transparent px-0 py-0 !shadow-none !ring-0 !outline-none hover:!bg-transparent focus:!ring-0'
      } ${showLabel ? className : ''}`}
      style={{
        ...(showLabel
          ? {
              transitionTimingFunction: 'var(--easing-standard)',
            }
          : {
              backgroundColor: 'transparent !important',
              border: 'none !important',
              borderRadius: '0 !important',
              boxShadow: 'none !important',
              outline: 'none !important',
              transition: 'none',
            }),
      }}
      aria-current={isActive ? 'page' : undefined}
    >
      <span
        className={`flex flex-shrink-0 items-center justify-center ${
          showLabel
            ? `${isActive ? color : 'text-gray-400 group-hover:text-gray-300'} ${iconSizeClasses[iconSize]}`
            : `flex aspect-square h-10 w-10 items-center justify-center rounded-full border-2 ${
                isActive
                  ? 'border-[#29E7CD]/50'
                  : 'border-transparent group-hover:border-[#2a2a2a]/50'
              } ${isActive ? color : 'text-gray-400 group-hover:text-gray-300'}`
        }`}
      >
        {showLabel ? (
          icon
        ) : (
          <span className={`${iconSizeClasses[iconSize]} flex items-center justify-center`}>
            {icon}
          </span>
        )}
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
