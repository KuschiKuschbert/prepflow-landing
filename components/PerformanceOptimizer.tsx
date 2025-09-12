'use client';

import { useEffect, useState } from 'react';
import { performanceMonitor, type PerformanceMetrics } from '@/lib/performance-monitor';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
  enableOptimizations?: boolean;
}

export default function PerformanceOptimizer({ 
  children, 
  enableOptimizations = true 
}: PerformanceOptimizerProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    inp: null,
  });

  useEffect(() => {
    if (!enableOptimizations || typeof window === 'undefined') return;

    // Subscribe to performance metrics
    const unsubscribe = performanceMonitor.subscribe(setMetrics);

    // Apply performance optimizations
    applyPerformanceOptimizations();

    return unsubscribe;
  }, [enableOptimizations]);

  // Apply dynamic optimizations based on performance
  useEffect(() => {
    if (!enableOptimizations || typeof window === 'undefined') return;

    const { lcp, cls, fcp } = metrics;

    // If LCP is poor, reduce image quality
    if (lcp && lcp > 2500) {
      document.documentElement.style.setProperty('--image-quality', '0.7');
    }

    // If CLS is poor, add layout stability
    if (cls && cls > 0.1) {
      document.documentElement.style.setProperty('--layout-stability', '1');
    }

    // If FCP is poor, defer non-critical resources
    if (fcp && fcp > 1800) {
      deferNonCriticalResources();
    }
  }, [metrics, enableOptimizations]);

  return <>{children}</>;
}

function applyPerformanceOptimizations() {
  // Preload critical resources
  preloadCriticalResources();

  // Optimize images
  optimizeImages();

  // Defer non-critical JavaScript
  deferNonCriticalJS();

  // Optimize fonts
  optimizeFonts();

  // Add resource hints
  addResourceHints();
}

function preloadCriticalResources() {
  const criticalResources = [
    { href: '/fonts/geist-sans.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
    { href: '/fonts/geist-mono.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    if (resource.type) link.type = resource.type;
    if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
    document.head.appendChild(link);
  });
}

function optimizeImages() {
  // Lazy load images below the fold
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src || '';
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

function deferNonCriticalJS() {
  // Defer analytics scripts
  const analyticsScripts = document.querySelectorAll('script[data-defer]');
  analyticsScripts.forEach(script => {
    script.setAttribute('defer', '');
  });
}

function optimizeFonts() {
  // Add font-display: swap to prevent FOIT
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'Geist Sans';
      font-display: swap;
    }
    @font-face {
      font-family: 'Geist Mono';
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
}

function addResourceHints() {
  // Add DNS prefetch for external domains
  const externalDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
  ];

  externalDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
}

function deferNonCriticalResources() {
  // Defer non-critical CSS
  const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"][data-defer]');
  nonCriticalCSS.forEach(link => {
    link.setAttribute('media', 'print');
    link.setAttribute('onload', "this.media='all'");
  });

  // Defer non-critical JavaScript
  const nonCriticalJS = document.querySelectorAll('script[data-defer]');
  nonCriticalJS.forEach(script => {
    script.setAttribute('defer', '');
  });
}

// Performance optimization hooks
export function usePerformanceOptimization() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    inp: null,
  });

  const [score, setScore] = useState(0);
  const [grade, setGrade] = useState<'A' | 'B' | 'C' | 'D' | 'F'>('F');

  useEffect(() => {
    const unsubscribe = performanceMonitor.subscribe((newMetrics) => {
      setMetrics(newMetrics);
      setScore(performanceMonitor.getPerformanceScore());
      setGrade(performanceMonitor.getPerformanceGrade());
    });

    return unsubscribe;
  }, []);

  return {
    metrics,
    score,
    grade,
    isGoodPerformance: score >= 80,
    isPoorPerformance: score < 60,
  };
}