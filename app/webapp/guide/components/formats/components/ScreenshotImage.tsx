'use client';

import { Icon } from '@/components/ui/Icon';
import { Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface ScreenshotImageProps {
  src: string;
}

export function ScreenshotImage({ src }: ScreenshotImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative aspect-video w-full">
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 animate-pulse bg-[var(--muted)]" aria-hidden={true} />
      )}
      {imageError ? (
        // Placeholder when image fails to load
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#1f1f1f] to-[var(--muted)] p-8">
          <Icon
            icon={ImageIcon}
            size="xl"
            className="mb-4 text-[var(--foreground-subtle)]"
            aria-hidden={true}
          />
          <p className="text-sm text-[var(--foreground-muted)]">Screenshot coming soon</p>
          <p className="mt-2 text-xs text-[var(--foreground-subtle)]">
            This guide step will include a visual walkthrough
          </p>
        </div>
      ) : (
        <Image
          src={src}
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
  );
}
