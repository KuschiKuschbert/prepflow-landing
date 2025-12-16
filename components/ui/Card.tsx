import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'highlight' | 'feature';
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  onClick,
  interactive = false,
  ...props
}) => {
  const baseClasses = 'rounded-2xl border backdrop-blur-sm shadow-lg transition-all duration-300';

  const variantClasses = {
    default: 'border-[var(--border)] bg-[var(--surface)]/80 hover:shadow-xl',
    highlight:
      'border-[var(--primary)]/30 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10 hover:shadow-2xl',
    feature: 'border-[var(--border)] bg-[var(--surface)]/80 hover:shadow-xl hover:border-[var(--primary)]/50',
  };

  const interactiveClasses = interactive ? 'cursor-pointer hover:scale-[1.02]' : '';

  const classes = `${baseClasses} ${variantClasses[variant]} ${interactiveClasses} ${className}`;

  if (onClick || interactive) {
    return (
      <div
        className={classes}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? e => e.key === 'Enter' && onClick() : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};
