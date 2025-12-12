import { useEffect, useState } from 'react';

export function usePopoverPosition(
  isOpen: boolean,
  mousePosition: { x: number; y: number } | null,
) {
  const [popoverPosition, setPopoverPosition] = useState<{ left: number; top: number } | null>(
    null,
  );

  useEffect(() => {
    if (!isOpen || !mousePosition) {
      setPopoverPosition(null);
      return;
    }

    const updatePosition = () => {
      if (!mousePosition) return;

      const popoverWidth = 400;
      const maxHeight = 500;
      const offset = 12;

      let left = mousePosition.x + offset;
      let top = mousePosition.y + offset;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (left + popoverWidth > viewportWidth - 16) {
        left = mousePosition.x - popoverWidth - offset;
        if (left < 16) {
          left = 16;
        }
      } else if (left < 16) {
        left = 16;
      }

      if (top + maxHeight > viewportHeight - 16) {
        top = mousePosition.y - maxHeight - offset;
        if (top < 16) {
          top = 16;
        }
      } else if (top < 16) {
        top = 16;
      }

      setPopoverPosition({ left, top });
    };

    updatePosition();

    const handleMouseMove = () => {
      updatePosition();
    };

    if (isOpen) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [isOpen, mousePosition]);

  return popoverPosition;
}




