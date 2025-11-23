'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { RefObject, useState, useEffect } from 'react';

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
  imageMounted,
  containerHeight,
  expandedFeature,
  imageContainerRef,
  onImageLoad,
}: FeatureImageContainerProps) {
  const [imageReady, setImageReady] = useState(false);
  const shouldShow = expandedFeature !== null && imageMounted;
  const minHeight =
    containerHeight && typeof window !== 'undefined' && window.innerWidth >= 1024
      ? `${Math.min(containerHeight, 500)}px`
      : '450px';
  const maxHeight =
    containerHeight && typeof window !== 'undefined' && window.innerWidth >= 1024
      ? `${Math.max(containerHeight, 800)}px`
      : undefined;

  // Preload current image to ensure it's ready before transition
  useEffect(() => {
    if (currentImage && isImageTransitioning) {
      setImageReady(false);
      const img = new window.Image();
      img.src = currentImage.screenshot;
      img.onload = () => {
        setImageReady(true);
      };
      img.onerror = () => {
        setImageReady(true); // Proceed even on error
      };
    } else if (currentImage && !isImageTransitioning) {
      setImageReady(true);
    }
  }, [currentImage, isImageTransitioning]);

  return (
    <div className="desktop:sticky desktop:top-24 desktop:flex-1 desktop:min-w-[55%] desktop:max-w-[60%] desktop:z-10 flex w-full items-stretch xl:max-w-[65%] xl:min-w-[58%]">
      <motion.div
        ref={imageContainerRef as any}
        layout
        className="relative w-full flex-1 overflow-hidden rounded-3xl border border-white/8 bg-[#1f1f1f]/40 shadow-xl shadow-black/20"
        initial={{ opacity: 0, x: 10 }}
        animate={{
          opacity: shouldShow ? 1 : 0.8,
          x: 0,
        }}
        transition={{
          type: 'spring',
          bounce: 0,
          duration: 0.6,
          opacity: { duration: 0.4 },
        }}
        style={{
          height: containerHeight ? `${containerHeight}px` : undefined,
          minHeight,
          maxHeight,
          willChange: 'transform, opacity',
        }}
      >
        <div className="relative h-full w-full overflow-hidden bg-[#0a0a0a]">
          {/* Radial gradient overlay */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-20"
            style={{
              background: `radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.2) 70%, rgba(0, 0, 0, 0.4) 90%, rgba(0, 0, 0, 0.6) 100%)`,
              willChange: 'opacity',
            }}
            animate={{
              opacity: shouldShow ? 1 : 0.8,
            }}
            transition={{ duration: 0.4 }}
          />

          {/* Professional crossfade - both images visible simultaneously */}
          {/* Previous image - stays visible until new image is ready, then fades out */}
          {previousImage && isImageTransitioning && (
            <motion.div
              key={`prev-${previousImage.screenshot}`}
              className="absolute inset-0 z-10"
              initial={{ opacity: 1, scale: 1 }}
              animate={{
                opacity: imageReady ? 0 : 1,
                scale: imageReady ? 1.01 : 1,
              }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1], // Apple's standard easing
                opacity: { duration: 0.7 },
                scale: { duration: 0.8 },
              }}
              style={{ willChange: 'transform, opacity' }}
            >
              <Image
                src={previousImage.screenshot}
                alt={previousImage.screenshotAlt}
                width={1200}
                height={800}
                className="h-full w-full object-cover object-center"
                style={{
                  maskImage:
                    'radial-gradient(ellipse 95% 95% at center, black 85%, transparent 100%)',
                  WebkitMaskImage:
                    'radial-gradient(ellipse 95% 95% at center, black 85%, transparent 100%)',
                }}
                quality={90}
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </motion.div>
          )}

          {/* Current image - fades in smoothly once ready */}
          {currentImage && (
            <motion.div
              key={`current-${currentImage.screenshot}`}
              className="absolute inset-0 z-10"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{
                opacity: imageReady || !isImageTransitioning ? 1 : 0,
                scale: imageReady || !isImageTransitioning ? 1 : 0.99,
              }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1], // Apple's standard easing
                opacity: { duration: 0.7 },
                scale: { duration: 0.8 },
              }}
              style={{ willChange: 'transform, opacity' }}
            >
              <Image
                src={currentImage.screenshot}
                alt={currentImage.screenshotAlt}
                width={1200}
                height={800}
                className="h-full w-full object-cover object-center"
                style={{
                  maskImage:
                    'radial-gradient(ellipse 95% 95% at center, black 85%, transparent 100%)',
                  WebkitMaskImage:
                    'radial-gradient(ellipse 95% 95% at center, black 85%, transparent 100%)',
                }}
                quality={90}
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 60vw"
                onLoad={onImageLoad}
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
