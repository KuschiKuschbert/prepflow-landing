'use client';

import React from 'react';

interface Step {
  key: string;
  title: string;
  description: string;
}

interface TourModalProps {
  isOpen: boolean;
  onClose: () => void;
  steps: Step[];
}

export default function TourModal({ isOpen, onClose, steps }: TourModalProps) {
  const [index, setIndex] = React.useState(0);
  const last = steps.length - 1;
  React.useEffect(() => {
    if (isOpen) setIndex(0);
  }, [isOpen]);
  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIndex(i => Math.min(i + 1, last));
      if (e.key === 'ArrowLeft') setIndex(i => Math.max(i - 1, 0));
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, last, onClose]);
  if (!isOpen) return null;
  const step = steps[index];
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="mx-auto mt-20 w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold">{step.title}</h3>
            <button
              className="rounded-lg p-2 hover:bg-[#2a2a2a]/50"
              aria-label="Close"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
          <p className="text-gray-300">{step.description}</p>
          <div className="mt-6 flex items-center justify-between">
            <button
              className="rounded-2xl border border-[#2a2a2a] px-4 py-2 disabled:opacity-50"
              disabled={index === 0}
              onClick={() => setIndex(i => Math.max(i - 1, 0))}
            >
              Back
            </button>
            <div className="flex gap-1">
              {steps.map((s, i) => (
                <span
                  key={s.key}
                  className={`h-2 w-2 rounded-full ${i === index ? 'bg-[#29E7CD]' : 'bg-[#2a2a2a]'}`}
                />
              ))}
            </div>
            <button
              className="rounded-2xl bg-[#29E7CD] px-4 py-2 text-black"
              onClick={() => (index === last ? onClose() : setIndex(i => Math.min(i + 1, last)))}
            >
              {index === last ? 'Done' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
