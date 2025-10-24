// Custom Image Loader for PrepFlow
// Implements advanced image optimization with WebP/AVIF conversion

import { ImageLoaderProps } from 'next/image';

// Image optimization configuration
const IMAGE_CONFIG = {
  // Quality settings for different image types
  quality: {
    hero: 90, // High quality for hero images
    content: 85, // Medium quality for content images
    thumbnail: 75, // Lower quality for thumbnails
    icon: 100, // Maximum quality for icons
  },

  // Supported formats (in order of preference)
  formats: ['avif', 'webp', 'jpeg'],

  // Base URL for optimized images
  baseUrl: process.env.NODE_ENV === 'production' ? 'https://prepflow.org' : 'http://localhost:3000',
};

// Detect image type from source path
function getImageType(src: string): 'hero' | 'content' | 'thumbnail' | 'icon' {
  if (src.includes('hero') || src.includes('dashboard-screenshot')) return 'hero';
  if (src.includes('icon') || src.includes('favicon')) return 'icon';
  if (
    src.includes('thumbnail') ||
    src.includes('settings-screenshot') ||
    src.includes('recipe-screenshot') ||
    src.includes('stocklist-screenshot')
  )
    return 'thumbnail';
  return 'content';
}

// Generate optimized image URL
export default function customImageLoader({ src, width, quality }: ImageLoaderProps): string {
  // For external images, use Next.js default loader
  if (src.startsWith('http')) {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 85}`;
  }

  // For local images, use custom optimization
  const imageType = getImageType(src);
  const optimizedQuality = quality || IMAGE_CONFIG.quality[imageType];

  // Generate responsive image URL with format optimization
  const params = new URLSearchParams({
    url: src,
    w: width.toString(),
    q: optimizedQuality.toString(),
    f: 'auto', // Auto format selection (AVIF/WebP/JPEG)
  });

  return `/_next/image?${params.toString()}`;
}

// Generate responsive image srcset
export function generateImageSrcSet(
  src: string,
  widths: number[] = [640, 750, 828, 1080, 1200, 1920],
): string {
  const imageType = getImageType(src);
  const quality = IMAGE_CONFIG.quality[imageType];

  return widths.map(width => `${customImageLoader({ src, width, quality })} ${width}w`).join(', ');
}

// Generate responsive image sizes
export function generateImageSizes(imageType: string): string {
  switch (imageType) {
    case 'hero':
      return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw';
    case 'content':
      return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
    case 'thumbnail':
      return '(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw';
    case 'icon':
      return '64px';
    default:
      return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
  }
}

// Preload critical images
export function preloadCriticalImages(): void {
  if (typeof window === 'undefined') return;

  const criticalImages = [
    { src: '/images/dashboard-screenshot.png', type: 'hero' },
    { src: '/images/prepflow-logo.png', type: 'icon' },
  ];

  criticalImages.forEach(({ src, type }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = customImageLoader({
      src,
      width: 800,
      quality: IMAGE_CONFIG.quality[type as keyof typeof IMAGE_CONFIG.quality],
    });

    // Add responsive hints
    const sizes = generateImageSizes(type);
    link.setAttribute('imagesizes', sizes);

    document.head.appendChild(link);
  });
}

// Lazy load non-critical images
export function lazyLoadImages(): void {
  if (typeof window === 'undefined') return;

  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src || '';
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

// Optimize images based on connection type
export function optimizeImagesForConnection(connectionType: string): void {
  if (typeof window === 'undefined') return;

  switch (connectionType) {
    case 'slow-2g':
    case '2g':
      // Load only critical images
      preloadCriticalImages();
      break;
    case '3g':
      // Load critical images + some non-critical
      preloadCriticalImages();
      setTimeout(() => {
        lazyLoadImages();
      }, 1000);
      break;
    case '4g':
    case '5g':
    default:
      // Load all images
      preloadCriticalImages();
      lazyLoadImages();
      break;
  }
}
