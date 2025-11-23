import { useEffect } from 'react';

interface Feature {
  title: string;
  description: string;
  screenshot: string;
  screenshotAlt: string;
}

export function useInitialWidthMeasurement(
  features: Feature[],
  containerRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>,
  initialWidths: number[],
  buttonHeights: number[],
  setInitialWidths: React.Dispatch<React.SetStateAction<number[]>>,
  setButtonHeights: React.Dispatch<React.SetStateAction<number[]>>,
) {
  useEffect(() => {
    const measureInitialDimensions = () => {
      features.forEach((_, index) => {
        const button = containerRefs.current[index];
        if (button) {
          const rect = button.getBoundingClientRect();
          if (!initialWidths[index]) {
            setInitialWidths(prev => {
              const newWidths = [...prev];
              if (!newWidths[index]) {
                newWidths[index] = rect.width;
              }
              return newWidths;
            });
          }
          if (!buttonHeights[index]) {
            setButtonHeights(prev => {
              const newHeights = [...prev];
              if (!newHeights[index]) {
                newHeights[index] = rect.height;
              }
              return newHeights;
            });
          }
        }
      });
    };
    const timeoutId = setTimeout(measureInitialDimensions, 100);
    return () => clearTimeout(timeoutId);
  }, [features, initialWidths, buttonHeights, containerRefs, setInitialWidths, setButtonHeights]);
}

export function useExpandedWidthMeasurement(
  expandedIndex: number | null,
  features: Feature[],
  containerRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>,
  parentContainerRef: React.RefObject<HTMLDivElement | null>,
  setContainerWidths: React.Dispatch<React.SetStateAction<number[]>>,
) {
  useEffect(() => {
    if (expandedIndex === null) return;
    const updateWidths = () => {
      const container = containerRefs.current[expandedIndex];
      if (!container) return;
      const button = container;
      const textContent = button.querySelector(`#feature-content-${expandedIndex}`) as HTMLElement;
      if (textContent && button) {
        const buttonWithContentWidth = button.getBoundingClientRect().width;
        const parentWidth = parentContainerRef.current
          ? parentContainerRef.current.getBoundingClientRect().width
          : button.parentElement?.getBoundingClientRect().width || Infinity;
        const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
        const borderWidth = 2;
        const sectionPadding = 16; // Reduced from 32 to allow more expansion
        const isDesktop = viewportWidth >= 1024;
        const imageSpace = isDesktop ? (viewportWidth >= 1280 ? 120 : 140) : 0; // Reduced from 180/200 to allow more expansion
        const widthMultiplier = 1.15; // Add 15% more width for better horizontal expansion
        const expandedWidthWithMultiplier = buttonWithContentWidth * widthMultiplier;
        const maxAllowedWidth = Math.min(
          parentWidth - sectionPadding,
          viewportWidth - sectionPadding - imageSpace,
          expandedWidthWithMultiplier + borderWidth,
        );
        const totalWidth = Math.max(
          expandedWidthWithMultiplier + borderWidth,
          Math.ceil(maxAllowedWidth),
        );
        setContainerWidths(prev => {
          const newWidths = [...prev];
          newWidths[expandedIndex] = totalWidth;
          return newWidths;
        });
      }
    };
    const rafId = requestAnimationFrame(() => {
      updateWidths();
    });
    return () => cancelAnimationFrame(rafId);
  }, [expandedIndex, features, containerRefs, parentContainerRef, setContainerWidths]);
}
