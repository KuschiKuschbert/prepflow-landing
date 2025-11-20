import { useAnimationHooks } from './useAnimationHooks';

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
 */
export function useAnimationEffects(props: AnimationEffectsProps) {
  return useAnimationHooks(props);
}
