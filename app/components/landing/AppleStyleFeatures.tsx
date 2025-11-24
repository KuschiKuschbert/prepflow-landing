'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { FeatureButton } from './components/FeatureButton';
import { FeatureImageContainer } from './components/FeatureImageContainer';
import { useAppleStyleAnimations } from './hooks/useAppleStyleAnimations';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

// Spotlight component removed - using simpler background effects in LandingBackground

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  screenshot: string;
  screenshotAlt: string;
  details: string[];
  color: string;
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
    imageDimensions,
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
    BORDER_RADIUS_EASING,
  } = useAppleStyleAnimations(features);

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
      <div className="desktop:max-w-[92%] tablet:px-6 desktop:px-8 mx-auto w-full max-w-[95%] px-4 xl:max-w-[90%] 2xl:max-w-7xl">
        <ScrollReveal variant="fade-up" className="mb-20 text-center">
          <h2 className="text-fluid-4xl tablet:text-fluid-5xl desktop:text-fluid-6xl font-light tracking-tight text-white">
            {sectionTitle}
          </h2>
        </ScrollReveal>

        <div
          className="desktop:flex-row desktop:gap-8 desktop:items-stretch flex flex-col gap-12 xl:gap-12"
          style={{
            contain: 'layout',
          }}
        >
          <div
            ref={parentContainerRef as any}
            className="desktop:max-w-[45%] desktop:w-auto desktop:self-center flex w-full min-w-0 flex-shrink-0 flex-col xl:max-w-[42%]"
            style={{
              contain: 'layout',
              gap: '0.375rem',
            }}
          >
            {features.map((feature, index) => {
              const isExpanded = expandedIndex === index;
              const isCurrentlyTransitioning = isTransitioning === index;
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
                  containerRef={el => {
                    containerRefs.current[index] = el;
                  }}
                  buttonRef={el => {
                    buttonRefs.current[index] = el;
                  }}
                  contentRef={el => {
                    contentRefs.current[index] = el;
                  }}
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
          />
        </div>
      </div>
    </section>
  );
}

export default React.memo(AppleStyleFeatures);
