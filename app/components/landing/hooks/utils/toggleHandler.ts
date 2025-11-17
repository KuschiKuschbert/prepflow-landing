import { calculateExpandedWidth } from './containerDimensions';

interface Feature {
  title: string;
  description: string;
  screenshot: string;
  screenshotAlt: string;
}

const ANIMATION_DURATION = 500;

export function createToggleHandler(
  expandedIndex: number | null,
  features: Feature[],
  containerRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>,
  parentContainerRef: React.RefObject<HTMLDivElement | null>,
  initialWidths: number[],
  setExpandedIndex: (index: number | null) => void,
  setContainerWidths: React.Dispatch<React.SetStateAction<number[]>>,
  setScaleXValues: React.Dispatch<React.SetStateAction<number[]>>,
  setIsTransitioning: React.Dispatch<React.SetStateAction<number | null>>,
) {
  return (index: number) => {
    const willExpand = expandedIndex !== index;
    if (willExpand) {
      const button = containerRefs.current[index];
      if (button) {
        const { totalWidth, scaleRatio } = calculateExpandedWidth(
          index,
          features,
          containerRefs,
          parentContainerRef,
          initialWidths,
        );
        setContainerWidths(prev => {
          const newWidths = [...prev];
          newWidths[index] = totalWidth;
          return newWidths;
        });
        setScaleXValues(prev => {
          const newScales = [...prev];
          newScales[index] = scaleRatio;
          return newScales;
        });
        setIsTransitioning(index);
        requestAnimationFrame(() => {
          setTimeout(() => {
            setExpandedIndex(index);
            setTimeout(() => {
              setIsTransitioning((prev: number | null) => (prev === index ? null : prev));
            }, ANIMATION_DURATION + 50);
          }, 0);
        });
      } else {
        setExpandedIndex(index);
      }
    } else {
      setIsTransitioning(index);
      setExpandedIndex(null);
      setTimeout(() => {
        setIsTransitioning((prev: number | null) => (prev === index ? null : prev));
      }, ANIMATION_DURATION + 50);
    }
  };
}
