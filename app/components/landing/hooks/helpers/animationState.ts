import { useState, useRef } from 'react';

interface Feature {
  title: string;
  description: string;
  screenshot: string;
  screenshotAlt: string;
}

/**
 * Initialize animation state.
 *
 * @param {Feature[]} features - Features array
 * @returns {Object} Animation state and refs
 */
export function useAnimationState(features: Feature[]) {
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

  return {
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
  };
}
