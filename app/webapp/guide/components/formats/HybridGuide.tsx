/**
 * Hybrid guide component.
 * Combines multiple guide formats in a single step.
 */

'use client';

import { Suspense, lazy } from 'react';
import { ScreenshotGuide } from './ScreenshotGuide';
import { InteractiveDemo } from './InteractiveDemo';
import { VideoGuide } from './VideoGuide';
import type { GuideContent } from '../../data/guide-types';

// Lazy load Three.js components (not currently used but kept for future use)
const ThreeJSGuide = lazy(() => import('./ThreeJSGuide').then(m => ({ default: m.ThreeJSGuide })));

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
      {content.threejs && (
        <Suspense
          fallback={
            <div className="flex h-96 items-center justify-center rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f]">
              <div className="text-center text-gray-400">Loading 3D simulation...</div>
            </div>
          }
        >
          <ThreeJSGuide content={content.threejs} />
        </Suspense>
      )}
    </div>
  );
}


