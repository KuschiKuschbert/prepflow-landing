import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  BORDER_RADIUS_EASING,
  IMAGE_CROSSFADE_DURATION,
  IMAGE_OPACITY_DURATION,
} from './animationConstants';

interface Feature {
  title: string;
  description: string;
  screenshot: string;
  screenshotAlt: string;
}

export interface AnimationReturnProps {
  expandedIndex: number | null;
  expandedFeature: Feature | null;
  displayFeature: Feature;
  currentImage: Feature | null;
  previousImage: Feature | null;
  isImageTransitioning: boolean;
  previousImageOpacity: number;
  currentImageOpacity: number;
  imageMounted: boolean;
  imageDimensions: { width: number; height: number } | null;
  containerHeight: number | null;
  containerWidths: number[];
  initialWidths: number[];
  buttonHeights: number[];
  isTransitioning: number | null;
  buttonsVisible: boolean[];
  containerRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  buttonRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  contentRefs: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  parentContainerRef: React.RefObject<HTMLDivElement | null>;
  imageContainerRef: React.RefObject<HTMLDivElement | null>;
  handleToggle: (index: number) => void;
  setImageDimensions: (dimensions: { width: number; height: number } | null) => void;
  setNewImageLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Create animation hook return object.
 *
 * @param {AnimationReturnProps} props - Return props
 * @returns {Object} Animation hook return value
 */
export function createAnimationReturn({
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
}: AnimationReturnProps) {
  return {
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
    ANIMATION_DURATION,
    ANIMATION_EASING,
    BORDER_RADIUS_EASING,
    IMAGE_CROSSFADE_DURATION,
    IMAGE_OPACITY_DURATION,
  };
}
