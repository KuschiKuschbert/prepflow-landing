/**
 * Interactive demo component.
 * Overlays highlights and interactions on actual UI elements.
 * Supports element highlighting, click-through simulation, and action instructions.
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Icon } from '@/components/ui/Icon';
import { MousePointerClick, Keyboard, Move } from 'lucide-react';
import type { InteractiveContent } from '../../data/guide-types';

interface InteractiveDemoProps {
  content: InteractiveContent;
  className?: string;
}

export function InteractiveDemo({ content, className = '' }: InteractiveDemoProps) {
  const [highlighted, setHighlighted] = useState(false);
  const [elementFound, setElementFound] = useState(false);
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const updatePositionRef = useRef<(() => void) | null>(null);

  const updateOverlayPosition = useCallback(() => {
    const element = document.querySelector(content.targetSelector);
    const overlay = overlayRef.current;

    if (!element || !overlay) {
      setElementFound(false);
      setHighlighted(false);
      return;
    }

    const rect = element.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    // Position overlay over the target element
    overlay.style.position = 'absolute';
    overlay.style.left = `${rect.left + scrollX}px`;
    overlay.style.top = `${rect.top + scrollY}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '9999';

    setElementFound(true);
    setHighlighted(true);
  }, [content.targetSelector]);

  useEffect(() => {
    updatePositionRef.current = updateOverlayPosition;
    updateOverlayPosition();

    // Update position on scroll and resize
    const handleUpdate = () => {
      updateOverlayPosition();
    };

    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);

    // Use IntersectionObserver to detect when element is visible
    const element = document.querySelector(content.targetSelector);
    if (element) {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              handleUpdate();
            }
          });
        },
        { threshold: 0.1 },
      );
      observer.observe(element);

      return () => {
        window.removeEventListener('scroll', handleUpdate, true);
        window.removeEventListener('resize', handleUpdate);
        observer.disconnect();
      };
    }

    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [content.targetSelector, updateOverlayPosition]);

  const getHighlightClass = () => {
    switch (content.highlightType) {
      case 'pulse':
        return 'animate-pulse border-2 border-[#29E7CD] bg-[#29E7CD]/20';
      case 'outline':
        return 'border-4 border-[#29E7CD] shadow-[0_0_0_4px_rgba(41,231,205,0.2)]';
      case 'overlay':
        return 'bg-[#29E7CD]/30 backdrop-blur-sm border-2 border-[#29E7CD]';
      default:
        return 'border-2 border-[#29E7CD]';
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

  const simulateAction = useCallback(
    (actionIndex: number) => {
      const action = content.actions?.[actionIndex];
      if (!action) return;

      const targetElement = document.querySelector(action.target);
      if (!targetElement) return;

      switch (action.type) {
        case 'click':
          (targetElement as HTMLElement).click();
          break;
        case 'type':
          if (
            targetElement instanceof HTMLInputElement ||
            targetElement instanceof HTMLTextAreaElement
          ) {
            targetElement.focus();
            targetElement.value = action.value || '';
            targetElement.dispatchEvent(new Event('input', { bubbles: true }));
            targetElement.dispatchEvent(new Event('change', { bubbles: true }));
          }
          break;
        case 'scroll':
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          break;
      }
    },
    [content.actions],
  );

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
      <div className="mt-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4">
        {!elementFound ? (
          <div className="flex items-center gap-2 text-sm text-yellow-400">
            <Icon icon={MousePointerClick} size="sm" aria-hidden={true} />
            <span>
              Element not found: <code className="text-xs">{content.targetSelector}</code>
            </span>
          </div>
        ) : (
          <>
            <p className="mb-3 text-sm text-gray-300">
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
                          ? 'border-[#29E7CD] bg-[#29E7CD]/10'
                          : 'border-[#2a2a2a] bg-[#0a0a0a] hover:border-[#2a2a2a] hover:bg-[#1f1f1f]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                            isActive ? 'bg-[#29E7CD] text-black' : 'bg-[#29E7CD]/20 text-[#29E7CD]'
                          }`}
                        >
                          {index + 1}
                        </span>
                        <Icon
                          icon={ActionIcon}
                          size="sm"
                          className="text-gray-400"
                          aria-hidden={true}
                        />
                        <div className="flex-1">
                          <span className="text-sm text-gray-300">
                            {action.type === 'click' && `Click on ${action.target}`}
                            {action.type === 'type' &&
                              `Type "${action.value}" into ${action.target}`}
                            {action.type === 'scroll' && `Scroll to ${action.target}`}
                          </span>
                        </div>
                        {isActive && <span className="text-xs text-[#29E7CD]">Executed</span>}
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
