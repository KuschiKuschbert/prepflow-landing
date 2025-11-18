import { useImageTransitions } from '../utils/imageTransitions';
import { useContainerHeight } from '../utils/containerDimensions';
import {
  useImageEntranceAnimation,
  useContainerOpacityAnimation,
  useStaggeredButtonAnimation,
} from '../utils/animationEffects';
import { useInitialWidthMeasurement, useExpandedWidthMeasurement } from '../utils/widthMeasurement';
import { createToggleHandler } from '../utils/toggleHandler';

interface Feature {
  title: string;
  description: string;
  screenshot: string;
  screenshotAlt: string;
}

interface AnimationEffectsProps {
  displayFeature: Feature;
  imageMounted: boolean;
  expandedFeature: Feature | null;
  setImageMounted: (mounted: boolean) => void;
  features: Feature[];
  setButtonsVisible: React.Dispatch<React.SetStateAction<boolean[]>>;
  containerRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  initialWidths: number[];
  buttonHeights: number[];
  setInitialWidths: React.Dispatch<React.SetStateAction<number[]>>;
  setButtonHeights: React.Dispatch<React.SetStateAction<number[]>>;
  expandedIndex: number | null;
  parentContainerRef: React.RefObject<HTMLDivElement | null>;
  setContainerWidths: React.Dispatch<React.SetStateAction<number[]>>;
  setExpandedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setScaleXValues: React.Dispatch<React.SetStateAction<number[]>>;
  setIsTransitioning: React.Dispatch<React.SetStateAction<number | null>>;
  imageContainerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Setup animation effects and transitions.
 *
 * @param {AnimationEffectsProps} props - Animation effects props
 * @returns {Object} Animation effects and handlers
 */
export function useAnimationEffects({
  displayFeature,
  imageMounted,
  expandedFeature,
  setImageMounted,
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
  setExpandedIndex,
  setScaleXValues,
  setIsTransitioning,
  imageContainerRef,
}: AnimationEffectsProps) {
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
  useExpandedWidthMeasurement(expandedIndex, features, containerRefs, parentContainerRef, setContainerWidths);

  const handleToggle = createToggleHandler(
    expandedIndex,
    features,
    containerRefs,
    parentContainerRef,
    initialWidths,
    setExpandedIndex,
    setContainerWidths,
    setScaleXValues,
    setIsTransitioning,
  );

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
    handleToggle,
  };
}
