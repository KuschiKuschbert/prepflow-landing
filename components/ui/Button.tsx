import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  'aria-label'?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  disabled = false,
  loading = false,
  'aria-label': ariaLabel,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0a]';

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25',
    secondary:
      'bg-gradient-to-r from-[#D925C7] to-[#29E7CD] text-white shadow-lg hover:shadow-xl hover:shadow-[#D925C7]/25',
    outline: 'border border-gray-600 text-gray-300 hover:border-[#29E7CD] hover:text-[#29E7CD]',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-fluid-sm rounded-lg',
    md: 'px-6 py-3 text-fluid-base rounded-xl',
    lg: 'px-8 py-4 text-fluid-lg rounded-2xl',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes} aria-label={ariaLabel} {...props}>
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
        )}
        {children}
      </a>
    );
  }

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      {...props}
    >
      {loading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
      )}
      {children}
    </button>
  );
};
