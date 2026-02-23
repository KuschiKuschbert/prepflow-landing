'use client';

import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { LucideIcon } from 'lucide-react';
import React, { useMemo } from 'react';
import { FeatureButton } from './components/FeatureButton';
import { FeatureImageContainer } from './components/FeatureImageContainer';
import { useAppleStyleAnimations } from './hooks/useAppleStyleAnimations';

// Spotlight component removed - using simpler background effects in LandingBackground

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  screenshot: string;
  screenshotAlt: string;
  details: string[];
  colorClass: string;
  cta?: {
    text: string;
    href: string;
    action?: () => void;
  };
}

interface AppleStyleFeaturesProps {
  features: Feature[];
  sectionTitle?: string;
}

function AppleStyleFeatures({
  features,
  sectionTitle = 'Take a closer look.',
}: AppleStyleFeaturesProps) {
  const {
    expandedIndex,
    expandedFeature,
    currentImage,
    previousImage,
    isImageTransitioning,
    previousImageOpacity,
    currentImageOpacity,
    imageMounted,
    imageDimensions: _imageDimensions,
    containerHeight,
    containerWidths,
    initialWidths,
    buttonHeights,
    isTransitioning,
    buttonsVisible,
    containerRefs,
    buttonRefs,
    contentRefs,
    parentContainerRef,
    imageContainerRef,
    handleToggle,
    setImageDimensions,
    setNewImageLoaded,
    ANIMATION_DURATION,
    ANIMATION_EASING,
    BORDER_RADIUS_EASING: _BORDER_RADIUS_EASING,
    IMAGE_CROSSFADE_DURATION,
    IMAGE_OPACITY_DURATION,
  } = useAppleStyleAnimations(features);

  const containerAndButtonRefCallbacks = useMemo(
    () =>
      features.map((_, i) => (el: HTMLButtonElement | null) => {
        containerRefs.current[i] = el;
        buttonRefs.current[i] = el;
      }),
    [features.length],
  );
  const contentRefCallbacks = useMemo(
    () =>
      features.map((_, i) => (el: HTMLSpanElement | null) => {
        contentRefs.current[i] = el;
      }),
    [features.length],
  );
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      setImageDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    }

    if (isImageTransitioning) {
      setNewImageLoaded(true);
    }
  };

  return (
    <section className="tablet:py-32 relative bg-transparent py-24">
      <div className="tablet:px-6 desktop:px-8 large-desktop:px-12 mx-auto w-full max-w-[95%] px-4 xl:max-w-[1400px] xl:px-20 2xl:max-w-[1600px] 2xl:px-24">
        <ScrollReveal variant="fade-up" className="mb-20 text-center">
          <h2 className="text-fluid-4xl tablet:text-fluid-5xl desktop:text-fluid-6xl font-light tracking-tight text-white">
            {sectionTitle}
          </h2>
        </ScrollReveal>

        <div
          className="desktop:flex-row desktop:gap-8 desktop:items-stretch large-desktop:gap-10 flex flex-col gap-12 xl:gap-12 2xl:gap-14"
          style={{
            contain: 'layout style',
          }}
        >
          <div
            ref={parentContainerRef}
            className="desktop:max-w-[45%] desktop:w-auto desktop:self-center flex w-full min-w-0 flex-shrink-0 flex-col xl:max-w-[42%]"
            style={{
              contain: 'layout style',
              gap: '0.375rem',
            }}
          >
            {features.map((feature, index) => {
              const isExpanded = expandedIndex === index;
              const _isCurrentlyTransitioning = isTransitioning === index;
              const isVisible = buttonsVisible[index] !== false;

              return (
                <FeatureButton
                  key={feature.title}
                  feature={feature}
                  index={index}
                  isExpanded={isExpanded}
                  isVisible={isVisible}
                  containerWidth={containerWidths[index]}
                  initialWidth={initialWidths[index]}
                  buttonHeight={buttonHeights[index]}
                  onToggle={() => handleToggle(index)}
                  containerRef={containerAndButtonRefCallbacks[index]}
                  buttonRef={containerAndButtonRefCallbacks[index]}
                  contentRef={contentRefCallbacks[index]}
                />
              );
            })}
          </div>

          <FeatureImageContainer
            currentImage={currentImage}
            previousImage={previousImage}
            isImageTransitioning={isImageTransitioning}
            previousImageOpacity={previousImageOpacity}
            currentImageOpacity={currentImageOpacity}
            imageMounted={imageMounted}
            containerHeight={containerHeight}
            expandedFeature={expandedFeature}
            imageContainerRef={imageContainerRef}
            onImageLoad={handleImageLoad}
            ANIMATION_DURATION={ANIMATION_DURATION}
            ANIMATION_EASING={ANIMATION_EASING}
            IMAGE_CROSSFADE_DURATION={IMAGE_CROSSFADE_DURATION}
            IMAGE_OPACITY_DURATION={IMAGE_OPACITY_DURATION}
          />
        </div>
      </div>
    </section>
  );
}

export default React.memo(AppleStyleFeatures);
