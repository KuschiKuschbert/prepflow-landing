'use client';

import {
  motion,
  TargetAndTransition,
  useMotionValue,
  useSpring,
  useTransform,
  VariantLabels,
} from 'framer-motion';
import { ReactNode, useEffect, useRef, useState } from 'react';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  /**
   * Magnetic strength (0-1). Higher values = stronger pull
   */
  strength?: number;
  /**
   * Maximum distance in pixels the button can move
   */
  maxDistance?: number;
  /**
   * Whether to scale on hover
   */
  scaleOnHover?: boolean;
  /**
   * Scale value on hover (default: 1.05)
   */
  hoverScale?: number;
  /**
   * Standard button props
   */
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  /**
   * Accessibility label
   */
  'aria-label'?: string;
  /**
   * Additional motion props
   */
  whileHover?: VariantLabels | TargetAndTransition;
  whileTap?: VariantLabels | TargetAndTransition;
}

/**
 * MagneticButton component that follows mouse cursor with smooth spring animation
 * Creates an engaging, interactive button experience
 */
export function MagneticButton({
  children,
  className = '',
  strength = 0.3,
  maxDistance = 20,
  scaleOnHover = true,
  hoverScale = 1.05,
  onClick,
  type = 'button',
  disabled = false,
  'aria-label': ariaLabel,
  whileHover,
  whileTap,
}: MagneticButtonProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animations
  const springConfig = { damping: 15, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Transform to limit movement distance
  const translateX = useTransform(x, value =>
    Math.max(-maxDistance, Math.min(maxDistance, value * strength)),
  );
  const translateY = useTransform(y, value =>
    Math.max(-maxDistance, Math.min(maxDistance, value * strength)),
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || !isHovering || disabled) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    mouseX.set(deltaX);
    mouseY.set(deltaY);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  // Don't render magnetic effect on server
  if (!isMounted) {
    return (
      <motion.button
        ref={buttonRef}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={className}
        aria-label={ariaLabel}
        whileHover={scaleOnHover ? { scale: hoverScale } : whileHover}
        whileTap={whileTap || { scale: 0.95 }}
      >
        {children}
      </motion.button>
    );
  }

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      aria-label={ariaLabel}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        x: translateX,
        y: translateY,
      }}
      whileHover={
        scaleOnHover && !disabled
          ? {
              scale: hoverScale,
              ...(typeof whileHover === 'object' ? whileHover : {}),
            }
          : whileHover
      }
      whileTap={whileTap || { scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 15,
      }}
    >
      {children}
    </motion.button>
  );
}
