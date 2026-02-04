import { Icon } from '@/components/ui/Icon';
import { MousePointerClick } from 'lucide-react';
import { useState } from 'react';
import type { InteractiveContent } from '../../data/guide-types';
import { ActionButton } from './ActionButton';
import { useActionSimulation } from './hooks/useActionSimulation';
import { useOverlayPosition } from './hooks/useOverlayPosition';

interface InteractiveDemoProps {
  content: InteractiveContent;
  className?: string;
}

export function InteractiveDemo({ content, className = '' }: InteractiveDemoProps) {
  const { overlayRef, highlighted, elementFound } = useOverlayPosition(content.targetSelector);
  const { simulateAction } = useActionSimulation(content);
  const [currentActionIndex, setCurrentActionIndex] = useState(0);

  const getHighlightClass = () => {
    switch (content.highlightType) {
      case 'pulse':
        return 'animate-pulse border-2 border-[var(--primary)] bg-[var(--primary)]/20';
      case 'outline':
        return 'border-4 border-[var(--primary)] shadow-[0_0_0_4px_rgba(41,231,205,0.2)]';
      case 'overlay':
        return 'bg-[var(--primary)]/30 backdrop-blur-sm border-2 border-[var(--primary)]';
      default:
        return 'border-2 border-[var(--primary)]';
    }
  };

  const handleActionClick = (actionIndex: number) => {
    simulateAction(actionIndex);
    setCurrentActionIndex(actionIndex);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Overlay highlight */}
      {highlighted && elementFound && (
        <div
          ref={overlayRef}
          className={`rounded-lg transition-all ${getHighlightClass()}`}
          aria-hidden={true}
        />
      )}

      {/* Instructions panel */}
      <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        {!elementFound ? (
          <div className="flex items-center gap-2 text-sm text-[var(--color-warning)]">
            <Icon icon={MousePointerClick} size="sm" aria-hidden={true} />
            <span>
              Element not found: <code className="text-xs">{content.targetSelector}</code>
            </span>
          </div>
        ) : (
          <>
            <p className="mb-3 text-sm text-[var(--foreground-secondary)]">
              Look for the highlighted element on the page. Follow the instructions below to
              interact with it.
            </p>
            {content.actions && content.actions.length > 0 && (
              <div className="space-y-2">
                {content.actions.map((action, index) => (
                  <ActionButton
                    key={index}
                    action={action}
                    index={index}
                    isActive={currentActionIndex === index}
                    onClick={() => handleActionClick(index)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
