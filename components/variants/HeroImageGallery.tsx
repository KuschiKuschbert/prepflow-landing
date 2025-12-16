// PrepFlow - Hero Image Gallery Component
// Extracted from HeroVariants.tsx to meet file size limits

'use client';

import OptimizedImage from '../OptimizedImage';

interface HeroImageGalleryProps {
  gradientFrom?: string;
  gradientTo?: string;
  overlayTitle?: string;
  overlayBg?: string;
  overlayText?: string;
}

export function HeroImageGallery({
  gradientFrom = '#29E7CD',
  gradientTo = '#D925C7',
  overlayTitle = 'Live GP% Dashboard',
  overlayBg = '#29E7CD',
  overlayText = 'black',
}: HeroImageGalleryProps) {
  return (
    <div className="relative">
      <div
        className="absolute -inset-6 -z-10 rounded-3xl blur-2xl"
        style={{
          background: `linear-gradient(to bottom right, ${gradientFrom}/20, ${gradientTo}/20)`,
        }}
      />
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)]/80 p-6 shadow-2xl backdrop-blur-sm">
        <div className="relative">
          <OptimizedImage
            src="/images/dashboard-screenshot.png"
            alt="PrepFlow Dashboard showing COGS metrics, profit analysis, and item performance charts"
            width={800}
            height={500}
            className="h-auto w-full rounded-xl border border-[var(--border)]"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
          />
          {/* Action Overlay */}
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40">
            <div className="text-center text-[var(--foreground)]">
              <div
                className="mb-2 rounded-lg px-4 py-2 font-semibold"
                style={{ background: overlayBg, color: overlayText }}
              >
                {overlayTitle}
              </div>
              <button className="rounded-lg bg-[var(--qr-background)] px-6 py-3 font-semibold text-[var(--primary-text)] transition-colors hover:bg-gray-100">
                View Dashboard
              </button>
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4">
          <OptimizedImage
            src="/images/settings-screenshot.png"
            alt="PrepFlow Settings page with business configuration"
            width={200}
            height={96}
            className="h-24 w-full rounded-lg border border-[var(--border)] object-cover"
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 16vw, 12vw"
          />
          <OptimizedImage
            src="/images/cogs-calculator-screenshot.png"
            alt="PrepFlow Recipe costing for Double Cheese Burger"
            width={200}
            height={96}
            className="h-24 w-full rounded-lg border border-[var(--border)] object-cover"
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 16vw, 12vw"
          />
          <OptimizedImage
            src="/images/ingredients-management-screenshot.png"
            alt="PrepFlow Infinite Stock List with ingredient management"
            width={200}
            height={96}
            className="h-24 w-full rounded-lg border border-[var(--border)] object-cover"
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 16vw, 12vw"
          />
        </div>
        <p className="text-fluid-sm mt-4 text-center text-[var(--foreground-subtle)]">
          Dashboard · Settings · Recipe Costing · Stock Management
        </p>
      </div>
    </div>
  );
}
