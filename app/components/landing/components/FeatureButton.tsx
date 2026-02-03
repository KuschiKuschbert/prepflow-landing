'use client';

import { Icon } from '@/components/ui/Icon';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  colorClass?: string;
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

const getShadowStyle = (colorClass?: string) => {
  if (colorClass?.includes('text-landing-primary')) {
    return '0 0 20px rgba(41, 231, 205, 0.25), 0 0 40px rgba(41, 231, 205, 0.1)';
  }
  if (colorClass?.includes('text-landing-secondary')) {
    return '0 0 20px rgba(59, 130, 246, 0.25), 0 0 40px rgba(59, 130, 246, 0.1)';
  }
  if (colorClass?.includes('text-landing-accent')) {
    return '0 0 20px rgba(217, 37, 199, 0.25), 0 0 40px rgba(217, 37, 199, 0.1)';
  }
  return '0 0 20px rgba(41, 231, 205, 0.25), 0 0 40px rgba(41, 231, 205, 0.1)';
};

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
      className={`relative flex cursor-pointer overflow-hidden border border-solid text-left focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none ${
        !isExpanded ? 'hover:scale-[1.02] hover:border-white/18 hover:bg-white/12' : ''
      }`}
      whileHover={
        !isExpanded
          ? {
              scale: 1.02,
            }
          : {}
      }
      style={{
        width:
          isExpanded && containerWidth
            ? `${containerWidth}px`
            : initialWidth
              ? `${initialWidth}px`
              : 'auto',
        borderRadius,
        borderTopColor: isExpanded ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.12)',
        borderRightColor: isExpanded ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.12)',
        borderBottomColor: isExpanded ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.12)',
        borderLeftColor: isExpanded ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.12)',
        borderTopWidth: '1px',
        borderRightWidth: '1px',
        borderBottomWidth: '1px',
        borderLeftWidth: '1px',
        backgroundColor: isExpanded ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.1)',
        padding: isExpanded ? '0.75rem 1rem' : '0.625rem 0.875rem',
        maxHeight: isExpanded ? '1000px' : buttonHeight ? `${buttonHeight}px` : '200px',
        minHeight: buttonHeight ? `${buttonHeight}px` : undefined,
        boxShadow: isExpanded ? getShadowStyle(feature.colorClass) : 'none',
      }}
      suppressHydrationWarning
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
                  ? 'text-fluid-lg tablet:text-fluid-xl font-light text-white'
                  : 'text-fluid-base tablet:text-fluid-lg font-light text-white/90'
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
              className="text-fluid-base tablet:text-fluid-lg w-full leading-relaxed text-gray-400"
            >
              {feature.description}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
}
