'use client';

import Image from 'next/image';
import { RefObject } from 'react';

interface Feature {
  screenshot: string;
  screenshotAlt: string;
}

interface FeatureImageContainerProps {
  currentImage: Feature | null;
  previousImage: Feature | null;
  isImageTransitioning: boolean;
  previousImageOpacity: number;
  currentImageOpacity: number;
  imageMounted: boolean;
  containerHeight: number | null;
  expandedFeature: Feature | null;
  imageContainerRef: RefObject<HTMLDivElement | null>;
  onImageLoad: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  ANIMATION_DURATION: number;
  ANIMATION_EASING: string;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

export function FeatureImageContainer({
  currentImage,
  previousImage,
  isImageTransitioning,
  previousImageOpacity,
  currentImageOpacity,
  imageMounted,
  containerHeight,
  expandedFeature,
  imageContainerRef,
  onImageLoad,
  ANIMATION_DURATION,
  ANIMATION_EASING,
}: FeatureImageContainerProps) {
  return (
    <div className="desktop:sticky desktop:top-24 desktop:flex-1 desktop:min-w-[55%] desktop:max-w-[60%] xl:min-w-[58%] xl:max-w-[65%] desktop:z-10 w-full flex items-stretch">
      <div
        ref={imageContainerRef as any}
        className="relative rounded-3xl bg-[#1f1f1f]/40 shadow-xl shadow-black/20 w-full flex-1 overflow-hidden"
        style={{
          height: containerHeight ? `${containerHeight}px` : undefined,
          minHeight: containerHeight
            ? (typeof window !== 'undefined' && window.innerWidth >= 1024 ? `${Math.min(containerHeight, 500)}px` : '450px')
            : '450px',
          maxHeight: containerHeight && typeof window !== 'undefined' && window.innerWidth >= 1024
            ? `${Math.max(containerHeight, 800)}px`
            : undefined,
          opacity: prefersReducedMotion()
            ? (expandedFeature ? 1 : 0.8)
            : imageMounted
              ? (expandedFeature ? 1 : 0.8)
              : 0,
          transform: prefersReducedMotion()
            ? 'translateX(0)'
            : imageMounted
              ? 'translateX(0)'
              : 'translateX(10px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          transition: prefersReducedMotion()
            ? 'none'
            : `opacity ${ANIMATION_DURATION + 100}ms ${ANIMATION_EASING}, transform ${ANIMATION_DURATION + 100}ms ${ANIMATION_EASING}, height ${ANIMATION_DURATION + 100}ms ${ANIMATION_EASING}`,
          willChange: prefersReducedMotion() ? 'auto' : 'opacity, transform, height',
        }}
      >
        <div className="relative w-full h-full bg-[#0a0a0a] overflow-hidden">
          {previousImage && isImageTransitioning && (
            <div
              className="absolute inset-0 z-20 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.2) 70%, rgba(0, 0, 0, 0.4) 90%, rgba(0, 0, 0, 0.6) 100%)`,
                opacity: previousImageOpacity,
                transition: `opacity ${ANIMATION_DURATION + 200}ms ${ANIMATION_EASING}`,
              }}
            />
          )}

          {currentImage && (
            <div
              className="absolute inset-0 z-20 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.2) 70%, rgba(0, 0, 0, 0.4) 90%, rgba(0, 0, 0, 0.6) 100%)`,
                opacity: imageMounted ? currentImageOpacity : 0,
                transition: `opacity ${ANIMATION_DURATION + 200}ms ${ANIMATION_EASING}`,
              }}
            />
          )}

          {previousImage && isImageTransitioning && (
            <div className="absolute inset-0 z-10" style={{ opacity: previousImageOpacity, transition: `opacity ${ANIMATION_DURATION + 200}ms ${ANIMATION_EASING}` }}>
              <Image
                src={previousImage.screenshot}
                alt={previousImage.screenshotAlt}
                width={1200}
                height={800}
                className="h-full w-full object-cover object-center"
                style={{
                  maskImage: 'radial-gradient(ellipse 95% 95% at center, black 85%, transparent 100%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 95% 95% at center, black 85%, transparent 100%)',
                  willChange: 'opacity',
                }}
                quality={90}
              />
            </div>
          )}

          {currentImage && (
            <div
              className={previousImage && isImageTransitioning ? 'absolute inset-0 z-10' : 'h-full w-full z-10'}
              style={{
                opacity: imageMounted ? currentImageOpacity : 0,
                transition: `opacity ${ANIMATION_DURATION + 200}ms ${ANIMATION_EASING}`,
                willChange: isImageTransitioning ? 'opacity' : 'auto',
              }}
            >
              <Image
                src={currentImage.screenshot}
                alt={currentImage.screenshotAlt}
                width={1200}
                height={800}
                className="h-full w-full object-cover object-center"
                style={{
                  maskImage: 'radial-gradient(ellipse 95% 95% at center, black 85%, transparent 100%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 95% 95% at center, black 85%, transparent 100%)',
                }}
                quality={90}
                priority={true}
                onLoad={onImageLoad}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
