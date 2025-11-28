import { useEffect, useState } from 'react';

export function useContainerHeight(
  imageDimensions: { width: number; height: number } | null,
  imageContainerRef: React.RefObject<HTMLDivElement | null>,
) {
  const [containerHeight, setContainerHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!imageDimensions || !imageContainerRef.current) return;
    const calculateContainerHeight = () => {
      const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
      const isDesktop = viewportWidth >= 1024;
      if (!isDesktop) {
        setContainerHeight(null);
        return;
      }
      const containerWidth = imageContainerRef.current?.getBoundingClientRect().width;
      if (!containerWidth) return;
      const aspectRatio = imageDimensions.width / imageDimensions.height;
      const calculatedHeight = containerWidth / aspectRatio;
      const minHeight = 500;
      const maxHeight = 800;
      const idealHeight = Math.max(minHeight, Math.min(maxHeight, calculatedHeight));
      const finalHeight =
        calculatedHeight >= minHeight && calculatedHeight <= maxHeight
          ? calculatedHeight
          : idealHeight;
      setContainerHeight(finalHeight);
    };
    calculateContainerHeight();
    const handleResize = () => calculateContainerHeight();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [imageDimensions, imageContainerRef]);

  return containerHeight;
}

export { calculateExpandedWidth } from './calculateExpandedWidth';
