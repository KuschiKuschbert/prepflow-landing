/**
 * Three.js viewer implementation (stub - Three.js removed for bundle size optimization).
 * This component is kept for future use but currently shows a placeholder.
 */

'use client';

import type { ThreeJSContent } from '../../data/guide-types';

interface ThreeJSViewerProps {
  content: ThreeJSContent;
}

/**
 * Stub component for Three.js viewer.
 * Three.js has been removed to reduce bundle size (~872KB savings).
 * To re-enable: reinstall three, @react-three/fiber, @react-three/drei
 */
export default function ThreeJSViewer({ content: _content }: ThreeJSViewerProps) {
  return (
    <div className="flex h-96 items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="text-center">
        <div className="mb-4 text-4xl">🎨</div>
        <p className="text-lg font-semibold text-[var(--foreground)]">3D Viewer Unavailable</p>
        <p className="mt-2 text-sm text-[var(--foreground-muted)]">
          Three.js has been removed to optimize bundle size.
        </p>
        <p className="mt-1 text-xs text-[var(--foreground-subtle)]">
          This feature can be re-enabled if needed in the future.
        </p>
      </div>
    </div>
  );
}
