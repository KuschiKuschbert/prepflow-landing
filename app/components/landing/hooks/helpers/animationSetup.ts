import { createToggleHandler } from '../utils/toggleHandler';

interface Feature {
  title: string;
  description: string;
  screenshot: string;
  screenshotAlt: string;
}

interface AnimationSetupProps {
  features: Feature[];
  expandedIndex: number | null;
  containerRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  parentContainerRef: React.RefObject<HTMLDivElement | null>;
  initialWidths: number[];
  setExpandedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setContainerWidths: React.Dispatch<React.SetStateAction<number[]>>;
  setScaleXValues: React.Dispatch<React.SetStateAction<number[]>>;
  setIsTransitioning: React.Dispatch<React.SetStateAction<number | null>>;
}

/**
 * Create toggle handler for animation effects.
 * Note: Animation hooks should be called in the parent hook component.
 *
 * @param {AnimationSetupProps} props - Setup props
 * @returns {Function} Toggle handler function
 */
export function setupAnimationEffects({
  features,
  expandedIndex,
  containerRefs,
  parentContainerRef,
  initialWidths,
  setExpandedIndex,
  setContainerWidths,
  setScaleXValues,
  setIsTransitioning,
}: AnimationSetupProps) {
  return createToggleHandler(
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
}
