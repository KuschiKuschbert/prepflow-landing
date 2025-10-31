/**
 * Animation utilities and components for PrepFlow
 * Provides reusable animation components and utilities
 */

'use client';

import React from 'react';

// AnimatedDiv component with fade-in animation
export const AnimatedDiv: React.FC<{
  children: React.ReactNode;
  animation?: string;
  delay?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}> = ({
  children,
  animation = 'fade-in',
  delay = 0,
  duration = 300,
  className = '',
  style = {},
  onClick,
}) => {
  return (
    <div
      className={`animate-${animation} ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// FloatingElement component with floating animation
export const FloatingElement: React.FC<{
  children: React.ReactNode;
  intensity?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, intensity = 1, duration = 2000, className = '', style = {} }) => {
  // Use useState + useEffect to generate random delay only once per component instance
  const [randomDelay] = React.useState(() => Math.random() * 1000);

  return (
    <div
      className={`animate-float ${className}`}
      style={{
        animationDuration: `${duration}ms`,
        animationDelay: `${randomDelay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// StaggeredContainer component for staggered animations
export const StaggeredContainer: React.FC<{
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, staggerDelay = 100, className = '', style = {} }) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <div className={className} style={style}>
      {childrenArray.map((child, index) => (
        <AnimatedDiv key={index} delay={index * staggerDelay}>
          {child}
        </AnimatedDiv>
      ))}
    </div>
  );
};

// Animation keyframes (to be added to CSS)
export const animationKeyframes = `
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-fade-in {
  animation: fade-in ease-out forwards;
}

.animate-fadeInUp {
  animation: fadeInUp ease-out forwards;
}

.animate-float {
  animation: float ease-in-out infinite;
}
`;
