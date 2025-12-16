/**
 * Screenshot-based guide component.
 * Displays annotated screenshots with interactive hotspots and arrow annotations.
 */

'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Image as ImageIcon } from 'lucide-react';
import type { ScreenshotContent } from '../../data/guide-types';

interface ScreenshotGuideProps {
  content: ScreenshotContent;
  className?: string;
}

export function ScreenshotGuide({ content, className = '' }: ScreenshotGuideProps) {
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {/* Screenshot container */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
        {/* Image */}
        <div className="relative aspect-video w-full">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 animate-pulse bg-[var(--muted)]" aria-hidden={true} />
          )}
          {imageError ? (
            // Placeholder when image fails to load
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#1f1f1f] to-[var(--muted)] p-8">
              <Icon icon={ImageIcon} size="xl" className="mb-4 text-[var(--foreground-subtle)]" aria-hidden={true} />
              <p className="text-sm text-[var(--foreground-muted)]">Screenshot coming soon</p>
              <p className="mt-2 text-xs text-[var(--foreground-subtle)]">
                This guide step will include a visual walkthrough
              </p>
            </div>
          ) : (
            <Image
              src={content.image}
              alt="Guide screenshot"
              fill
              className="object-contain"
              onLoad={() => {
                setImageLoaded(true);
                setImageError(false);
              }}
              onError={() => {
                setImageError(true);
                setImageLoaded(false);
              }}
              priority
              unoptimized
            />
          )}
        </div>

        {/* Annotations - Show even when image fails */}
        {content.annotations && content.annotations.length > 0 && (
          <div className="pointer-events-none absolute inset-0">
            {content.annotations.map((annotation, index) => (
              <div
                key={`annotation-${index}`}
                className="absolute"
                style={{
                  left: `${annotation.x}%`,
                  top: `${annotation.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 20,
                }}
              >
                {/* Arrow */}
                {annotation.arrow && (
                  <div
                    className={`absolute ${
                      annotation.arrow === 'up'
                        ? 'bottom-full mb-2'
                        : annotation.arrow === 'down'
                          ? 'top-full mt-2'
                          : annotation.arrow === 'left'
                            ? 'right-full mr-2'
                            : 'left-full ml-2'
                    }`}
                    style={{
                      ...(annotation.arrow === 'up' || annotation.arrow === 'down'
                        ? { left: '50%', transform: 'translateX(-50%)' }
                        : { top: '50%', transform: 'translateY(-50%)' }),
                    }}
                  >
                    <div
                      className={`h-0 w-0 border-4 ${
                        annotation.arrow === 'up'
                          ? 'border-t-transparent border-r-transparent border-b-[#29E7CD] border-l-transparent'
                          : annotation.arrow === 'down'
                            ? 'border-t-[#29E7CD] border-r-transparent border-b-transparent border-l-transparent'
                            : annotation.arrow === 'left'
                              ? 'border-t-transparent border-r-[#29E7CD] border-b-transparent border-l-transparent'
                              : 'border-t-transparent border-r-transparent border-b-transparent border-l-[#29E7CD]'
                      }`}
                    />
                  </div>
                )}

                {/* Annotation text */}
                <div className="rounded-2xl border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-2 text-sm text-[var(--foreground)] backdrop-blur-sm">
                  {annotation.text}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hotspots - Show even when image fails */}
        {content.hotspots && content.hotspots.length > 0 && (
          <div className="absolute inset-0">
            {content.hotspots.map((hotspot, index) => (
              <button
                key={`hotspot-${index}`}
                type="button"
                className="absolute rounded-full border-2 border-[var(--primary)] bg-[var(--primary)]/20 transition-all hover:scale-110 hover:bg-[var(--primary)]/30"
                style={{
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`,
                  width: `${hotspot.radius * 2}px`,
                  height: `${hotspot.radius * 2}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => setActiveHotspot(activeHotspot === index ? null : index)}
                aria-label={`Hotspot ${index + 1}`}
              >
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[var(--primary)]">
                  {index + 1}
                </span>
                {activeHotspot === index && (
                  <div
                    className="absolute bottom-full left-1/2 mb-2 w-64 -translate-x-1/2 rounded-2xl border border-[var(--primary)]/30 bg-[var(--surface)] p-4 text-sm text-[var(--foreground)] shadow-xl"
                    style={{ zIndex: 10 }}
                  >
                    {hotspot.info}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
