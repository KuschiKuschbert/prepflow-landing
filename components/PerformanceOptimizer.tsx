'use client';

import { useEffect } from 'react';

interface PerformanceOptimizerProps {
  enabled?: boolean;
}

export default function PerformanceOptimizer({ enabled = true }: PerformanceOptimizerProps) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload critical fonts
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Geist+Sans:wght@400;500;600;700&display=swap';
      fontLink.as = 'style';
      document.head.appendChild(fontLink);

      // Preload critical images
      const criticalImages = [
        '/images/prepflow-logo.png',
        '/images/dashboard-screenshot.png'
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = src;
        link.as = 'image';
        document.head.appendChild(link);
      });
    };

    // Optimize images for better LCP
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[data-src]');
      images.forEach(img => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const imgElement = entry.target as HTMLImageElement;
              imgElement.src = imgElement.dataset.src!;
              imgElement.classList.remove('lazy');
              observer.unobserve(imgElement);
            }
          });
        });
        observer.observe(img);
      });
    };

    // Optimize scroll performance
    const optimizeScroll = () => {
      let ticking = false;
      
      const updateScroll = () => {
        // Add scroll optimization logic here
        ticking = false;
      };

      const requestTick = () => {
        if (!ticking) {
          requestAnimationFrame(updateScroll);
          ticking = true;
        }
      };

      window.addEventListener('scroll', requestTick, { passive: true });
    };

    // Optimize animations for better performance
    const optimizeAnimations = () => {
      // Check if user prefers reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (prefersReducedMotion) {
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
        document.documentElement.style.setProperty('--transition-duration', '0.01ms');
      }
    };

    // Initialize all optimizations
    preloadCriticalResources();
    optimizeImages();
    optimizeScroll();
    optimizeAnimations();

    // Cleanup function
    return () => {
      // Remove any event listeners if needed
    };
  }, [enabled]);

  // This component doesn't render anything visible
  return null;
}
