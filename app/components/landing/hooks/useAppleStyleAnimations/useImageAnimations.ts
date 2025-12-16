/**
 * Hook for managing image-related animations in Apple-style animations
 */

import { useImageTransitions } from '../utils/imageTransitions';
import { useContainerHeight } from '../utils/containerDimensions';
import { useImageEntranceAnimation, useContainerOpacityAnimation } from '../utils/animationEffects';

interface Feature {
  title: string;
  description: string;
  screenshot: string;
  screenshotAlt: string;
}

interface UseImageAnimationsProps {
  displayFeature: Feature;
  imageMounted: boolean;
  expandedFeature: Feature | null;
  setImageMounted: (mounted: boolean) => void;
  imageContainerRef: React.RefObject<HTMLDivElement | null>;
}

export function useImageAnimations({
  displayFeature,
  imageMounted,
  expandedFeature,
  setImageMounted,
  imageContainerRef,
}: UseImageAnimationsProps) {
  const {
    currentImage,
    previousImage,
    isImageTransitioning,
    previousImageOpacity,
    currentImageOpacity,
    imageDimensions,
    setImageDimensions,
    setNewImageLoaded,
  } = useImageTransitions(displayFeature, imageMounted);
  const containerHeight = useContainerHeight(imageDimensions, imageContainerRef);
  useImageEntranceAnimation(imageMounted, imageContainerRef, expandedFeature, setImageMounted);
  useContainerOpacityAnimation(imageMounted, imageContainerRef, expandedFeature);

  return {
    currentImage,
    previousImage,
    isImageTransitioning,
    previousImageOpacity,
    currentImageOpacity,
    imageDimensions,
    containerHeight,
    setImageDimensions,
    setNewImageLoaded,
  };
}



