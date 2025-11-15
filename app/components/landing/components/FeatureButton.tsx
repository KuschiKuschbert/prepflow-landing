'use client';

import { Icon } from '@/components/ui/Icon';
import { Plus } from 'lucide-react';
import { RefObject } from 'react';

interface Feature {
  title: string;
  description: string;
}

interface FeatureButtonProps {
  feature: Feature;
  index: number;
  isExpanded: boolean;
  isCurrentlyTransitioning: boolean;
  isVisible: boolean;
  containerWidth?: number;
  initialWidth?: number;
  buttonHeight?: number;
  onToggle: () => void;
  containerRef: (el: HTMLButtonElement | null) => void;
  buttonRef: (el: HTMLButtonElement | null) => void;
  contentRef: (el: HTMLSpanElement | null) => void;
  ANIMATION_DURATION: number;
  ANIMATION_EASING: string;
  BORDER_RADIUS_EASING: string;
}

export function FeatureButton({
  feature,
  index,
  isExpanded,
  isCurrentlyTransitioning,
  isVisible,
  containerWidth,
  initialWidth,
  buttonHeight,
  onToggle,
  containerRef,
  buttonRef,
  contentRef,
  ANIMATION_DURATION,
  ANIMATION_EASING,
  BORDER_RADIUS_EASING,
}: FeatureButtonProps) {
  return (
    <button
      key={feature.title}
      id={`feature-button-${index}`}
      ref={el => {
        containerRef(el);
        buttonRef(el);
      }}
      onClick={onToggle}
      onMouseEnter={(e) => {
        if (!isExpanded && !isCurrentlyTransitioning) {
          e.currentTarget.style.transform = 'translateZ(0) scale(1.02)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isExpanded && !isCurrentlyTransitioning) {
          e.currentTarget.style.transform = 'translateZ(0) scale(1)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }
      }}
      className="relative flex text-left w-fit border focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? 'translateZ(0) scale(1) translateY(0)'
          : 'translateZ(0) scale(0.98) translateY(10px)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        boxSizing: 'border-box',
        flexShrink: 0,
        flexGrow: 0,
        width: isExpanded && containerWidth
          ? `${containerWidth}px`
          : initialWidth
            ? `${initialWidth}px`
            : 'max-content',
        maxHeight: isExpanded
          ? '1000px'
          : buttonHeight
            ? `${buttonHeight}px`
            : '200px',
        minHeight: buttonHeight ? `${buttonHeight}px` : undefined,
        minWidth: 0,
        borderRadius: (() => {
          if (isExpanded) {
            return '24px';
          }
          if (buttonHeight) {
            const pillRadius = Math.min(buttonHeight / 2, 50);
            return `${Math.round(pillRadius)}px`;
          }
          return '20px';
        })(),
        contain: 'layout style paint',
        backfaceVisibility: 'hidden',
        willChange: isCurrentlyTransitioning ? 'width, max-height, border-radius, padding, border-color, background-color, transform, opacity' : 'auto',
        transition: isCurrentlyTransitioning
          ? `opacity 400ms ${ANIMATION_EASING}, transform ${ANIMATION_DURATION}ms ${ANIMATION_EASING}, width ${ANIMATION_DURATION}ms ${ANIMATION_EASING}, max-height ${ANIMATION_DURATION}ms ${ANIMATION_EASING}, border-radius ${ANIMATION_DURATION}ms ${BORDER_RADIUS_EASING}, padding ${ANIMATION_DURATION}ms ${ANIMATION_EASING}, border-color ${ANIMATION_DURATION}ms ${ANIMATION_EASING}, background-color ${ANIMATION_DURATION}ms ${ANIMATION_EASING}`
          : isVisible
            ? `opacity 400ms ${ANIMATION_EASING}, transform 400ms ${ANIMATION_EASING}, border-radius ${ANIMATION_DURATION}ms ${BORDER_RADIUS_EASING}, border-color 200ms ${ANIMATION_EASING}, background-color 200ms ${ANIMATION_EASING}`
            : `opacity 400ms ${ANIMATION_EASING}, transform 400ms ${ANIMATION_EASING}`,
        borderColor: isExpanded ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.12)',
        borderWidth: '1px',
        backgroundColor: isExpanded ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.1)',
        cursor: 'pointer',
        padding: isExpanded ? '0.75rem 1rem' : '0.625rem 0.875rem',
        overflow: 'hidden',
        height: isExpanded ? 'auto' : undefined,
      }}
      aria-expanded={isExpanded}
      aria-controls={`feature-content-${index}`}
    >
      <span
        id={`feature-content-${index}`}
        ref={contentRef}
        className="text-left text-fluid-sm tablet:text-fluid-base"
        style={{
          whiteSpace: isExpanded ? 'normal' : 'nowrap',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
          maxWidth: '100%',
          width: '100%',
          minWidth: 0,
          flexShrink: 1,
          lineHeight: '1.5',
          opacity: 1,
          transform: 'translateZ(0)',
        }}
      >
        <span
          className={isExpanded ? 'font-semibold text-white text-fluid-base tablet:text-fluid-lg' : 'text-white/90 font-medium text-fluid-sm tablet:text-fluid-base'}
          style={{
            display: 'inline-block',
            opacity: 1,
            transform: 'translateZ(0)',
            transition: isCurrentlyTransitioning
              ? `font-weight ${ANIMATION_DURATION}ms ${ANIMATION_EASING}, color ${ANIMATION_DURATION}ms ${ANIMATION_EASING}, font-size ${ANIMATION_DURATION}ms ${ANIMATION_EASING}`
              : 'none',
          }}
        >
          {feature.title}
          {isExpanded && '.'}
        </span>
        <span
          className="text-gray-300 text-fluid-sm tablet:text-fluid-base"
          style={{
            display: 'inline-block',
            marginLeft: isExpanded ? '0.25rem' : '0',
            whiteSpace: isExpanded ? 'normal' : 'nowrap',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
            maxWidth: isExpanded ? '1000px' : '0px',
            overflow: 'hidden',
            opacity: isExpanded ? 1 : 0,
            transform: 'translateZ(0)',
            transition: isCurrentlyTransitioning
              ? `max-width ${ANIMATION_DURATION}ms ${ANIMATION_EASING}, opacity ${ANIMATION_DURATION}ms ${ANIMATION_EASING}, margin-left ${ANIMATION_DURATION}ms ${ANIMATION_EASING}`
              : 'none',
            verticalAlign: 'baseline',
            willChange: isCurrentlyTransitioning ? 'max-width, opacity' : 'auto',
            pointerEvents: isExpanded ? 'auto' : 'none',
          }}
        >
          {feature.description}
        </span>
      </span>

      <div
        className="flex-shrink-0 ml-1.5"
        style={{
          transform: isExpanded ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: `transform ${ANIMATION_DURATION}ms ${ANIMATION_EASING}`,
        }}
      >
        <Icon icon={Plus} size="sm" className="text-white" aria-hidden={true} />
      </div>
    </button>
  );
}
