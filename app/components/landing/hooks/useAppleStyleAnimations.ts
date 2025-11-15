import { useEffect, useRef, useState } from 'react';

interface Feature {
  title: string;
  description: string;
  screenshot: string;
  screenshotAlt: string;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

// Unified animation constants - Apple-style smooth morphing
const ANIMATION_DURATION = 500;
const ANIMATION_EASING = 'cubic-bezier(0.28, 0.11, 0.32, 1)';
const BORDER_RADIUS_EASING = 'cubic-bezier(0.28, 0.11, 0.32, 1)';
const STAGGER_DELAY = 30;

export function useAppleStyleAnimations(features: Feature[]) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [containerWidths, setContainerWidths] = useState<number[]>([]);
  const [initialWidths, setInitialWidths] = useState<number[]>([]);
  const [isTransitioning, setIsTransitioning] = useState<number | null>(null);
  const [scaleXValues, setScaleXValues] = useState<number[]>([]);
  const [buttonHeights, setButtonHeights] = useState<number[]>([]);
  const [expandedHeights, setExpandedHeights] = useState<number[]>([]);
  const [imageMounted, setImageMounted] = useState(false);
  const [currentImage, setCurrentImage] = useState<Feature | null>(null);
  const [previousImage, setPreviousImage] = useState<Feature | null>(null);
  const [isImageTransitioning, setIsImageTransitioning] = useState(false);
  const [previousImageOpacity, setPreviousImageOpacity] = useState(1);
  const [currentImageOpacity, setCurrentImageOpacity] = useState(1);
  const [newImageLoaded, setNewImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  const [buttonsVisible, setButtonsVisible] = useState<boolean[]>([]);
  const contentRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const parentContainerRef = useRef<HTMLDivElement | null>(null);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);

  const expandedFeature = expandedIndex !== null ? features[expandedIndex] : null;
  const displayFeature = expandedFeature || features[0];

  const handleToggle = (index: number) => {
    const willExpand = expandedIndex !== index;

    if (willExpand) {
      const button = containerRefs.current[index];
      if (button) {
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
          : (button.parentElement?.getBoundingClientRect().width || Infinity);
        const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
        const borderWidth = 2;
        const sectionPadding = 32;
        const isDesktop = viewportWidth >= 1024;
        const imageSpace = isDesktop ? (viewportWidth >= 1280 ? 180 : 200) : 0;
        const maxAllowedWidth = Math.min(
          parentWidth - sectionPadding,
          viewportWidth - sectionPadding - imageSpace,
          expandedWidth + borderWidth
        );

        const totalWidth = Math.max(expandedWidth + borderWidth, Math.ceil(maxAllowedWidth));
        const scaleRatio = totalWidth / (initialWidths[index] || expandedWidth);

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
              setIsTransitioning(prev => prev === index ? null : prev);
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
        setIsTransitioning(prev => prev === index ? null : prev);
      }, ANIMATION_DURATION + 50);
    }
  };

  // Handle smooth image cross-fade transitions
  useEffect(() => {
    if (!imageMounted) return;

    const newImage = displayFeature;
    const oldImage = currentImage;

    if (oldImage && oldImage.screenshot !== newImage.screenshot) {
      setIsImageTransitioning(true);
      setPreviousImage(oldImage);
      setPreviousImageOpacity(1);
      setCurrentImageOpacity(0);
      setNewImageLoaded(false);
      setCurrentImage(newImage);

      const img = new window.Image();
      img.src = newImage.screenshot;
      img.onload = () => {
        setNewImageLoaded(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setPreviousImageOpacity(0);
            setCurrentImageOpacity(1);
          });
        });
      };
      img.onerror = () => {
        setNewImageLoaded(true);
        requestAnimationFrame(() => {
          setPreviousImageOpacity(0);
          setCurrentImageOpacity(1);
        });
      };
    } else if (!currentImage) {
      setCurrentImage(newImage);
      setCurrentImageOpacity(1);
      setNewImageLoaded(true);

      const img = new window.Image();
      img.src = newImage.screenshot;
      img.onload = () => {
        if (img.naturalWidth && img.naturalHeight) {
          setImageDimensions({
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
        }
      };
    }
  }, [displayFeature, imageMounted, currentImage]);

  // Calculate container height based on image aspect ratio
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

      const finalHeight = calculatedHeight >= minHeight && calculatedHeight <= maxHeight
        ? calculatedHeight
        : idealHeight;

      setContainerHeight(finalHeight);
    };

    calculateContainerHeight();
    const handleResize = () => calculateContainerHeight();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [imageDimensions]);

  // Clean up transition state after animation completes
  useEffect(() => {
    if (isImageTransitioning && newImageLoaded && previousImageOpacity === 0) {
      const timeoutId = setTimeout(() => {
        setIsImageTransitioning(false);
        setPreviousImage(null);
        setCurrentImageOpacity(1);
        setNewImageLoaded(false);
      }, ANIMATION_DURATION + 150);

      return () => clearTimeout(timeoutId);
    }
  }, [isImageTransitioning, newImageLoaded, previousImageOpacity]);

  // Apple-style smooth image entrance animation on mount
  useEffect(() => {
    if (!imageMounted && imageContainerRef.current && !prefersReducedMotion()) {
      imageContainerRef.current.style.opacity = '0';
      imageContainerRef.current.style.transform = 'translateX(10px)';

      const timeoutId = setTimeout(() => {
        setImageMounted(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (imageContainerRef.current) {
              imageContainerRef.current.style.opacity = expandedFeature ? '1' : '0.8';
              imageContainerRef.current.style.transform = 'translateX(0)';
            }
          });
        });
      }, 200);

      return () => clearTimeout(timeoutId);
    }
  }, [imageMounted, expandedFeature]);

  // Apple-style smooth container opacity transitions
  useEffect(() => {
    if (imageMounted && imageContainerRef.current && !prefersReducedMotion()) {
      requestAnimationFrame(() => {
        if (imageContainerRef.current) {
          if (expandedFeature) {
            imageContainerRef.current.style.opacity = '1';
          } else {
            imageContainerRef.current.style.opacity = '0.8';
          }
          imageContainerRef.current.style.transform = 'translateX(0)';
        }
      });
    }
  }, [expandedFeature, imageMounted]);

  // Measure content width when expanded
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
          : (button.parentElement?.getBoundingClientRect().width || Infinity);
        const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
        const borderWidth = 2;
        const sectionPadding = 32;
        const isDesktop = viewportWidth >= 1024;
        const imageSpace = isDesktop ? (viewportWidth >= 1280 ? 180 : 200) : 0;
        const maxAllowedWidth = Math.min(
          parentWidth - sectionPadding,
          viewportWidth - sectionPadding - imageSpace,
          buttonWithContentWidth + borderWidth
        );

        const totalWidth = Math.max(buttonWithContentWidth + borderWidth, Math.ceil(maxAllowedWidth));

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
  }, [expandedIndex, features]);

  // Measure initial button widths and heights on mount
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
  }, [features, initialWidths, buttonHeights]);

  // Staggered fade-in animation for buttons on initial appearance
  useEffect(() => {
    if (prefersReducedMotion()) {
      setButtonsVisible(new Array(features.length).fill(true));
      return;
    }

    features.forEach((_, index) => {
      const delay = index * STAGGER_DELAY;
      setTimeout(() => {
        setButtonsVisible(prev => {
          const newVisible = [...prev];
          newVisible[index] = true;
          return newVisible;
        });
      }, delay);
    });
  }, [features]);

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
