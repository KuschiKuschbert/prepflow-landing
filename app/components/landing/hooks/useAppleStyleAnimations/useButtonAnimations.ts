/**
 * Hook for managing button-related animations in Apple-style animations
 */

import { useStaggeredButtonAnimation } from '../utils/animationEffects';
import { useInitialWidthMeasurement, useExpandedWidthMeasurement } from '../utils/widthMeasurement';

interface Feature {
  title: string;
  description: string;
  screenshot: string;
  screenshotAlt: string;
}

interface UseButtonAnimationsProps {
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
}

export function useButtonAnimations({
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
}: UseButtonAnimationsProps) {
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
}




