import { useState } from 'react';
import type { ScreenshotContent } from '../../../data/guide-types';

interface ScreenshotHotspotsProps {
  hotspots: ScreenshotContent['hotspots'];
}

export function ScreenshotHotspots({ hotspots }: ScreenshotHotspotsProps) {
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  if (!hotspots || hotspots.length === 0) return null;

  return (
    <div className="absolute inset-0">
      {hotspots.map((hotspot, index) => (
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
  );
}
