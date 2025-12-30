import { useEffect, useState } from 'react';

/**
 * Banner text mapping for seasonal effects
 */
function getBannerText(effect: string | null): string | null {
  if (!effect) return null;
  const banners: Record<string, string> = {
    lightsaber: 'May the 4th be with you',
    toque: "Happy Chef's Day! 👨‍🍳",
    santaHat: 'Merry Chaosmas, Chef! 🎅',
    newYear: 'Happy New Year! 🎉',
    australiaDay: 'Happy Australia Day! 🇦🇺',
    valentines: "Happy Valentine's Day! 💝",
    anzac: 'Lest We Forget 🇦🇺🇳🇿',
    easter: 'Happy Easter! 🐰',
    independenceDay: 'Happy 4th of July! 🇺🇸',
    halloween: 'Happy Halloween! 🎃',
    boxingDay: 'Happy Boxing Day! 🎁',
    newYearsEve: "Happy New Year's Eve! 🥳",
    mothersDay: "Happy Mother's Day! 💐",
    fathersDay: "Happy Father's Day! 👔",
    labourDay: 'Happy Labour Day! 🛠️',
    royalBirthday: "Happy [King's/Queen's] Birthday! 👑",
  };
  return banners[effect] || null;
}

/**
 * Banner color mapping for seasonal effects
 */
function getBannerColor(effect: string | null): string {
  if (!effect) return '#FFE81F';
  const colors: Record<string, string> = {
    lightsaber: '#FFE81F',
    toque: '#FFD700',
    santaHat: '#DC2626',
    newYear: '#FFD700',
    australiaDay: '#006633',
    valentines: '#FF1493',
    anzac: '#8B0000',
    easter: '#FFB6C1',
    independenceDay: '#DC2626',
    halloween: '#FF8C00',
    boxingDay: '#FFD700',
    newYearsEve: '#FFD700',
    mothersDay: '#FF1493',
    fathersDay: '#00308F',
    labourDay: '#FF8C00',
    royalBirthday: '#8A2BE2',
  };
  return colors[effect] || '#FFE81F';
}

/**
 * Hook for managing seasonal effects
 */
export function useSeasonalEffects() {
  const [seasonalEffect, setSeasonalEffect] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkSeasonal = () => {
      const seasonal = document.documentElement.getAttribute('data-seasonal');
      setSeasonalEffect(seasonal);
    };

    checkSeasonal();

    // Listen for changes to data-seasonal attribute
    const observer = new MutationObserver(() => {
      checkSeasonal();
    });

    const target = document.documentElement;
    if (target) {
      observer.observe(target, {
        attributes: true,
        attributeFilter: ['data-seasonal'],
      });
    }

    return () => observer.disconnect();
  }, []);

  return {
    seasonalEffect,
    bannerText: getBannerText(seasonalEffect),
    bannerColor: getBannerColor(seasonalEffect),
  };
}
