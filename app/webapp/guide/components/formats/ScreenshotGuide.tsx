import type { ScreenshotContent } from '../../data/guide-types';
import { ScreenshotAnnotations } from './components/ScreenshotAnnotations';
import { ScreenshotHotspots } from './components/ScreenshotHotspots';
import { ScreenshotImage } from './components/ScreenshotImage';

interface ScreenshotGuideProps {
  content: ScreenshotContent;
  className?: string;
}

export function ScreenshotGuide({ content, className = '' }: ScreenshotGuideProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Screenshot container */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
        <ScreenshotImage src={content.image} />
        <ScreenshotAnnotations annotations={content.annotations} />
        <ScreenshotHotspots hotspots={content.hotspots} />
      </div>
    </div>
  );
}
