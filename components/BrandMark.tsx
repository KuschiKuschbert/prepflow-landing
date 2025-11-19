// PrepFlow Personality System - BrandMark Component with Seasonal Overlays

'use client';

import OptimizedImage from '@/components/OptimizedImage';
import { checkSeasonalMatch } from '@/lib/personality/utils';
import { useEffect, useState } from 'react';

interface BrandMarkProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchEnd?: (e: React.TouchEvent) => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  onMouseLeave?: () => void;
}

export function BrandMark({
  src = '/images/prepflow-logo.svg',
  alt = 'PrepFlow Logo',
  width = 24,
  height = 24,
  className = '',
  onClick,
  onTouchStart,
  onTouchEnd,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
}: BrandMarkProps) {
  const [seasonalEffect, setSeasonalEffect] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const effect = checkSeasonalMatch();
    setSeasonalEffect(effect);
    if (effect) {
      document.documentElement.setAttribute('data-seasonal', effect);
    }
  }, []);

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden ${className}`}
    >
      <div
        onClick={onClick}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        className="relative z-10 h-full w-full"
      >
        <OptimizedImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="24px"
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
      </div>
      {/* Seasonal overlays rendered via CSS based on data-seasonal attribute */}
      {seasonalEffect && (
        <div className={`pf-seasonal-overlay pf-seasonal-${seasonalEffect}`} aria-hidden="true" />
      )}
    </div>
  );
}
