import { useImageTransitions } from './utils/imageTransitions';
import { useContainerHeight } from './utils/containerDimensions';
import { useAnimationState } from './helpers/animationState';
import { createAnimationReturn } from './helpers/animationReturn';
import { setupAnimationEffects } from './helpers/animationSetup';
import {
  useImageEntranceAnimation,
  useContainerOpacityAnimation,
  useStaggeredButtonAnimation,
} from './utils/animationEffects';
import { useInitialWidthMeasurement, useExpandedWidthMeasurement } from './utils/widthMeasurement';

interface Feature {
  title: string;
  description: string;
  screenshot: string;
  screenshotAlt: string;
}

export function useAppleStyleAnimations(features: Feature[]) {
  const {
    expandedIndex,
    setExpandedIndex,
    containerWidths,
    setContainerWidths,
    initialWidths,
    setInitialWidths,
    isTransitioning,
    setIsTransitioning,
    scaleXValues,
    setScaleXValues,
    buttonHeights,
    setButtonHeights,
    imageMounted,
    setImageMounted,
    buttonsVisible,
    setButtonsVisible,
    contentRefs,
    buttonRefs,
    containerRefs,
    parentContainerRef,
    imageContainerRef,
  } = useAnimationState(features);
  const expandedFeature = expandedIndex !== null ? features[expandedIndex] : null;
  const displayFeature = expandedFeature || features[0];
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
  useStaggeredButtonAnimation(features, setButtonsVisible);
  useInitialWidthMeasurement(
    features,
    containerRefs,
    initialWidths,
    buttonHeights,
    setInitialWidths,
    setButtonHeights,
  );
  useExpandedWidthMeasurement(
    expandedIndex,
    features,
    containerRefs,
    parentContainerRef,
    setContainerWidths,
  );
  const handleToggle = setupAnimationEffects({
    features,
    expandedIndex,
    containerRefs,
    parentContainerRef,
    initialWidths,
    setExpandedIndex,
    setContainerWidths,
    setScaleXValues,
    setIsTransitioning,
  });
  return createAnimationReturn({
    expandedIndex,
    expandedFeature,
    displayFeature,
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
  });
}
