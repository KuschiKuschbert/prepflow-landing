'use client';

import { Icon } from '@/components/ui/Icon';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ImageIcon, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface FoodImageDisplayProps {
  imageUrl?: string | null;
  imageUrlAlternative?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  showToggle?: boolean;
  onImageLoad?: () => void;
}

/**
 * FoodImageDisplay Component
 *
 * Displays food images with support for primary and alternative plating styles.
 * Includes toggle to switch between images and proper loading/error states.
 *
 * @component
 * @param {FoodImageDisplayProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export function FoodImageDisplay({
  imageUrl,
  imageUrlAlternative,
  alt,
  className = '',
  priority = false,
  showToggle = true,
  onImageLoad,
}: FoodImageDisplayProps) {
  const [showAlternative, setShowAlternative] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  /**
   * Normalize image URL - handles both old JSON format and new string format
   * @param url - Image URL (may be a JSON string or a regular string)
   * @returns Normalized image URL string or null
   */
  const normalizeImageUrl = (url: string | null | undefined): string | null => {
    if (!url || typeof url !== 'string') return null;

    // If it's already a valid URL string (starts with http://, https://, or data:), return as-is
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }

    // Try to parse as JSON (handles old format where entire object was stored)
    try {
      const parsed = JSON.parse(url);
      if (typeof parsed === 'object' && parsed !== null) {
        // If it's an object with imageUrl property, use that
        if (parsed.imageUrl && typeof parsed.imageUrl === 'string') {
          return parsed.imageUrl;
        }
        // If it's an object with imageData, construct data URL
        if (parsed.imageData && typeof parsed.imageData === 'string') {
          const mimeType = parsed.mimeType || 'image/jpeg';
          return `data:${mimeType};base64,${parsed.imageData}`;
        }
      }
    } catch {
      // Not JSON, treat as regular string
    }

    // If it doesn't match any pattern, return null
    return null;
  };

  // Normalize image URLs
  const normalizedImageUrl = normalizeImageUrl(imageUrl);
  const normalizedImageUrlAlternative = normalizeImageUrl(imageUrlAlternative);

  // Determine which image to show
  const currentImageUrl = showAlternative ? normalizedImageUrlAlternative : normalizedImageUrl;
  const hasBothImages = !!(normalizedImageUrl && normalizedImageUrlAlternative);
  const hasAnyImage = !!(normalizedImageUrl || normalizedImageUrlAlternative);

  // Handle image load
  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onImageLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // If no images available, show placeholder
  if (!hasAnyImage) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] ${className}`}
        style={{ minHeight: '200px' }}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <Icon icon={ImageIcon} size="xl" className="text-gray-500" aria-hidden={true} />
          <p className="text-sm text-gray-400">No image available</p>
        </div>
      </div>
    );
  }

  // If error loading image, show error state
  if (hasError && currentImageUrl) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 ${className}`}
        style={{ minHeight: '200px' }}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <Icon icon={ImageIcon} size="xl" className="text-red-400" aria-hidden={true} />
          <p className="text-sm text-red-400">Failed to load image</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] ${className}`}>
      {/* Image Container */}
      <div className="relative aspect-video w-full bg-[#0a0a0a]">
        {isLoading && (
          <div className="absolute inset-0 z-10">
            <LoadingSkeleton variant="card" className="h-full w-full" />
          </div>
        )}

        {currentImageUrl && typeof currentImageUrl === 'string' && (
          // Use regular img tag for data URLs (base64), Next.js Image for external URLs
          currentImageUrl.startsWith('data:') ? (
            <img
              src={currentImageUrl}
              alt={alt}
              className={`h-full w-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={handleLoad}
              onError={handleError}
            />
          ) : (
            <Image
              src={currentImageUrl}
              alt={alt}
              fill
              className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              priority={priority}
              onLoad={handleLoad}
              onError={handleError}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )
        )}

        {/* Toggle Button - Only show if both images exist */}
        {hasBothImages && showToggle && (
          <button
            onClick={() => setShowAlternative(!showAlternative)}
            className="absolute bottom-4 right-4 z-20 flex items-center gap-2 rounded-xl bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all duration-200 hover:bg-black/80 hover:shadow-lg"
            aria-label={showAlternative ? 'Show primary plating style' : 'Show alternative plating style'}
            title={showAlternative ? 'Show primary plating style' : 'Show alternative plating style'}
          >
            <Icon icon={RotateCcw} size="sm" aria-hidden={true} />
            <span>{showAlternative ? 'Primary View' : 'Alternative View'}</span>
          </button>
        )}

        {/* Style Indicator Badge */}
        {hasBothImages && (
          <div className="absolute top-4 left-4 z-20 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            {showAlternative ? 'Alternative Plating' : 'Primary Plating'}
          </div>
        )}
      </div>
    </div>
  );
}
