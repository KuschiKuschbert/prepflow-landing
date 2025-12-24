import { useEffect } from 'react';

export function usePopoverCloseHandlers(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => {
      onClose();
    };

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('wheel', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('wheel', handleScroll);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-ingredient-popover]')) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
}
