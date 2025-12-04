'use client';

// Food image display component with multi-plating support
// HMR fix: Using direct lucide-react imports instead of Icon wrapper to avoid Turbopack module resolution issues
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ImageIcon, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { ImageLightbox } from './ImageLightbox';

// All supported plating methods
export type PlatingMethod =
  | 'classic'
  | 'modern'
  | 'rustic'
  | 'minimalist'
  | 'landscape'
  | 'futuristic'
  | 'hide_and_seek'
  | 'super_bowl'
  | 'bathing'
  | 'deconstructed'
  | 'stacking'
  | 'brush_stroke'
  | 'free_form';

interface FoodImageDisplayProps {
  imageUrl?: string | null; // Classic/primary
  imageUrlAlternative?: string | null; // Rustic
  imageUrlModern?: string | null; // Modern
  imageUrlMinimalist?: string | null; // Minimalist
  platingMethodsImages?: Record<string, string | null>; // Additional plating methods from JSON column
  alt: string;
  className?: string;
  priority?: boolean;
  showSelector?: boolean;
  onImageLoad?: () => void;
}

/**
 * FoodImageDisplay Component
 *
 * Displays food images with support for multiple plating methods:
 * - Classic, Modern, Rustic, Minimalist (from dedicated columns)
 * - Landscape, Futuristic, Hide and Seek, Super Bowl, Bathing, Deconstructed, Stacking, Brush Stroke, Free Form (from JSON column)
 *
 * Includes dropdown selector to switch between plating methods, click-to-view lightbox, and proper loading/error states.
 *
 * @component
 * @param {FoodImageDisplayProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export function FoodImageDisplay({
  imageUrl,
  imageUrlAlternative,
  imageUrlModern,
  imageUrlMinimalist,
  platingMethodsImages,
  alt,
  className = '',
  priority = false,
  showSelector = true,
  onImageLoad,
}: FoodImageDisplayProps) {
  const [selectedPlating, setSelectedPlating] = useState<PlatingMethod>('classic');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Validate base64 string format
   * @param str - String to validate
   * @returns true if valid base64, false otherwise
   */
  const isValidBase64 = (str: string): boolean => {
    if (!str || str.length === 0) return false;
    // Base64 regex: allows A-Z, a-z, 0-9, +, /, = (padding)
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    return base64Regex.test(str);
  };

  /**
   * Normalize image URL - handles both old JSON format and new string format
   * @param url - Image URL (may be a JSON string or a regular string)
   * @returns Normalized image URL string or null
   */
  const normalizeImageUrl = (url: string | null | undefined): string | null => {
    if (!url || typeof url !== 'string') return null;

    // If it's already a valid URL string (starts with http://, https://, or data:), return as-is
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      // For data URLs, validate the base64 portion
      if (url.startsWith('data:')) {
        const match = url.match(/^data:([^;]+);base64,(.+)$/);
        if (match && isValidBase64(match[2])) {
          return url;
        }
        // Invalid base64 in data URL - return null to prevent ERR_INVALID_URL
        return null;
      }
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
        // If it's an object with imageData, construct data URL (with validation)
        if (parsed.imageData && typeof parsed.imageData === 'string') {
          // Validate base64 before constructing data URL
          if (!isValidBase64(parsed.imageData)) {
            return null; // Invalid base64 - return null to prevent ERR_INVALID_URL
          }
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

  // Normalize all image URLs
  const normalizedImageUrl = normalizeImageUrl(imageUrl); // Classic
  const normalizedImageUrlModern = normalizeImageUrl(imageUrlModern); // Modern
  const normalizedImageUrlAlternative = normalizeImageUrl(imageUrlAlternative); // Rustic
  const normalizedImageUrlMinimalist = normalizeImageUrl(imageUrlMinimalist); // Minimalist

  // Normalize additional plating methods from JSON column
  const normalizedPlatingMethodsImages: Record<string, string | null> = {};
  if (platingMethodsImages) {
    for (const [method, url] of Object.entries(platingMethodsImages)) {
      normalizedPlatingMethodsImages[method] = normalizeImageUrl(url);
    }
  }

  // Map all plating methods to their URLs
  const imageMap: Record<string, string | null> = {
    classic: normalizedImageUrl,
    modern: normalizedImageUrlModern,
    rustic: normalizedImageUrlAlternative,
    minimalist: normalizedImageUrlMinimalist,
    ...normalizedPlatingMethodsImages,
  };

  // Get available plating methods (those with images)
  const availablePlatingMethods = (Object.keys(imageMap) as PlatingMethod[]).filter(
    method => !!imageMap[method],
  );

  // Determine which image to show based on selected plating method
  const currentImageUrl = imageMap[selectedPlating] || null;
  const hasAnyImage = availablePlatingMethods.length > 0;

  // Auto-select first available plating method if current selection has no image
  useEffect(() => {
    if (!currentImageUrl && availablePlatingMethods.length > 0) {
      setSelectedPlating(availablePlatingMethods[0] as PlatingMethod);
    }
  }, [currentImageUrl, availablePlatingMethods]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  // Plating method display names
  const platingMethodLabels: Record<string, string> = {
    classic: 'Classic',
    modern: 'Modern',
    rustic: 'Rustic',
    minimalist: 'Minimalist',
    landscape: 'Landscape',
    futuristic: 'Futuristic',
    hide_and_seek: 'Hide and Seek',
    super_bowl: 'Super Bowl',
    bathing: 'Bathing',
    deconstructed: 'Deconstructed',
    stacking: 'Stacking',
    brush_stroke: 'Brush Stroke',
    free_form: 'Free Form',
  };

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

  // Handle image click to open lightbox
  const handleImageClick = (e: React.MouseEvent) => {
    // Don't open lightbox if clicking on the dropdown selector
    if ((e.target as HTMLElement).closest('[data-plating-selector]')) {
      return;
    }
    if (currentImageUrl) {
      setIsLightboxOpen(true);
    }
  };

  // If no images available, show placeholder
  if (!hasAnyImage) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] ${className}`}
        style={{ minHeight: '200px' }}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <ImageIcon className="h-8 w-8 text-gray-500" aria-hidden={true} />
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
          <ImageIcon className="h-8 w-8 text-red-400" aria-hidden={true} />
          <p className="text-sm text-red-400">Failed to load image</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] ${className}`}
      >
        {/* Image Container - Clickable */}
        <div
          className="relative aspect-video w-full cursor-pointer bg-[#0a0a0a] transition-all duration-200 hover:opacity-90"
          onClick={handleImageClick}
          role="button"
          tabIndex={0}
          aria-label="Click to view full-size image"
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleImageClick(e as any);
            }
          }}
        >
          {isLoading && (
            <div className="absolute inset-0 z-10">
              <LoadingSkeleton variant="card" className="h-full w-full" />
            </div>
          )}

          {currentImageUrl &&
            typeof currentImageUrl === 'string' &&
            // Use regular img tag for data URLs (base64), Next.js Image for external URLs
            (currentImageUrl.startsWith('data:') ? (
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
            ))}

          {/* Plating Method Selector - Only show if multiple images exist */}
          {availablePlatingMethods.length > 1 && showSelector && (
            <div ref={dropdownRef} data-plating-selector className="absolute right-4 bottom-4 z-20">
              <button
                onClick={e => {
                  e.stopPropagation();
                  setIsDropdownOpen(!isDropdownOpen);
                }}
                className="flex items-center gap-2 rounded-xl bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all duration-200 hover:bg-black/80 hover:shadow-lg"
                aria-label="Select plating method"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <span>{platingMethodLabels[selectedPlating] || selectedPlating}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  aria-hidden={true}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 bottom-full mb-2 max-h-[300px] min-w-[160px] overflow-y-auto rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-lg">
                  {availablePlatingMethods.map(method => (
                    <button
                      key={method}
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedPlating(method as PlatingMethod);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors first:rounded-t-xl last:rounded-b-xl ${
                        selectedPlating === method
                          ? 'bg-[#29E7CD]/10 text-[#29E7CD]'
                          : 'text-white hover:bg-[#2a2a2a]'
                      }`}
                    >
                      {platingMethodLabels[method] || method}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Plating Method Badge */}
          {hasAnyImage && (
            <div className="absolute top-4 left-4 z-20 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
              {platingMethodLabels[selectedPlating] || selectedPlating} Plating
            </div>
          )}
        </div>
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        isOpen={isLightboxOpen}
        imageUrl={currentImageUrl}
        alt={alt}
        onClose={() => setIsLightboxOpen(false)}
        platingMethod={platingMethodLabels[selectedPlating] || selectedPlating}
      />
    </>
  );
}
