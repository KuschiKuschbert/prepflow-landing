import { useEffect, useState } from 'react';

interface Feature {
  title: string;
  description: string;
  screenshot: string;
  screenshotAlt: string;
}

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

export function calculateExpandedWidth(
  index: number,
  features: Feature[],
  containerRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>,
  parentContainerRef: React.RefObject<HTMLDivElement | null>,
  initialWidths: number[],
): { totalWidth: number; scaleRatio: number } {
  const button = containerRefs.current[index];
  if (!button) return { totalWidth: 0, scaleRatio: 1 };
  const buttonStyles = window.getComputedStyle(button);
  const tempContainer = document.createElement('button');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.visibility = 'hidden';
  tempContainer.style.display = 'flex';
  tempContainer.style.flexDirection = 'row';
  tempContainer.style.alignItems = 'center';
  tempContainer.style.padding = '0.75rem 1rem';
  tempContainer.style.fontSize = buttonStyles.fontSize;
  tempContainer.style.fontFamily = buttonStyles.fontFamily;
  tempContainer.style.lineHeight = buttonStyles.lineHeight;
  tempContainer.style.whiteSpace = 'nowrap';
  tempContainer.style.boxSizing = 'border-box';
  tempContainer.style.borderWidth = '1px';
  tempContainer.style.borderStyle = 'solid';
  const tempText = document.createElement('span');
  tempText.style.display = 'inline';
  tempText.style.textAlign = 'left';
  tempText.style.whiteSpace = 'nowrap';
  tempText.textContent = `${features[index].title}. ${features[index].description}`;
  tempContainer.appendChild(tempText);
  document.body.appendChild(tempContainer);
  const expandedWidth = tempContainer.getBoundingClientRect().width;
  document.body.removeChild(tempContainer);
  const parentWidth = parentContainerRef.current
    ? parentContainerRef.current.getBoundingClientRect().width
    : button.parentElement?.getBoundingClientRect().width || Infinity;
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const borderWidth = 2;
  const sectionPadding = 16; // Reduced from 32 to allow more expansion
  const isDesktop = viewportWidth >= 1024;
  const imageSpace = isDesktop ? (viewportWidth >= 1280 ? 120 : 140) : 0; // Reduced from 180/200 to allow more expansion
  const widthMultiplier = 1.15; // Add 15% more width for better horizontal expansion
  const expandedWidthWithMultiplier = expandedWidth * widthMultiplier;
  const maxAllowedWidth = Math.min(
    parentWidth - sectionPadding,
    viewportWidth - sectionPadding - imageSpace,
    expandedWidthWithMultiplier + borderWidth,
  );
  const totalWidth = Math.max(
    expandedWidthWithMultiplier + borderWidth,
    Math.ceil(maxAllowedWidth),
  );
  const scaleRatio = totalWidth / (initialWidths[index] || expandedWidth);
  return { totalWidth, scaleRatio };
}
