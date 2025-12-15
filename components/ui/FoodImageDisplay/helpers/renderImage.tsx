/**
 * Render image component (either img tag or Next.js Image).
 */
import Image from 'next/image';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

export function renderImageComponent(
  currentImageUrl: string | null,
  alt: string,
  isLoading: boolean,
  priority: boolean,
  handleLoad: () => void,
  handleError: () => void,
) {
  if (!currentImageUrl) return null;
  if (currentImageUrl.startsWith('data:')) {
    return (
      <img
        src={currentImageUrl}
        alt={alt}
        className={`h-full w-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={handleLoad}
        onError={handleError}
      />
    );
  }
  return (
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
  );
}
