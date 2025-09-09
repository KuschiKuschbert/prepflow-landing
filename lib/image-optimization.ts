// Advanced Image Optimization Pipeline for PrepFlow
// Implements WebP/AVIF conversion, responsive sizing, and performance optimization

import { ImageLoader } from 'next/image';

// Image optimization configuration
export const IMAGE_CONFIG = {
  // Quality settings for different image types
  quality: {
    hero: 90,        // High quality for hero images
    content: 85,     // Medium quality for content images
    thumbnail: 75,   // Lower quality for thumbnails
    icon: 100,       // Maximum quality for icons
  },
  
  // Responsive breakpoints (matching Tailwind CSS)
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
  
  // Device pixel ratios
  devicePixelRatios: [1, 2, 3],
  
  // Supported formats (in order of preference)
  formats: ['avif', 'webp', 'jpeg', 'png'],
  
  // Sizes for different image types
  sizes: {
    hero: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw',
    content: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    thumbnail: '(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw',
    icon: '64px',
    logo: '200px',
  },
  
  // Blur data URLs for different aspect ratios
  blurDataURLs: {
    '16:9': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
    '4:3': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
    '1:1': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
  },
};

// Image type detection
export function getImageType(src: string): 'hero' | 'content' | 'thumbnail' | 'icon' | 'logo' {
  if (src.includes('hero') || src.includes('dashboard-screenshot')) return 'hero';
  if (src.includes('icon') || src.includes('favicon')) return 'icon';
  if (src.includes('logo')) return 'logo';
  if (src.includes('thumbnail') || src.includes('settings-screenshot') || src.includes('recipe-screenshot') || src.includes('stocklist-screenshot')) return 'thumbnail';
  return 'content';
}

// Aspect ratio calculation
export function getAspectRatio(width: number, height: number): string {
  const ratio = width / height;
  if (Math.abs(ratio - 16/9) < 0.1) return '16:9';
  if (Math.abs(ratio - 4/3) < 0.1) return '4:3';
  if (Math.abs(ratio - 1) < 0.1) return '1:1';
  return 'custom';
}

// Generate responsive sizes for different image types
export function generateResponsiveSizes(imageType: string, baseWidth: number, baseHeight: number): string {
  const aspectRatio = getAspectRatio(baseWidth, baseHeight);
  
  switch (imageType) {
    case 'hero':
      return IMAGE_CONFIG.sizes.hero;
    case 'content':
      return IMAGE_CONFIG.sizes.content;
    case 'thumbnail':
      return IMAGE_CONFIG.sizes.thumbnail;
    case 'icon':
      return IMAGE_CONFIG.sizes.icon;
    case 'logo':
      return IMAGE_CONFIG.sizes.logo;
    default:
      return IMAGE_CONFIG.sizes.content;
  }
}

// Generate blur data URL based on aspect ratio
export function getBlurDataURL(aspectRatio: string): string {
  return IMAGE_CONFIG.blurDataURLs[aspectRatio as keyof typeof IMAGE_CONFIG.blurDataURLs] || IMAGE_CONFIG.blurDataURLs['16:9'];
}

// Custom image loader for optimized delivery
export const customImageLoader: ImageLoader = ({ src, width, quality = 85 }) => {
  // For external images, use Next.js default loader
  if (src.startsWith('http')) {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
  }
  
  // For local images, use optimized loader
  const imageType = getImageType(src);
  const optimizedQuality = IMAGE_CONFIG.quality[imageType as keyof typeof IMAGE_CONFIG.quality] || IMAGE_CONFIG.quality.content;
  
  // Generate responsive image URL with format optimization
  const params = new URLSearchParams({
    url: src,
    w: width.toString(),
    q: optimizedQuality.toString(),
    f: 'auto', // Auto format selection (AVIF/WebP/JPEG)
  });
  
  return `/_next/image?${params.toString()}`;
};

// Image optimization utilities
export class ImageOptimizer {
  private static instance: ImageOptimizer;
  private cache = new Map<string, string>();
  
  static getInstance(): ImageOptimizer {
    if (!ImageOptimizer.instance) {
      ImageOptimizer.instance = new ImageOptimizer();
    }
    return ImageOptimizer.instance;
  }
  
  // Preload critical images
  preloadImage(src: string, imageType: string = 'content'): void {
    if (typeof window === 'undefined') return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = customImageLoader({ src, width: 800, quality: IMAGE_CONFIG.quality[imageType as keyof typeof IMAGE_CONFIG.quality] });
    
    // Add responsive hints
    const sizes = generateResponsiveSizes(imageType, 800, 600);
    link.setAttribute('imagesizes', sizes);
    
    document.head.appendChild(link);
  }
  
  // Lazy load non-critical images
  lazyLoadImage(src: string, callback: (src: string) => void): void {
    if (typeof window === 'undefined') return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(src);
          observer.unobserve(entry.target);
        }
      });
    });
    
    // Create a placeholder element
    const placeholder = document.createElement('div');
    placeholder.style.width = '100%';
    placeholder.style.height = '200px';
    placeholder.style.backgroundColor = '#1f1f1f';
    placeholder.style.borderRadius = '8px';
    
    observer.observe(placeholder);
  }
  
  // Generate optimized image props
  generateImageProps(
    src: string,
    alt: string,
    width: number,
    height: number,
    priority: boolean = false,
    className: string = ''
  ) {
    const imageType = getImageType(src);
    const aspectRatio = getAspectRatio(width, height);
    const sizes = generateResponsiveSizes(imageType, width, height);
    const blurDataURL = getBlurDataURL(aspectRatio);
    const quality = IMAGE_CONFIG.quality[imageType as keyof typeof IMAGE_CONFIG.quality] || IMAGE_CONFIG.quality.content;
    
    return {
      src,
      alt,
      width,
      height,
      priority,
      className,
      sizes,
      quality,
      placeholder: 'blur',
      blurDataURL,
      loader: customImageLoader,
    };
  }
  
  // Batch preload images
  preloadImages(images: Array<{ src: string; type: string }>): void {
    images.forEach(({ src, type }) => {
      this.preloadImage(src, type);
    });
  }
  
  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const imageOptimizer = ImageOptimizer.getInstance();

// Performance monitoring for images
export function trackImagePerformance(src: string, loadTime: number, size: number): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'image_load', {
      event_category: 'performance',
      event_label: 'image_optimization',
      value: Math.round(loadTime),
      custom_parameter_image_src: src,
      custom_parameter_load_time: Math.round(loadTime),
      custom_parameter_image_size: size,
    });
  }
}

// Image format detection
export function detectImageFormat(src: string): 'avif' | 'webp' | 'jpeg' | 'png' | 'svg' | 'unknown' {
  const extension = src.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'avif': return 'avif';
    case 'webp': return 'webp';
    case 'jpg':
    case 'jpeg': return 'jpeg';
    case 'png': return 'png';
    case 'svg': return 'svg';
    default: return 'unknown';
  }
}

// Generate responsive image srcset
export function generateSrcSet(src: string, widths: number[] = [640, 750, 828, 1080, 1200, 1920]): string {
  const imageType = getImageType(src);
  const quality = IMAGE_CONFIG.quality[imageType as keyof typeof IMAGE_CONFIG.quality] || IMAGE_CONFIG.quality.content;
  
  return widths
    .map(width => `${customImageLoader({ src, width, quality })} ${width}w`)
    .join(', ');
}
