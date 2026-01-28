'use client';

import { Icon } from '@/components/ui/Icon';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { KitchenTimer } from './KitchenTimer';

interface CookingFocusModeProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  instructions: string; // Plain text or markdown-ish
}

export function CookingFocusMode({ isOpen, onClose, title, instructions }: CookingFocusModeProps) {
  // Split instructions into steps if possible (heuristic: newlines or numbers)
  // For MVP, simplistic splitting by double newline or numbered lists
  const steps = instructions
    .split(/\n\d+\.\s+/) // simple split by numbered list e.g. "1. "
    .flatMap(s => s.split(/\n\n/)) // also split by double newlines
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.match(/^\d+\.$/)); // remove empty or just numbers

  // Fallback if splitting failed to produce meaningful steps
  const effectiveSteps = steps.length > 1 ? steps : [instructions];

  const [currentStep, setCurrentStep] = useState(0);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
             if (currentStep < effectiveSteps.length - 1) setCurrentStep(c => c + 1);
        } else if (e.key === 'ArrowLeft') {
             if (currentStep > 0) setCurrentStep(c => c - 1);
        } else if (e.key === 'Escape') {
            onClose();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep, effectiveSteps.length, onClose]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#111] text-white animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#1a1a1a]">
        <h2 className="text-xl font-bold truncate max-w-2xl">{title}</h2>
        <div className="flex items-center gap-4">
             <span className="text-sm text-white/50 hidden tablet:inline-block">
                Use arrow keys to navigate
             </span>
             <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-white/10 transition-colors"
                title="Exit Focus Mode (Esc)"
             >
                <Icon icon={X} size="lg" />
             </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 tablet:p-16 relative overflow-hidden">
         <AnimatePresence mode="wait">
            <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl text-center"
            >
                <div className="mb-6 text-sm font-bold tracking-widest text-[#d97706] uppercase">
                    Step {currentStep + 1} of {effectiveSteps.length}
                </div>
                <div className="text-3xl tablet:text-4xl desktop:text-5xl font-medium leading-tight">
                    {effectiveSteps[currentStep]}
                </div>
            </motion.div>
         </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-8 py-8 border-t border-white/10 bg-[#1a1a1a]">
         <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-lg font-medium bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
         >
            <Icon icon={ChevronLeft} size="lg" />
            Previous
         </button>

         {/* Progress Dots */}
         <div className="hidden tablet:flex gap-2">
            {effectiveSteps.map((_, i) => (
                <div
                    key={i}
                    className={`h-2 w-2 rounded-full transition-all ${
                        i === currentStep ? 'bg-[#d97706] w-6' : 'bg-white/20'
                    }`}
                />
            ))}
         </div>

         <button
            onClick={() => {
                if (currentStep < effectiveSteps.length - 1) {
                    setCurrentStep(currentStep + 1);
                } else {
                    onClose();
                }
            }}
            className={`flex items-center gap-2 px-8 py-3 rounded-full text-lg font-bold transition-all shadow-lg ${
                currentStep === effectiveSteps.length - 1
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20'
                : 'bg-white text-black hover:bg-gray-200'
            }`}
         >
            {currentStep === effectiveSteps.length - 1 ? (
                <>
                    Finish <Icon icon={CheckCircle2} size="lg" />
                </>
            ) : (
                <>
                    Next <Icon icon={ChevronRight} size="lg" />
                </>
            )}
         </button>
      </div>
      <KitchenTimer />
    </div>
  );
}
