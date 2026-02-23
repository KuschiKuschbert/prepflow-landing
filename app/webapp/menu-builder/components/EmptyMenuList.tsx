'use client';

import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { InlineHint } from '@/components/ui/InlineHint';
import { RescueNudge } from '@/components/ui/RescueNudge';
import { Button } from '@/components/ui/Button';
import { FileText, Plus } from 'lucide-react';

interface EmptyMenuListProps {
  onCreateClick?: () => void;
}

/**
 * Empty state component for when no menus exist.
 *
 * @component
 * @param {EmptyMenuListProps} props - Component props
 * @param {() => void} [props.onCreateClick] - Callback when user clicks create
 * @returns {JSX.Element} Empty menu list message
 */
export function EmptyMenuList({ onCreateClick }: EmptyMenuListProps) {
  return (
    <div className="space-y-6">
      <RescueNudge pageKey="menu-builder" guideId="menu-builder" guideStepIndex={0} />
      <EmptyState
        title="Your first menu is one click away"
        message="Create a menu to organize your dishes into sections. Drag and drop from your recipe collection into menu categories."
        icon={FileText}
        actions={
          <div className="flex flex-col items-center gap-3">
            {onCreateClick && (
              <>
                <Button
                  onClick={onCreateClick}
                  variant="primary"
                  landingStyle={true}
                  className="flex items-center gap-2"
                >
                  <Icon icon={Plus} size="sm" aria-hidden />
                  Create your first menu
                </Button>
                <InlineHint context="menu-builder">
                  Start here—create a menu to organize your dishes
                </InlineHint>
              </>
            )}
            <div className="mx-auto max-w-md rounded-lg border border-[var(--border)] bg-[var(--surface)]/50 p-4 text-left">
              <p className="mb-2 text-sm text-[var(--foreground-secondary)]">
                <strong>Tip:</strong> Before creating a menu, make sure you have:
              </p>
              <ul className="ml-6 list-disc space-y-1 text-sm text-[var(--foreground-muted)]">
                <li>Created some dishes in the Dishes tab</li>
                <li>Or linked recipes to dishes</li>
              </ul>
            </div>
          </div>
        }
        useLandingStyles={true}
        variant="landing"
        animated={true}
      />
    </div>
  );
}
