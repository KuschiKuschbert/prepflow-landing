import { useEffect, useRef, useState } from 'react';
import { calculateTooltipPosition } from './useTooltipPosition/helpers/calculateTooltipPosition';
import { resolvePosition } from './useTooltipPosition/helpers/resolvePosition';

interface UseTooltipPositionProps {
  isVisible: boolean;
  mousePosition?: { x: number; y: number };
  anchorElement?: HTMLElement | null;
}

/**
 * Hook for calculating and updating tooltip position
 */
export function useTooltipPosition({
  isVisible,
  mousePosition,
  anchorElement,
}: UseTooltipPositionProps) {
  const [tooltipPosition, setTooltipPosition] = useState<{
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  }>({});
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) {
      setTooltipPosition({});
      return;
    }

    let currentPos = mousePosition;
    const updatePosition = (pos?: { x: number; y: number }) => {
      const position = resolvePosition(pos || currentPos, anchorElement);
      if (!position) return;

      const tooltipWidth = 256;
      const tooltipHeight = tooltipRef.current?.offsetHeight || 200;
      const padding = 8;
      const offset = 12;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      let buttonsAreaRight = viewportWidth;
      if (anchorElement) {
        const rect = anchorElement.getBoundingClientRect();
        buttonsAreaRight = rect.right - 120;
      }

      const { left, top } = calculateTooltipPosition({
        position,
        tooltipWidth,
        tooltipHeight,
        viewportWidth,
        viewportHeight,
        buttonsAreaRight,
        padding,
        offset,
      });

      setTooltipPosition({ left, top });
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      currentPos = { x: e.clientX, y: e.clientY };
      updatePosition(currentPos);
    };

    if (mousePosition) {
      updatePosition(mousePosition);
    } else {
      updatePosition();
    }

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('resize', () => updatePosition());
    window.addEventListener('scroll', () => updatePosition(), true);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('resize', () => updatePosition());
      window.removeEventListener('scroll', () => updatePosition(), true);
    };
  }, [isVisible, mousePosition, anchorElement]);

  return { tooltipPosition, tooltipRef };
}
