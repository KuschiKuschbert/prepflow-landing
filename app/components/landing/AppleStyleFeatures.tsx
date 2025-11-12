'use client';

import { Plus } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

interface Feature {
  title: string;
  description: string;
  icon: string;
  screenshot: string;
  screenshotAlt: string;
  details: string[];
  color: string;
}

interface AppleStyleFeaturesProps {
  features: Feature[];
  sectionTitle?: string;
}

export default function AppleStyleFeatures({
  features,
  sectionTitle = 'Take a closer look.',
}: AppleStyleFeaturesProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [containerWidths, setContainerWidths] = useState<number[]>([]);
  const [initialWidths, setInitialWidths] = useState<number[]>([]);
  const [isTransitioning, setIsTransitioning] = useState<number | null>(null);
  const [scaleXValues, setScaleXValues] = useState<number[]>([]);
  const [buttonHeights, setButtonHeights] = useState<number[]>([]);
  const [expandedHeights, setExpandedHeights] = useState<number[]>([]); // Pre-measured expanded heights
  const [imageMounted, setImageMounted] = useState(false); // Track if image has mounted for smooth entrance
  const [currentImage, setCurrentImage] = useState<Feature | null>(null); // Current image being displayed
  const [previousImage, setPreviousImage] = useState<Feature | null>(null); // Previous image for cross-fade
  const [isImageTransitioning, setIsImageTransitioning] = useState(false); // Track if image is transitioning
  const [previousImageOpacity, setPreviousImageOpacity] = useState(1); // Control previous image fade out
  const [currentImageOpacity, setCurrentImageOpacity] = useState(1); // Control current image fade in
  const [newImageLoaded, setNewImageLoaded] = useState(false); // Track when new image is loaded
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  const [buttonsVisible, setButtonsVisible] = useState<boolean[]>([]); // Track which buttons have appeared
  const contentRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const parentContainerRef = useRef<HTMLDivElement | null>(null);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);

  // Unified animation constants - Apple-style smooth morphing
  // Apple uses ~400-500ms with smooth easing for button morphing
  const ANIMATION_DURATION = 500; // Slightly longer for smoother feel
  // Apple's refined easing curve for ultra-smooth transitions
  const ANIMATION_EASING = 'cubic-bezier(0.28, 0.11, 0.32, 1)'; // Apple's refined easing - smoother acceleration/deceleration
  // Border-radius uses same easing for consistency
  const BORDER_RADIUS_EASING = 'cubic-bezier(0.28, 0.11, 0.32, 1)'; // Consistent easing for border-radius morphing
  // Stagger delay for initial appearance
  const STAGGER_DELAY = 30; // 30ms stagger for smooth sequential appearance

  const handleToggle = (index: number) => {
    const willExpand = expandedIndex !== index;

    if (willExpand) {
      // Pre-calculate width AND height before expanding to prevent layout shifts
      const button = containerRefs.current[index];
      if (button) {
        // Get computed styles from button to match exactly
        const buttonStyles = window.getComputedStyle(button);

        // Create temporary container matching button styles
        const tempContainer = document.createElement('button');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.visibility = 'hidden';
        tempContainer.style.display = 'flex';
        tempContainer.style.flexDirection = 'row';
        tempContainer.style.alignItems = 'center';
        tempContainer.style.padding = '0.75rem 1rem'; // More concise padding
        tempContainer.style.fontSize = buttonStyles.fontSize;
        tempContainer.style.fontFamily = buttonStyles.fontFamily;
        tempContainer.style.lineHeight = buttonStyles.lineHeight;
        tempContainer.style.whiteSpace = 'nowrap'; // Match button text - keep on one line
        tempContainer.style.boxSizing = 'border-box';
        tempContainer.style.borderWidth = '1px';
        tempContainer.style.borderStyle = 'solid';

        // Create text content matching the expanded state
        const tempText = document.createElement('span');
        tempText.style.display = 'inline';
        tempText.style.textAlign = 'left';
        tempText.style.whiteSpace = 'nowrap'; // Keep on one line for landscape orientation
        tempText.style.overflowWrap = 'normal';
        tempText.style.wordBreak = 'normal';
        tempText.style.maxWidth = 'none';
        tempText.style.width = 'auto';
        tempText.style.lineHeight = '1.5';

        // Create title (bold)
        const tempTitle = document.createElement('strong');
        tempTitle.style.fontWeight = '600';
        tempTitle.style.fontSize = window.innerWidth >= 768 ? '1.125rem' : '1rem'; // md:text-lg
        tempTitle.textContent = `${features[index].title}. `;

        // Create description
        const tempDesc = document.createElement('span');
        tempDesc.style.fontSize = window.innerWidth >= 768 ? '1rem' : '0.875rem'; // md:text-base
        tempDesc.style.marginLeft = '0.25rem';
        tempDesc.textContent = features[index].description;

        tempText.appendChild(tempTitle);
        tempText.appendChild(tempDesc);
        tempContainer.appendChild(tempText);

        // Add icon placeholder
        const tempIcon = document.createElement('div');
        tempIcon.style.width = '20px';
        tempIcon.style.height = '20px';
        tempIcon.style.marginLeft = '0.375rem'; // ml-1.5
        tempIcon.style.flexShrink = '0';
        tempContainer.appendChild(tempIcon);

        document.body.appendChild(tempContainer);

        // Measure total width and height - ensure we account for full text content
        const totalContentWidth = tempContainer.getBoundingClientRect().width;
        const totalContentHeight = tempContainer.getBoundingClientRect().height;
        const borderWidth = 2; // 1px border on each side

        // Get constraints
        const parentWidth = parentContainerRef.current
          ? parentContainerRef.current.getBoundingClientRect().width
          : (button.parentElement?.getBoundingClientRect().width || Infinity);
        const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
        const sectionPadding = 32; // Reduced padding for better space utilization
        const isDesktop = viewportWidth >= 1024;
        // Adjusted image space for optimized layout (buttons can use more space)
        const imageSpace = isDesktop ? (viewportWidth >= 1280 ? 180 : 200) : 0;

        // Calculate max allowed width - ensure it fits all content
        const maxAllowedWidth = Math.min(
          parentWidth - sectionPadding,
          viewportWidth - sectionPadding - imageSpace,
          totalContentWidth + borderWidth + 20 // Reduced padding for more concise buttons
        );

        const buttonBaseWidth = button.getBoundingClientRect().width;
        const buttonBaseHeight = button.getBoundingClientRect().height;
        // Ensure final width is at least as wide as the content needs
        const finalWidth = Math.max(
          buttonBaseWidth + borderWidth,
          Math.ceil(maxAllowedWidth),
          Math.ceil(totalContentWidth + borderWidth + 20) // Ensure content fits with concise padding
        );
        const finalHeight = Math.max(buttonBaseHeight, Math.ceil(totalContentHeight));
        const scaleRatio = finalWidth / buttonBaseWidth;

        // Cleanup
        document.body.removeChild(tempContainer);

        // Store initial width and height if not already stored (for smooth collapse transition)
        if (!initialWidths[index]) {
          setInitialWidths(prev => {
            const newWidths = [...prev];
            newWidths[index] = buttonBaseWidth;
            return newWidths;
          });
        }

        if (!buttonHeights[index]) {
          setButtonHeights(prev => {
            const newHeights = [...prev];
            newHeights[index] = buttonBaseHeight;
            return newHeights;
          });
        }

        // Store expanded width, height, and scale ratio BEFORE starting animation
        setContainerWidths(prev => {
          const newWidths = [...prev];
          newWidths[index] = finalWidth;
          return newWidths;
        });

        setExpandedHeights(prev => {
          const newHeights = [...prev];
          newHeights[index] = finalHeight;
          return newHeights;
        });

        setScaleXValues(prev => {
          const newScales = [...prev];
          newScales[index] = scaleRatio;
          return newScales;
        });

        // Mark as transitioning BEFORE state change
        setIsTransitioning(index);

        // Optimized: Use single RAF + setTimeout for faster response
        requestAnimationFrame(() => {
          // Batch state update for smoother transition
          setTimeout(() => {
            setExpandedIndex(index);

            // Clear transitioning state after animation completes
            setTimeout(() => {
              setIsTransitioning(prev => prev === index ? null : prev);
            }, ANIMATION_DURATION + 50);
          }, 0);
        });
      } else {
        // Button not found - fallback to immediate expansion
        setExpandedIndex(index);
      }
    } else {
      // Collapsing - mark as transitioning for smooth animation
      setIsTransitioning(index);
      setExpandedIndex(null);

      // Clear transitioning state after animation completes
      setTimeout(() => {
        setIsTransitioning(prev => prev === index ? null : prev);
      }, ANIMATION_DURATION + 50);
    }
  };

  const expandedFeature = expandedIndex !== null ? features[expandedIndex] : null;
  // Default to first feature's screenshot when no button is expanded
  const displayFeature = expandedFeature || features[0];

  // Handle smooth image cross-fade transitions
  useEffect(() => {
    if (!imageMounted) return;

    const newImage = displayFeature;
    const oldImage = currentImage;

    // If image changed, trigger cross-fade
    if (oldImage && oldImage.screenshot !== newImage.screenshot) {
      setIsImageTransitioning(true);
      setPreviousImage(oldImage);
      setPreviousImageOpacity(1); // Start previous image at full opacity
      setCurrentImageOpacity(0); // Start new image at 0 opacity
      setNewImageLoaded(false); // Reset loaded state

      // Set new image immediately so it can start loading
      setCurrentImage(newImage);

      // Preload the new image
      const img = new window.Image();
      img.src = newImage.screenshot;
      img.onload = () => {
        // Image is loaded, now start the cross-fade
        setNewImageLoaded(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setPreviousImageOpacity(0); // Fade out previous
            setCurrentImageOpacity(1); // Fade in new
          });
        });
      };
      img.onerror = () => {
        // If image fails to load, still show it (might be a Next.js Image optimization issue)
        setNewImageLoaded(true);
        requestAnimationFrame(() => {
          setPreviousImageOpacity(0);
          setCurrentImageOpacity(1);
        });
      };
    } else if (!currentImage) {
      // Initial image load
      setCurrentImage(newImage);
      setCurrentImageOpacity(1);
      setNewImageLoaded(true);

      // Preload initial image to get dimensions
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
        // Mobile: use min-height constraints
        setContainerHeight(null);
        return;
      }

      // Get container width
      const containerWidth = imageContainerRef.current?.getBoundingClientRect().width;
      if (!containerWidth) return;

      // Calculate height based on image aspect ratio
      const aspectRatio = imageDimensions.width / imageDimensions.height;
      const calculatedHeight = containerWidth / aspectRatio;

      // Set constraints: min 500px, max 800px, but respect aspect ratio within reason
      const minHeight = 500;
      const maxHeight = 800;
      const idealHeight = Math.max(minHeight, Math.min(maxHeight, calculatedHeight));

      // If calculated height is reasonable, use it; otherwise use constraints
      const finalHeight = calculatedHeight >= minHeight && calculatedHeight <= maxHeight
        ? calculatedHeight
        : idealHeight;

      setContainerHeight(finalHeight);
    };

    // Initial calculation
    calculateContainerHeight();

    // Recalculate on window resize
    const handleResize = () => {
      calculateContainerHeight();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [imageDimensions]);

  // Clean up transition state after animation completes
  useEffect(() => {
    if (isImageTransitioning && newImageLoaded && previousImageOpacity === 0) {
      const timeoutId = setTimeout(() => {
        setIsImageTransitioning(false);
        setPreviousImage(null);
        setCurrentImageOpacity(1); // Ensure current is fully visible
        setNewImageLoaded(false);
      }, ANIMATION_DURATION + 150);

      return () => clearTimeout(timeoutId);
    }
  }, [isImageTransitioning, newImageLoaded, previousImageOpacity]);

  // Apple-style smooth image entrance animation on mount
  useEffect(() => {
    if (!imageMounted && imageContainerRef.current && !prefersReducedMotion()) {
      // Initial state: hidden with subtle offset (Apple-style gentle fade)
      imageContainerRef.current.style.opacity = '0';
      imageContainerRef.current.style.transform = 'translateX(10px)'; // More subtle offset

      // Animate in after a refined delay (Apple uses staggered timing)
      const timeoutId = setTimeout(() => {
        setImageMounted(true);
        // Double RAF for smoother animation (Apple technique)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (imageContainerRef.current) {
              imageContainerRef.current.style.opacity = expandedFeature ? '1' : '0.8'; // Slightly brighter default
              imageContainerRef.current.style.transform = 'translateX(0)';
            }
          });
        });
      }, 200); // Slightly longer delay for more refined feel

      return () => clearTimeout(timeoutId);
    }
  }, [imageMounted, expandedFeature]);

  // Apple-style smooth container opacity transitions
  useEffect(() => {
    if (imageMounted && imageContainerRef.current && !prefersReducedMotion()) {
      // Gentle opacity change based on button state
      requestAnimationFrame(() => {
        if (imageContainerRef.current) {
          if (expandedFeature) {
            imageContainerRef.current.style.opacity = '1';
          } else {
            imageContainerRef.current.style.opacity = '0.8'; // Less dimmed for better visibility
          }
          imageContainerRef.current.style.transform = 'translateX(0)';
        }
      });
    }
  }, [expandedFeature, imageMounted]);

  // Measure content width when expanded - simplified for better performance
  useEffect(() => {
    if (expandedIndex === null) return;

    const updateWidths = () => {
      const container = containerRefs.current[expandedIndex];
      if (!container) return;

      const button = container;
      const textContent = button.querySelector(`#feature-content-${expandedIndex}`) as HTMLElement;

      if (textContent && button) {
        // Measure button width with unified text visible
        const buttonWithContentWidth = button.getBoundingClientRect().width;
        const parentWidth = parentContainerRef.current
          ? parentContainerRef.current.getBoundingClientRect().width
          : (button.parentElement?.getBoundingClientRect().width || Infinity);
        const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
        const borderWidth = 2;
        const sectionPadding = 32; // Reduced padding for better space utilization
        const isDesktop = viewportWidth >= 1024;
        // Adjusted image space for optimized layout
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

    // Single requestAnimationFrame for smoother measurement
    const rafId = requestAnimationFrame(() => {
      updateWidths();
    });
    return () => cancelAnimationFrame(rafId);
  }, [expandedIndex, features]);

  // Measure initial button widths and heights on mount for smooth transitions
  useEffect(() => {
    const measureInitialDimensions = () => {
      features.forEach((_, index) => {
        const button = containerRefs.current[index];
        if (button) {
          const rect = button.getBoundingClientRect();

          // Measure width
          if (!initialWidths[index]) {
            setInitialWidths(prev => {
              const newWidths = [...prev];
              if (!newWidths[index]) {
                newWidths[index] = rect.width;
              }
              return newWidths;
            });
          }

          // Measure height for border-radius calculation
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

    // Measure after a short delay to ensure buttons are rendered
    const timeoutId = setTimeout(measureInitialDimensions, 100);
    return () => clearTimeout(timeoutId);
  }, [features, initialWidths, buttonHeights]);

  // Staggered fade-in animation for buttons on initial appearance
  useEffect(() => {
    if (prefersReducedMotion()) {
      // Skip animation if user prefers reduced motion
      setButtonsVisible(new Array(features.length).fill(true));
      return;
    }

    // Trigger staggered fade-in for each button
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

  return (
    <section className="relative bg-transparent py-16 md:py-20">
      {/* Wrapped Container for Better Space Utilization */}
      <div className="mx-auto w-full max-w-[95%] lg:max-w-[92%] xl:max-w-[90%] 2xl:max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            {sectionTitle}
          </h2>
        </div>

        {/* Split Layout: Buttons (Left) + Image (Right) - Optimized for Space */}
        <div
          className="flex flex-col gap-12 lg:flex-row lg:gap-8 xl:gap-12 lg:items-stretch"
          style={{
            contain: 'layout',
          }}
        >
          {/* Left: Feature Buttons - Text content expands inside, horizontally centered relative to image */}
          <div
            ref={parentContainerRef}
            className="flex flex-col flex-shrink-0 lg:max-w-[45%] xl:max-w-[42%] w-full lg:w-auto min-w-0 lg:self-center"
            style={{
              contain: 'layout',
              gap: '0.375rem', // Tighter spacing between buttons for more concise layout
            }}
          >
            {features.map((feature, index) => {
              const isExpanded = expandedIndex === index;
              const isCurrentlyTransitioning = isTransitioning === index;
              const isVisible = buttonsVisible[index] !== false; // Default to true, false only during initial fade-in

              return (
                <button
                  key={feature.title}
                  id={`feature-button-${index}`}
                  ref={el => {
                    containerRefs.current[index] = el;
                    buttonRefs.current[index] = el;
                  }}
                  onClick={() => handleToggle(index)}
                  onMouseEnter={(e) => {
                    if (!isExpanded && !isCurrentlyTransitioning) {
                      e.currentTarget.style.transform = 'translateZ(0) scale(1.02)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isExpanded && !isCurrentlyTransitioning) {
                      e.currentTarget.style.transform = 'translateZ(0) scale(1)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    }
                  }}
                  className="relative flex text-left w-fit border focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible
                      ? 'translateZ(0) scale(1) translateY(0)'
                      : 'translateZ(0) scale(0.98) translateY(10px)', // GPU acceleration + initial fade-in
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    boxSizing: 'border-box',
                    flexShrink: 0,
                    flexGrow: 0,
                    width: isExpanded && containerWidths[index]
                      ? `${containerWidths[index]}px`
                      : initialWidths[index]
                        ? `${initialWidths[index]}px`
                        : 'max-content',
                    // Use maxHeight for smooth transition - allows natural expansion
                    maxHeight: isExpanded
                      ? '1000px' // Large value to allow full content expansion
                      : buttonHeights[index]
                        ? `${buttonHeights[index]}px` // Constrain to collapsed height
                        : '200px', // Fallback for initial render
                    minHeight: buttonHeights[index] ? `${buttonHeights[index]}px` : undefined, // Maintain minimum height
                    minWidth: 0,
                    // CRITICAL: Border-radius MUST transition smoothly from pill to rounded rectangle
                    // The key insight: CSS can interpolate from a reasonable pixel value to 24px
                    // Calculate pill radius from height, but ensure it's a reasonable value for CSS to interpolate
                    borderRadius: (() => {
                      if (isExpanded) {
                        return '24px'; // Rounded rectangle when expanded
                      }
                      if (buttonHeights[index]) {
                        // Pill shape: half of height creates perfect pill
                        // But ensure it's a reasonable value (not too large) for CSS to interpolate smoothly
                        const pillRadius = Math.min(buttonHeights[index] / 2, 50); // Cap at 50px for smooth interpolation
                        return `${Math.round(pillRadius)}px`;
                      }
                      // Use reasonable default (typical button height ~40px, so ~20px radius) instead of 9999px
                      // This allows smooth transition even on first click before height is measured
                      return '20px'; // Reasonable pill radius fallback that CSS can interpolate smoothly
                    })(),
                    // Apple's technique: Proper containment to minimize layout thrashing
                    contain: 'layout style paint',
                    backfaceVisibility: 'hidden',
                    willChange: isCurrentlyTransitioning ? 'width, max-height, border-radius, padding, border-color, background-color, transform, opacity' : 'auto',
                    // CRITICAL: All transitions MUST be synchronized with same duration and easing
                    // Consolidated transition property - handles all states
                    transition: isCurrentlyTransitioning
                      ? `opacity 400ms ${ANIMATION_EASING}, transform ${ANIMATION_DURATION}ms ${ANIMATION_EASING}, width ${ANIMATION_DURATION}ms ${ANIMATION_EASING}, max-height ${ANIMATION_DURATION}ms ${ANIMATION_EASING}, border-radius ${ANIMATION_DURATION}ms ${BORDER_RADIUS_EASING}, padding ${ANIMATION_DURATION}ms ${ANIMATION_EASING}, border-color ${ANIMATION_DURATION}ms ${ANIMATION_EASING}, background-color ${ANIMATION_DURATION}ms ${ANIMATION_EASING}`
                      : isVisible
                        ? `opacity 400ms ${ANIMATION_EASING}, transform 400ms ${ANIMATION_EASING}, border-radius ${ANIMATION_DURATION}ms ${BORDER_RADIUS_EASING}, border-color 200ms ${ANIMATION_EASING}, background-color 200ms ${ANIMATION_EASING}`
                        : `opacity 400ms ${ANIMATION_EASING}, transform 400ms ${ANIMATION_EASING}`,
                    borderColor: isExpanded ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.12)',
                    borderWidth: '1px',
                    backgroundColor: isExpanded ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    padding: isExpanded ? '0.75rem 1rem' : '0.625rem 0.875rem', // More concise padding
                    overflow: 'hidden', // Ensure text doesn't overflow button boundaries
                    // Allow natural height expansion when expanded
                    height: isExpanded ? 'auto' : undefined,
                  }}
                  aria-expanded={isExpanded}
                  aria-controls={`feature-content-${index}`}
                >
                  {/* Unified Text Label - Apple style: Title (bold when expanded) + Description */}
                  <span
                    id={`feature-content-${index}`}
                    ref={el => {
                      contentRefs.current[index] = el;
                    }}
                    className="text-left text-sm md:text-base"
                    style={{
                      whiteSpace: isExpanded ? 'normal' : 'nowrap',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word',
                      maxWidth: '100%',
                      width: '100%', // Ensure text container takes full available width
                      minWidth: 0, // Allow text to shrink if needed
                      flexShrink: 1, // Allow text to shrink to fit
                      lineHeight: '1.5',
                      opacity: 1,
                      transform: 'translateZ(0)',
                      // No transition needed here - child elements handle their own transitions
                    }}
                  >
                    {/* Title - always visible, becomes bold when expanded */}
                    <span
                      className={isExpanded ? 'font-semibold text-white text-base md:text-lg' : 'text-white/90 font-medium text-sm md:text-base'}
                      style={{
                        display: 'inline-block',
                        opacity: 1,
                        transform: 'translateZ(0)',
                        transition: isCurrentlyTransitioning
                          ? `font-weight ${ANIMATION_DURATION}ms ${ANIMATION_EASING}, color ${ANIMATION_DURATION}ms ${ANIMATION_EASING}, font-size ${ANIMATION_DURATION}ms ${ANIMATION_EASING}`
                          : 'none',
                      }}
                    >
                      {feature.title}
                      {isExpanded && '.'}
                    </span>
                    {/* Description - Apple-style smooth reveal, always in DOM for smooth transition */}
                    <span
                      className="text-gray-300 text-sm md:text-base"
                      style={{
                        display: 'inline-block', // Always in DOM for smooth transition
                        marginLeft: isExpanded ? '0.25rem' : '0',
                        whiteSpace: isExpanded ? 'normal' : 'nowrap',
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word',
                        // Zero width when collapsed - no layout impact
                        maxWidth: isExpanded ? '1000px' : '0px',
                        overflow: 'hidden',
                        // Smooth fade-in synchronized with button expansion (no delay)
                        opacity: isExpanded ? 1 : 0,
                        transform: 'translateZ(0)', // GPU acceleration
                        // Synchronized transitions: max-width and opacity use same duration/easing as button
                        transition: isCurrentlyTransitioning
                          ? `max-width ${ANIMATION_DURATION}ms ${ANIMATION_EASING}, opacity ${ANIMATION_DURATION}ms ${ANIMATION_EASING}, margin-left ${ANIMATION_DURATION}ms ${ANIMATION_EASING}`
                          : 'none',
                        verticalAlign: 'baseline',
                        willChange: isCurrentlyTransitioning ? 'max-width, opacity' : 'auto',
                        pointerEvents: isExpanded ? 'auto' : 'none',
                      }}
                    >
                      {feature.description}
                    </span>
                  </span>

                  {/* Plus/X Icon - Apple style (rotates to X when expanded, positioned after text) */}
                  <div
                    className="flex-shrink-0 ml-1.5"
                    style={{
                      transform: isExpanded ? 'rotate(45deg)' : 'rotate(0deg)',
                      transition: `transform ${ANIMATION_DURATION}ms ${ANIMATION_EASING}`,
                    }}
                  >
                    <Plus className="h-4 w-4 text-white md:h-5 md:w-5" aria-hidden={true} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Image that flies in from the right - always visible, optimized for space */}
          <div className="lg:sticky lg:top-24 lg:flex-1 lg:min-w-[55%] lg:max-w-[60%] xl:min-w-[58%] xl:max-w-[65%] lg:z-10 w-full flex items-stretch">
            <div
              ref={imageContainerRef}
              className="relative rounded-3xl bg-[#1f1f1f]/40 shadow-xl shadow-black/20 w-full flex-1 overflow-hidden"
              style={{
                height: containerHeight ? `${containerHeight}px` : undefined,
                minHeight: containerHeight
                  ? (typeof window !== 'undefined' && window.innerWidth >= 1024 ? `${Math.min(containerHeight, 500)}px` : '450px')
                  : '450px',
                maxHeight: containerHeight && typeof window !== 'undefined' && window.innerWidth >= 1024
                  ? `${Math.max(containerHeight, 800)}px`
                  : undefined,
                opacity: prefersReducedMotion()
                  ? (expandedFeature ? 1 : 0.8)
                  : imageMounted
                    ? (expandedFeature ? 1 : 0.8)
                    : 0, // Start hidden for smooth entrance
                transform: prefersReducedMotion()
                  ? 'translateX(0)'
                  : imageMounted
                    ? 'translateX(0)'
                    : 'translateX(10px)', // More subtle offset (Apple-style)
                border: '1px solid rgba(255, 255, 255, 0.08)',
                // Apple-style smoother transitions with longer duration for elegance
                transition: prefersReducedMotion()
                  ? 'none'
                  : `opacity ${ANIMATION_DURATION + 100}ms ${ANIMATION_EASING}, transform ${ANIMATION_DURATION + 100}ms ${ANIMATION_EASING}, height ${ANIMATION_DURATION + 100}ms ${ANIMATION_EASING}`,
                willChange: prefersReducedMotion() ? 'auto' : 'opacity, transform, height',
              }}
            >
              {/* Image Container with Cross-Fade - Full Height */}
              <div className="relative w-full h-full bg-[#0a0a0a] overflow-hidden">
                {/* Vignette Overlay - Previous Image */}
                {previousImage && isImageTransitioning && (
                  <div
                    className="absolute inset-0 z-20 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.2) 70%, rgba(0, 0, 0, 0.4) 90%, rgba(0, 0, 0, 0.6) 100%)`,
                      opacity: previousImageOpacity,
                      transition: `opacity ${ANIMATION_DURATION + 200}ms ${ANIMATION_EASING}`,
                    }}
                  />
                )}

                {/* Vignette Overlay - Current Image */}
                {currentImage && (
                  <div
                    className="absolute inset-0 z-20 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.2) 70%, rgba(0, 0, 0, 0.4) 90%, rgba(0, 0, 0, 0.6) 100%)`,
                      opacity: imageMounted ? currentImageOpacity : 0,
                      transition: `opacity ${ANIMATION_DURATION + 200}ms ${ANIMATION_EASING}`,
                    }}
                  />
                )}

                {/* Previous Image - Fading Out */}
                {previousImage && isImageTransitioning && (
                  <div className="absolute inset-0 z-10" style={{ opacity: previousImageOpacity, transition: `opacity ${ANIMATION_DURATION + 200}ms ${ANIMATION_EASING}` }}>
                    <Image
                      src={previousImage.screenshot}
                      alt={previousImage.screenshotAlt}
                      width={1200}
                      height={800}
                      className="h-full w-full object-cover object-center"
                      style={{
                        maskImage: 'radial-gradient(ellipse 95% 95% at center, black 85%, transparent 100%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 95% 95% at center, black 85%, transparent 100%)',
                        willChange: 'opacity',
                      }}
                      quality={90}
                    />
                  </div>
                )}
                {/* Current Image - Fading In */}
                {currentImage && (
                  <div
                    className={previousImage && isImageTransitioning ? 'absolute inset-0 z-10' : 'h-full w-full z-10'}
                    style={{
                      opacity: imageMounted ? currentImageOpacity : 0,
                      transition: `opacity ${ANIMATION_DURATION + 200}ms ${ANIMATION_EASING}`,
                      willChange: isImageTransitioning ? 'opacity' : 'auto',
                    }}
                  >
                    <Image
                      src={currentImage.screenshot}
                      alt={currentImage.screenshotAlt}
                      width={1200}
                      height={800}
                      className="h-full w-full object-cover object-center"
                      style={{
                        maskImage: 'radial-gradient(ellipse 95% 95% at center, black 85%, transparent 100%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 95% 95% at center, black 85%, transparent 100%)',
                      }}
                      quality={90}
                      priority={true}
                      onLoad={(e) => {
                        // Get image dimensions for container sizing
                        const img = e.currentTarget;
                        if (img.naturalWidth && img.naturalHeight) {
                          setImageDimensions({
                            width: img.naturalWidth,
                            height: img.naturalHeight,
                          });
                        }

                        // Ensure image is marked as loaded when Next.js Image component loads it
                        if (!newImageLoaded && isImageTransitioning) {
                          setNewImageLoaded(true);
                          requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                              setPreviousImageOpacity(0);
                              setCurrentImageOpacity(1);
                            });
                          });
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
