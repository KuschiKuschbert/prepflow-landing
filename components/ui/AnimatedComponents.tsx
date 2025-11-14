/**
 * Animated Card Component - Showcase of Modern Animation System
 * Demonstrates subtle, attractive animations that enhance UX
 */

'use client';

import React from 'react';
import { AnimatedDiv, FloatingElement, StaggeredContainer } from '../../lib/animation-stubs';

interface AnimatedCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
  className?: string;
  onClick?: () => void;
}

export function AnimatedCard({
  title,
  description,
  icon,
  delay = 0,
  className = '',
  onClick,
}: AnimatedCardProps) {
  return (
    <AnimatedDiv
      animation="fadeInUp"
      delay={delay}
      className={`group relative cursor-pointer rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#29E7CD]/50 hover:shadow-xl hover:shadow-[#29E7CD]/10 ${className} `}
      onClick={onClick}
    >
      {/* Floating Icon */}
      <FloatingElement intensity={1}>
        <div className="group-hover:animate-glow mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#29E7CD] to-[#D925C7]">
          {icon}
        </div>
      </FloatingElement>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="text-fluid-lg font-semibold text-white transition-colors duration-300 group-hover:text-[#29E7CD]">
          {title}
        </h3>
        <p className="text-fluid-sm leading-relaxed text-gray-400">{description}</p>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#29E7CD]/5 to-[#D925C7]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </AnimatedDiv>
  );
}

// Animated Button with Press Effect
export function AnimatedButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  loading = false,
  ...props
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  [key: string]: any;
}) {
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

// Animated Loading Skeleton
export function AnimatedSkeleton({
  variant = 'card',
  className = '',
}: {
  variant?: 'card' | 'text' | 'circle' | 'rect';
  className?: string;
}) {
  const variants = {
    card: 'h-32 rounded-2xl',
    text: 'h-4 rounded',
    circle: 'w-12 h-12 rounded-full',
    rect: 'h-20 rounded-xl',
  };

  return <div className={`animate-shimmer bg-[#2a2a2a] ${variants[variant]} ${className} `} />;
}

// Animated Progress Bar
export function AnimatedProgressBar({
  progress,
  label,
  className = '',
}: {
  progress: number;
  label?: string;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex justify-between text-fluid-sm">
          <span className="text-gray-300">{label}</span>
          <span className="font-medium text-[#29E7CD]">{progress}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#2a2a2a]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#29E7CD] to-[#D925C7] transition-all duration-1000 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}

// Animated Notification Toast
export function AnimatedToast({
  message,
  type = 'success',
  isVisible,
  onClose,
}: {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
}) {
  const typeClasses = {
    success: 'bg-green-900/20 border-green-500 text-green-400',
    error: 'bg-red-900/20 border-red-500 text-red-400',
    warning: 'bg-yellow-900/20 border-yellow-500 text-yellow-400',
    info: 'bg-blue-900/20 border-blue-500 text-blue-400',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  if (!isVisible) return null;

  return (
    <AnimatedDiv
      animation="slideInRight"
      className={`fixed top-4 right-4 z-50 w-full max-w-sm ${typeClasses[type]} rounded-xl border p-4 shadow-lg backdrop-blur-sm`}
    >
      <div className="flex items-center space-x-3">
        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
          <span className="text-fluid-lg">{icons[type]}</span>
        </div>
        <div className="flex-1">
          <p className="text-fluid-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 transition-colors hover:text-white"
        >
          <span className="sr-only">Close</span>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </AnimatedDiv>
  );
}

// Demo Component showcasing all animations
export function AnimationShowcase() {
  const [showToast, setShowToast] = React.useState(false);

  const handleCardClick = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <AnimatedDiv animation="fadeInDown" className="text-center">
        <h1 className="mb-4 text-fluid-4xl font-bold text-white">🎨 Modern Animation System</h1>
        <p className="text-fluid-lg text-gray-400">
          Subtle, performant animations that enhance user experience
        </p>
      </AnimatedDiv>

      {/* Staggered Cards */}
      <StaggeredContainer className="grid grid-cols-1 gap-6 desktop:grid-cols-2 large-desktop:grid-cols-3">
        <AnimatedCard
          title="Performance Optimized"
          description="All animations use CSS transforms and opacity for 60fps performance"
          icon={<span className="text-fluid-xl text-white">⚡</span>}
          onClick={handleCardClick}
        />
        <AnimatedCard
          title="Accessibility First"
          description="Respects prefers-reduced-motion and includes proper ARIA labels"
          icon={<span className="text-fluid-xl text-white">♿</span>}
          onClick={handleCardClick}
        />
        <AnimatedCard
          title="Modern Design"
          description="Subtle effects that enhance UX without being distracting"
          icon={<span className="text-fluid-xl text-white">✨</span>}
          onClick={handleCardClick}
        />
      </StaggeredContainer>

      {/* Interactive Elements */}
      <div className="flex flex-wrap justify-center gap-4">
        <AnimatedButton variant="primary" onClick={handleCardClick}>
          Primary Action
        </AnimatedButton>
        <AnimatedButton variant="secondary" onClick={handleCardClick}>
          Secondary Action
        </AnimatedButton>
        <AnimatedButton variant="outline" onClick={handleCardClick}>
          Outline Action
        </AnimatedButton>
        <AnimatedButton loading onClick={handleCardClick}>
          Loading State
        </AnimatedButton>
      </div>

      {/* Progress Demo */}
      <div className="mx-auto max-w-md space-y-4">
        <AnimatedProgressBar progress={75} label="Loading Progress" />
        <AnimatedProgressBar progress={45} label="Upload Status" />
      </div>

      {/* Toast Notification */}
      <AnimatedToast
        message="Animation system activated successfully! 🎉"
        type="success"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

const AnimatedComponents = {
  AnimatedCard,
  AnimatedButton,
  AnimatedSkeleton,
  AnimatedProgressBar,
  AnimatedToast,
  AnimationShowcase,
};

export default AnimatedComponents;
