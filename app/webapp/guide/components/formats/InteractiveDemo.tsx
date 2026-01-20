import { Icon } from '@/components/ui/Icon';
import { Keyboard, MousePointerClick, Move } from 'lucide-react';
import { useState } from 'react';
import type { InteractiveContent } from '../../data/guide-types';
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

  const getActionIcon = (type: 'click' | 'type' | 'scroll') => {
    switch (type) {
      case 'click':
        return MousePointerClick;
      case 'type':
        return Keyboard;
      case 'scroll':
        return Move;
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
                {content.actions.map((action, index) => {
                  const ActionIcon = getActionIcon(action.type);
                  const isActive = currentActionIndex === index;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleActionClick(index)}
                      className={`w-full rounded-xl border p-3 text-left transition-all ${
                        isActive
                          ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                          : 'border-[var(--border)] bg-[var(--background)] hover:border-[var(--border)] hover:bg-[var(--surface)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                            isActive
                              ? 'bg-[var(--primary)] text-[var(--primary-text)]'
                              : 'bg-[var(--primary)]/20 text-[var(--primary)]'
                          }`}
                        >
                          {index + 1}
                        </span>
                        <Icon
                          icon={ActionIcon}
                          size="sm"
                          className="text-[var(--foreground-muted)]"
                          aria-hidden={true}
                        />
                        <div className="flex-1">
                          <span className="text-sm text-[var(--foreground-secondary)]">
                            {action.type === 'click' && `Click on ${action.target}`}
                            {action.type === 'type' &&
                              `Type "${action.value}" into ${action.target}`}
                            {action.type === 'scroll' && `Scroll to ${action.target}`}
                          </span>
                        </div>
                        {isActive && (
                          <span className="text-xs text-[var(--primary)]">Executed</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
