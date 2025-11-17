import { useState, useRef } from 'react';
import { useImageTransitions } from './utils/imageTransitions';
import { useContainerHeight } from './utils/containerDimensions';
import {
  useImageEntranceAnimation,
  useContainerOpacityAnimation,
  useStaggeredButtonAnimation,
} from './utils/animationEffects';
import { useInitialWidthMeasurement, useExpandedWidthMeasurement } from './utils/widthMeasurement';
import { createToggleHandler } from './utils/toggleHandler';

interface Feature {
  title: string;
  description: string;
  screenshot: string;
  screenshotAlt: string;
}

const ANIMATION_DURATION = 500;
const ANIMATION_EASING = 'cubic-bezier(0.28, 0.11, 0.32, 1)';
const BORDER_RADIUS_EASING = 'cubic-bezier(0.28, 0.11, 0.32, 1)';

export function useAppleStyleAnimations(features: Feature[]) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [containerWidths, setContainerWidths] = useState<number[]>([]);
  const [initialWidths, setInitialWidths] = useState<number[]>([]);
  const [isTransitioning, setIsTransitioning] = useState<number | null>(null);
  const [scaleXValues, setScaleXValues] = useState<number[]>([]);
  const [buttonHeights, setButtonHeights] = useState<number[]>([]);
  const [imageMounted, setImageMounted] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState<boolean[]>([]);
  const contentRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const parentContainerRef = useRef<HTMLDivElement | null>(null);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);

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
  };
}
