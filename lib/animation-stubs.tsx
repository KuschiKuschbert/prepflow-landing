/**
 * Stub components for AnimatedComponents.tsx compatibility
 * These are placeholder exports to prevent TypeScript errors
 */

import React from 'react';

interface AnimatedDivProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  animation?: string;
  delay?: number;
  intensity?: number;
}

export const AnimatedDiv = ({
  children,
  animation: _animation,
  delay: _delay,
  ...props
}: AnimatedDivProps) => React.createElement('div', props, children);
export const FloatingElement = ({ children, intensity: _intensity, ...props }: AnimatedDivProps) =>
  React.createElement('div', props, children);
export const StaggeredContainer = ({ children, ...props }: AnimatedDivProps) =>
  React.createElement('div', props, children);
