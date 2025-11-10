import Image, { ImageProps } from 'next/image';
import { useState, type CSSProperties } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  alt: string;
  fallback?: string;
  priority?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  fallback,
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  // Convert PNG/JPG to optimized formats
  const getOptimizedSrc = (originalSrc: string) => {
    if (
      originalSrc.includes('.png') ||
      originalSrc.includes('.jpg') ||
      originalSrc.includes('.jpeg')
    ) {
      // Try AVIF first (best compression), then WebP, then original
      const basePath = originalSrc.replace(/\.(png|jpg|jpeg)$/i, '');
      return {
        avif: `${basePath}.avif`,
        webp: `${basePath}.webp`,
        original: originalSrc,
      };
    }
    return { original: originalSrc };
  };

  const handleError = () => {
    const optimized = getOptimizedSrc(src);

    if (imgSrc === optimized.avif) {
      // Try WebP if AVIF fails
      setImgSrc(optimized.webp);
    } else if (imgSrc === optimized.webp) {
      // Fall back to original if WebP fails
      setImgSrc(optimized.original);
    } else if (fallback) {
      // Use custom fallback
      setImgSrc(fallback);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Start with the best format available
  const optimized = getOptimizedSrc(src);
  const initialSrc = optimized.avif || optimized.webp || optimized.original;

  const { style: incomingStyle, ...restProps } = props;

  const combinedStyle: CSSProperties = {
    opacity: isLoading ? 0 : 1,
    transition: 'opacity 0.3s ease-in-out',
    ...incomingStyle,
  };

  return (
    <div className="relative">
      {isLoading && (
        <div
          className="absolute inset-0 animate-pulse rounded bg-gray-200"
          style={{
            width: props.width,
            height: props.height,
            minHeight: props.height || 'auto',
          }}
        />
      )}
      <Image
        src={imgSrc}
        alt={alt}
        priority={priority}
        onError={handleError}
        onLoad={handleLoad}
        style={combinedStyle}
        {...restProps}
      />
    </div>
  );
}
