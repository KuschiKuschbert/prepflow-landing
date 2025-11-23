'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';
import { Plus } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  cta?: {
    text: string;
    href: string;
    action?: () => void;
  };
}

interface FeatureButtonProps {
  feature: Feature;
  index: number;
  isExpanded: boolean;
  isVisible: boolean;
  containerWidth?: number;
  initialWidth?: number;
  buttonHeight?: number;
  onToggle: () => void;
  containerRef: (el: HTMLButtonElement | null) => void;
  buttonRef: (el: HTMLButtonElement | null) => void;
  contentRef: (el: HTMLSpanElement | null) => void;
}

export function FeatureButton({
  feature,
  index,
  isExpanded,
  isVisible,
  containerWidth,
  initialWidth,
  buttonHeight,
  onToggle,
  containerRef,
  buttonRef,
  contentRef,
}: FeatureButtonProps) {
  const borderRadius = isExpanded
    ? '24px'
    : buttonHeight
      ? `${Math.min(buttonHeight / 2, 50)}px`
      : '20px';

  return (
    <motion.button
      key={feature.title}
      id={`feature-button-${index}`}
      ref={el => {
        containerRef(el);
        buttonRef(el);
      }}
      onClick={onToggle}
      layout
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.98,
        y: isVisible ? 0 : 10,
      }}
      transition={{
        type: 'spring',
        bounce: 0,
        duration: 0.6,
        opacity: { duration: 0.2 },
        layout: {
          type: 'spring',
          bounce: 0,
          duration: 0.6,
        },
      }}
      className={`relative flex border text-left focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none ${
        !isExpanded ? 'hover:scale-[1.02] hover:border-white/18 hover:bg-white/12' : ''
      }`}
      style={{
        width:
          isExpanded && containerWidth
            ? `${containerWidth}px`
            : initialWidth
              ? `${initialWidth}px`
              : 'auto',
        borderRadius,
        borderColor: isExpanded ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.12)',
        borderWidth: '1px',
        backgroundColor: isExpanded ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.1)',
        cursor: 'pointer',
        padding: isExpanded ? '0.75rem 1rem' : '0.625rem 0.875rem',
        overflow: 'hidden',
        maxHeight: isExpanded ? '1000px' : buttonHeight ? `${buttonHeight}px` : '200px',
        minHeight: buttonHeight ? `${buttonHeight}px` : undefined,
      }}
      aria-expanded={isExpanded}
      aria-controls={`feature-content-${index}`}
    >
      <motion.div
        layout
        className={`flex w-full items-center ${isExpanded ? 'flex-col items-start gap-4' : 'flex-row gap-3'}`}
      >
        <div className="flex w-full items-center gap-3">
          <span
            id={`feature-content-${index}`}
            ref={contentRef}
            className="min-w-0 flex-1 text-left"
            style={{
              whiteSpace: isExpanded ? 'normal' : 'nowrap',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
            }}
          >
            <motion.span
              layout="position"
              className={
                isExpanded
                  ? 'text-fluid-base tablet:text-fluid-lg font-semibold text-white'
                  : 'text-fluid-sm tablet:text-fluid-base font-medium text-white/90'
              }
            >
              {feature.title}
              {isExpanded && '.'}
            </motion.span>
          </span>

          <motion.div
            layout="position"
            className="flex-shrink-0"
            animate={{
              rotate: isExpanded ? 45 : 0,
            }}
            transition={{
              type: 'spring',
              bounce: 0,
              duration: 0.4,
            }}
          >
            <Icon icon={Plus} size="sm" className="text-white" aria-hidden={true} />
          </motion.div>
        </div>

        <AnimatePresence mode="popLayout">
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-fluid-sm tablet:text-fluid-base w-full text-gray-300"
            >
              {feature.description}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
}
