/**
 * Hybrid guide component.
 * Combines multiple guide formats in a single step.
 */

'use client';

import { ScreenshotGuide } from './ScreenshotGuide';
import { InteractiveDemo } from './InteractiveDemo';
import { VideoGuide } from './VideoGuide';
import { ThreeJSGuide } from './ThreeJSGuide';
import type { GuideContent } from '../../data/guide-types';

interface HybridGuideProps {
  content: GuideContent;
  className?: string;
}

export function HybridGuide({ content, className = '' }: HybridGuideProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Render all available content formats */}
      {content.screenshot && <ScreenshotGuide content={content.screenshot} />}
      {content.video && <VideoGuide content={content.video} />}
      {content.interactive && <InteractiveDemo content={content.interactive} />}
      {content.threejs && <ThreeJSGuide content={content.threejs} />}
    </div>
  );
}
