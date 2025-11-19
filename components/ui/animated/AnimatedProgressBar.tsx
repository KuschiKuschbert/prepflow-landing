/**
 * Animated Progress Bar
 */

'use client';

interface AnimatedProgressBarProps {
  progress: number;
  label?: string;
  className?: string;
}

export function AnimatedProgressBar({ progress, label, className = '' }: AnimatedProgressBarProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="text-fluid-sm flex justify-between">
          <span className="text-gray-300">{label}</span>
          <span className="font-medium text-[#29E7CD]">{progress}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#2a2a2a]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#29E7CD] to-[#D925C7] transition-all duration-1000 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}

