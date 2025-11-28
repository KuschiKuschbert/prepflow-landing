import { useState, useEffect } from 'react';
import { loadImage } from './imageTransitions/helpers/loadImage';

interface Feature {
  title: string;
  description: string;
  screenshot: string;
  screenshotAlt: string;
}

const ANIMATION_DURATION = 500;

export function useImageTransitions(displayFeature: Feature, imageMounted: boolean) {
  const [currentImage, setCurrentImage] = useState<Feature | null>(null);
  const [previousImage, setPreviousImage] = useState<Feature | null>(null);
  const [isImageTransitioning, setIsImageTransitioning] = useState(false);
  const [previousImageOpacity, setPreviousImageOpacity] = useState(1);
  const [currentImageOpacity, setCurrentImageOpacity] = useState(1);
  const [newImageLoaded, setNewImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(
    null,
  );

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

      loadImage(
        newImage.screenshot,
        dimensions => {
          if (dimensions) {
            setImageDimensions(dimensions);
          }
          setNewImageLoaded(true);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setCurrentImage(newImage);
              setTimeout(() => {
                setPreviousImageOpacity(0);
                setCurrentImageOpacity(1);
              }, 50);
            });
          });
        },
        () => {
          setNewImageLoaded(true);
          setCurrentImage(newImage);
          setTimeout(() => {
            setPreviousImageOpacity(0);
            setCurrentImageOpacity(1);
          }, 50);
        },
      );
    } else if (!currentImage) {
      setCurrentImage(newImage);
      setCurrentImageOpacity(1);
      setNewImageLoaded(true);
      loadImage(newImage.screenshot, dimensions => {
        if (dimensions) {
          setImageDimensions(dimensions);
        }
      });
    }
  }, [displayFeature, imageMounted, currentImage]);

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

  return {
    currentImage,
    previousImage,
    isImageTransitioning,
    previousImageOpacity,
    currentImageOpacity,
    imageDimensions,
    setImageDimensions,
    setNewImageLoaded,
  };
}
