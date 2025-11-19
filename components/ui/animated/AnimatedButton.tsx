/**
 * Animated Button with Press Effect
 */

'use client';

import React from 'react';

interface AnimatedButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  [key: string]: any;
}

export function AnimatedButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  loading = false,
  ...props
}: AnimatedButtonProps) {
  const baseClasses = `
    relative inline-flex items-center justify-center font-medium rounded-xl
    transition-all duration-200 ease-out transform
    hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white
      hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80
      focus:ring-[#29E7CD] shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25
    `,
    secondary: `
      bg-[#2a2a2a] text-white border border-[#3a3a3a]
      hover:bg-[#3a3a3a] hover:border-[#29E7CD]/50
      focus:ring-[#29E7CD]
    `,
    outline: `
      bg-transparent text-[#29E7CD] border border-[#29E7CD]
      hover:bg-[#29E7CD] hover:text-white
      focus:ring-[#29E7CD]
    `,
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-fluid-sm',
    md: 'px-4 py-3 text-fluid-base',
    lg: 'px-6 py-4 text-fluid-lg',
  };

  return (
    <button
      className={` ${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} `}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-200'}>
        {children}
      </span>
    </button>
  );
}

