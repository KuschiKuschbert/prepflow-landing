import { getPrefersReducedMotion } from '@/lib/utils/motion';
import { useEffect } from 'react';

interface Feature {
  title: string;
  description: string;
  screenshot: string;
  screenshotAlt: string;
}

const STAGGER_DELAY = 30;

export function useImageEntranceAnimation(
  imageMounted: boolean,
  imageContainerRef: React.RefObject<HTMLDivElement | null>,
  expandedFeature: Feature | null,
  setImageMounted: (mounted: boolean) => void,
) {
  useEffect(() => {
    if (!imageMounted && imageContainerRef.current && !getPrefersReducedMotion()) {
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
  }, [imageMounted, imageContainerRef, expandedFeature, setImageMounted]);
}

export function useContainerOpacityAnimation(
  imageMounted: boolean,
  imageContainerRef: React.RefObject<HTMLDivElement | null>,
  expandedFeature: Feature | null,
) {
  useEffect(() => {
    if (imageMounted && imageContainerRef.current && !getPrefersReducedMotion()) {
      requestAnimationFrame(() => {
        if (imageContainerRef.current) {
          imageContainerRef.current.style.opacity = expandedFeature ? '1' : '0.8';
          imageContainerRef.current.style.transform = 'translateX(0)';
        }
      });
    }
  }, [expandedFeature, imageMounted, imageContainerRef]);
}

export function useStaggeredButtonAnimation(
  features: Feature[],
  setButtonsVisible: React.Dispatch<React.SetStateAction<boolean[]>>,
) {
  useEffect(() => {
    if (getPrefersReducedMotion()) {
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
  }, [features, setButtonsVisible]);
}
