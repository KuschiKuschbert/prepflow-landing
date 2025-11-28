import { useAnimationState } from './helpers/animationState';
import { createAnimationReturn } from './helpers/animationReturn';
import { setupAnimationEffects } from './helpers/animationSetup';
import { useImageAnimations } from './useAppleStyleAnimations/useImageAnimations';
import { useButtonAnimations } from './useAppleStyleAnimations/useButtonAnimations';

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

  const imageAnimations = useImageAnimations({
    displayFeature,
    imageMounted,
    expandedFeature,
    setImageMounted,
    imageContainerRef,
  });

  useButtonAnimations({
    features,
    setButtonsVisible,
    containerRefs,
    initialWidths,
    buttonHeights,
    setInitialWidths,
    setButtonHeights,
    expandedIndex,
    parentContainerRef,
    setContainerWidths,
  });

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
    ...imageAnimations,
    imageMounted,
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
  });
}
