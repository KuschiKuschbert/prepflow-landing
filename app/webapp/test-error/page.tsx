'use client';

/**
 * Test page for error messages
 * Navigate to /webapp/test-error to see the error message components
 *
 * Note: Next.js dev overlay intercepts errors in development.
 * To see the actual error messages, either:
 * 1. Use the preview buttons below to see components directly
 * 2. Build for production and test there
 * 3. Use browser console to trigger errors in production build
 */

import { Icon } from '@/components/ui/Icon';
import { Flame, Train } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamically import error components
const KitchenOnFire = dynamic(() => import('@/components/ErrorGame/KitchenOnFire'), {
  ssr: false,
});

const TrainOffTrack = dynamic(() => import('@/components/ErrorGame/TrainOffTrack'), {
  ssr: false,
});

export default function TestErrorPage() {
  const [previewMode, setPreviewMode] = useState<'none' | 'kitchen-fire' | 'train-off-track'>(
    'none',
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
        <h1 className="mb-4 text-2xl font-bold text-[var(--foreground)]">Error Message Test</h1>
        <p className="mb-6 text-[var(--foreground-muted)]">
          Preview the error message components directly. In development, Next.js dev overlay
          intercepts errors, so use these previews to see the components.
        </p>

        <div className="mb-6 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setPreviewMode('kitchen-fire')}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-[var(--primary)]/20 hover:shadow-lg"
          >
            <Icon icon={Flame} size="md" aria-hidden={true} />
            Preview Kitchen Fire
          </button>
          <button
            onClick={() => setPreviewMode('train-off-track')}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-[var(--primary)]/20 hover:shadow-lg"
          >
            <Icon icon={Train} size="md" aria-hidden={true} />
            Preview Train Off Track
          </button>
          <button
            onClick={() => setPreviewMode('none')}
            className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 px-6 py-3 font-semibold text-[var(--foreground)] transition-all duration-200 hover:bg-[var(--muted)]/60"
          >
            Close Preview
          </button>
        </div>

        <div className="mt-4 text-sm text-[var(--foreground-muted)]">
          <p className="mb-2">
            <strong>To test actual error handling:</strong>
          </p>
          <ol className="list-inside list-decimal space-y-1 text-left">
            <li>
              Build for production:{' '}
              <code className="rounded bg-[var(--muted)] px-1">npm run build</code>
            </li>
            <li>
              Start production server:{' '}
              <code className="rounded bg-[var(--muted)] px-1">npm start</code>
            </li>
            <li>Navigate to any page and trigger an error</li>
            <li>
              Or use browser console:{' '}
              <code className="rounded bg-[var(--muted)] px-1">
                throw new Error(&apos;test&apos;)
              </code>
            </li>
          </ol>
        </div>
      </div>

      {/* Preview overlays */}
      {previewMode === 'kitchen-fire' && (
        <div className="fixed inset-0 z-[80]">
          <KitchenOnFire />
        </div>
      )}

      {previewMode === 'train-off-track' && (
        <div className="fixed inset-0 z-[80]">
          <TrainOffTrack />
        </div>
      )}
    </div>
  );
}
