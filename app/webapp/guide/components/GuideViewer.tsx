/**
 * Main guide viewer component.
 * Switches between different guide formats based on step content.
 */

'use client';

import { Suspense, lazy } from 'react';
import { GuideControls } from './GuideControls';
import { ScreenshotGuide } from './formats/ScreenshotGuide';
import { InteractiveDemo } from './formats/InteractiveDemo';
import { VideoGuide } from './formats/VideoGuide';
import { HybridGuide } from './formats/HybridGuide';
import type { GuideStep } from '../data/guide-types';

// Lazy load Three.js components (not currently used but kept for future use)
const ThreeJSGuide = lazy(() =>
  import('./formats/ThreeJSGuide').then(m => ({ default: m.ThreeJSGuide })),
);

interface GuideViewerProps {
  step: GuideStep;
  onPrevious: () => void;
  onNext: () => void;
  onComplete?: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number;
}

export function GuideViewer({
  step,
  onPrevious,
  onNext,
  onComplete,
  isFirstStep,
  isLastStep,
  progress,
}: GuideViewerProps) {
  const renderContent = () => {
    switch (step.format) {
      case 'screenshot':
        if (step.content.screenshot) {
          return <ScreenshotGuide content={step.content.screenshot} />;
        }
        break;
      case 'interactive':
        if (step.content.interactive) {
          return <InteractiveDemo content={step.content.interactive} />;
        }
        break;
      case 'video':
        if (step.content.video) {
          return <VideoGuide content={step.content.video} />;
        }
        break;
      case 'threejs':
        if (step.content.threejs) {
          return (
            <Suspense
              fallback={
                <div className="flex h-96 items-center justify-center rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f]">
                  <div className="text-center text-gray-400">Loading 3D simulation...</div>
                </div>
              }
            >
              <ThreeJSGuide content={step.content.threejs} />
            </Suspense>
          );
        }
        break;
      case 'hybrid':
        return <HybridGuide content={step.content} />;
      default:
        return (
          <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-8 text-center text-gray-400">
            Unknown guide format
          </div>
        );
    }
    return (
      <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-8 text-center text-gray-400">
        Content not available for this step
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Step header */}
      <div className="space-y-2">
        <h2 className="text-fluid-2xl font-semibold text-white">{step.title}</h2>
        <p className="text-fluid-base text-gray-300">{step.description}</p>
      </div>

      {/* Step content */}
      <Suspense
        fallback={
          <div className="flex h-96 items-center justify-center rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f]">
            <div className="animate-pulse text-gray-400">Loading guide content...</div>
          </div>
        }
      >
        {renderContent()}
      </Suspense>

      {/* Navigation controls */}
      <GuideControls
        onPrevious={onPrevious}
        onNext={onNext}
        onComplete={onComplete}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        progress={progress}
      />
    </div>
  );
}
