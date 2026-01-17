'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface ExpandableFeatureProps {
  title: string;
  description: string;
  icon: string;
  screenshot: string;
  screenshotAlt: string;
  details: string[];
  isExpanded: boolean;
  onToggle: () => void;
  colorClass: string;
}

export default function ExpandableFeature({
  title,
  description,
  icon,
  screenshot,
  screenshotAlt,
  details,
  isExpanded,
  onToggle,
  colorClass,
}: ExpandableFeatureProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    } else if (e.key === 'Escape' && isExpanded) {
      onToggle();
    }
  };

  return (
    <div className="border-b border-white/10">
      {/* Header - Always Visible */}
      <button
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        className="flex w-full items-center justify-between py-6 text-left focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none"
        aria-expanded={isExpanded}
        aria-controls={`feature-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <div className="flex items-center gap-4">
          <span className="text-fluid-3xl">{icon}</span>
          <div>
            <h3 className="text-fluid-xl desktop:text-fluid-2xl font-semibold text-white">
              {title}
            </h3>
            <p className="text-fluid-sm mt-1 text-gray-400">{description}</p>
          </div>
        </div>

        {/* Expand/Collapse Icon */}
        <div
          className="flex-shrink-0 transition-transform duration-300"
          style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expandable Content */}
      <div
        id={`feature-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          height: `${contentHeight}px`,
          transition: 'height 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div ref={contentRef} className="pb-8">
          {/* Screenshot */}
          <div className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-[#1f1f1f]/30">
            <Image
              src={screenshot}
              alt={screenshotAlt}
              width={1200}
              height={800}
              className="h-auto w-full"
              quality={90}
            />
          </div>

          {/* Details List */}
          {details.length > 0 && (
            <div className="space-y-3">
              {details.map((detail, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className={`mt-1 h-2 w-2 rounded-full ${colorClass?.replace('text-', 'bg-') || 'bg-landing-primary'}`}
                  />
                  <p className="text-gray-300">{detail}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
