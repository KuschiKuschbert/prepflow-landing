import { useEffect, RefObject } from 'react';

interface UseQRCodeModalEffectsProps {
  isOpen: boolean;
  onClose: () => void;
  modalRef: RefObject<HTMLDivElement | null>;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
}

export function useQRCodeModalEffects({
  isOpen,
  onClose,
  modalRef,
  closeButtonRef,
}: UseQRCodeModalEffectsProps) {
  // Focus management and viewport positioning
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;

      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      // Focus the close button when modal opens (after a brief delay for animation)
      const focusTimeout = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 150);

      // Scroll to top of modal if needed
      if (modalRef.current) {
        modalRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      return () => {
        clearTimeout(focusTimeout);
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isOpen, modalRef, closeButtonRef]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);
}
