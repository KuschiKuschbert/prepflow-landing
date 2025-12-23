/**
 * Three.js 3D guide component.
 * Displays 3D interactive simulations (lazy loaded for performance).
 */

'use client';

import { Suspense, lazy } from 'react';
import type { ThreeJSContent } from '../../data/guide-types';

// Lazy load Three.js components to reduce initial bundle size
const ThreeJSViewer = lazy(() => import('./ThreeJSViewer'));

interface ThreeJSGuideProps {
  content: ThreeJSContent;
  className?: string;
}

export function ThreeJSGuide({ content, className = '' }: ThreeJSGuideProps) {
  return (
    <div className={`relative ${className}`}>
      <Suspense
        fallback={
          <div className="flex h-96 items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
            <div className="text-center">
              <div className="mb-4 animate-spin text-4xl">🎨</div>
              <p className="text-[var(--foreground-muted)]">Loading 3D simulation...</p>
              <p className="mt-2 text-xs text-[var(--foreground-subtle)]">
                This may take a moment on slower connections
              </p>
            </div>
          </div>
        }
      >
        <ThreeJSViewer content={content} />
      </Suspense>
    </div>
  );
}




