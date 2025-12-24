'use client';

/**
 * ImageLightbox Component
 *
 * Full-screen image viewer modal for displaying food images.
 * Supports keyboard navigation, backdrop click to close, and Material Design 3 styling.
 *
 * @component
 * @param {ImageLightboxProps} props - Component props
 * @returns {JSX.Element | null} Rendered component or null if not open
 */

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

interface ImageLightboxProps {
  isOpen: boolean;
  imageUrl: string | null;
  alt: string;
  onClose: () => void;
  platingMethod?: string;
}

export function ImageLightbox({
  isOpen,
  imageUrl,
  alt,
  onClose,
  platingMethod,
}: ImageLightboxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Handle Escape key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap: Keep focus within modal
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    firstElement?.focus();

    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // Reset loading state when image changes
  useEffect(() => {
    if (imageUrl) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [imageUrl]);

  if (!isOpen || !imageUrl) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking the backdrop itself, not the image container
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      aria-describedby="lightbox-description"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-[var(--foreground)] backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-black/80 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none"
        aria-label="Close image viewer"
      >
        <Icon icon={X} size="md" aria-hidden={true} />
      </button>

      {/* Image Container */}
      <div className="relative max-h-[90vh] max-w-[90vw] p-4">
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-black/60 px-6 py-4 backdrop-blur-sm">
              <Icon
                icon={Loader2}
                size="xl"
                className="animate-spin text-[var(--primary)]"
                aria-hidden={true}
              />
              <p className="text-sm font-medium text-[var(--foreground)]">Loading image...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="flex min-h-[400px] min-w-[400px] items-center justify-center rounded-3xl border border-[var(--color-error)]/20 bg-[var(--color-error)]/10 p-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <Icon
                icon={AlertCircle}
                size="xl"
                className="text-[var(--color-error)]"
                aria-hidden={true}
              />
              <p className="text-sm font-medium text-[var(--color-error)]">Failed to load image</p>
              <p className="text-xs text-red-300/80">The image URL may be invalid or expired</p>
            </div>
          </div>
        )}

        {/* Image */}
        {!hasError && (
          <div
            ref={imageRef as React.RefObject<HTMLDivElement>}
            className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {imageUrl.startsWith('data:') ? (
              // Next.js Image component doesn't support data URLs (base64), so we use native img tag
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt={alt}
                className={`max-h-[90vh] max-w-[90vw] object-contain transition-opacity duration-300 ${
                  isLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            ) : (
              <div className="relative max-h-[90vh] max-w-[90vw]">
                <Image
                  src={imageUrl}
                  alt={alt}
                  width={1200}
                  height={800}
                  className={`object-contain transition-opacity duration-300 ${
                    isLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  style={{ maxHeight: '90vh', maxWidth: '90vw', height: 'auto', width: 'auto' }}
                  priority
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </div>
            )}

            {/* Plating Method Label */}
            {platingMethod && (
              <div className="absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-medium text-[var(--foreground)] backdrop-blur-sm">
                {platingMethod} Plating
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
