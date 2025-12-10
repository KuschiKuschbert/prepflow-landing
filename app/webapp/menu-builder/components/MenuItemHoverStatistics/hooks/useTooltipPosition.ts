import { useEffect, useRef, useState } from 'react';

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

    const getPositionFromAnchor = (): { x: number; y: number } | null => {
      if (!anchorElement) return null;
      const rect = anchorElement.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    };

    let currentPos = mousePosition;
    const updatePosition = (pos?: { x: number; y: number }) => {
      let position = pos || currentPos || mousePosition;

      if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') {
        const anchorPos = getPositionFromAnchor();
        position = anchorPos || undefined;
      }

      if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') {
        return;
      }

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

      let left = position.x - tooltipWidth - offset;

      if (left + tooltipWidth > buttonsAreaRight - padding) {
        left = buttonsAreaRight - tooltipWidth - offset - padding;
      }

      if (left < padding) {
        left = position.x + offset;
        if (left + tooltipWidth > buttonsAreaRight - padding) {
          left = buttonsAreaRight - tooltipWidth - offset - padding;
        }
      }

      if (left + tooltipWidth > viewportWidth - padding) {
        left = viewportWidth - tooltipWidth - padding;
      }
      if (left < padding) left = padding;

      let top = position.y - tooltipHeight / 2;
      if (top < padding) top = position.y + offset;
      if (top + tooltipHeight > viewportHeight - padding) {
        top = position.y - tooltipHeight - offset;
        if (top < padding) top = padding;
      }

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



