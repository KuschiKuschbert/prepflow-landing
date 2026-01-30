'use client';

import { Icon } from '@/components/ui/Icon';
import { Pause, Play, RotateCcw, Timer, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function KitchenTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startTimer = (duration: number) => {
    setTimeLeft(duration);
    setIsRunning(true);
    setIsOpen(true);
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  // Floating Button when closed
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed sticky right-6 bottom-6 z-50 flex items-center gap-2 rounded-full bg-emerald-600 p-4 text-white shadow-lg transition-transform hover:scale-110 hover:bg-emerald-500 active:scale-95"
      >
        <Icon icon={Timer} size="lg" />
        <span className="tablet:inline hidden font-semibold">Timer</span>
      </button>
    );
  }

  // Timer Overlay when open
  return (
    <div className="animate-in slide-in-from-bottom-10 fade-in fixed right-6 bottom-6 z-[60] w-72 rounded-2xl border border-white/10 bg-[#1a1a1a] p-4 shadow-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-bold text-white">
          <Icon icon={Timer} size="sm" className="text-emerald-500" />
          Kitchen Timer
        </h3>
        <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
          <Icon icon={X} size="sm" />
        </button>
      </div>

      {timeLeft > 0 ? (
        <div className="text-center">
          <div
            className={`mb-4 font-mono text-5xl font-bold tracking-wider tabular-nums ${timeLeft === 0 && !isRunning ? 'animate-pulse text-red-500' : 'text-white'}`}
          >
            {formatTime(timeLeft)}
          </div>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={toggleTimer}
              className={`rounded-full p-3 ${isRunning ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-emerald-600 hover:bg-emerald-500'} text-white transition-colors`}
            >
              <Icon icon={isRunning ? Pause : Play} size="md" />
            </button>
            <button
              onClick={resetTimer}
              className="rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
            >
              <Icon icon={RotateCcw} size="md" />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {[1, 5, 10, 15, 30, 45].map(min => (
            <button
              key={min}
              onClick={() => startTimer(min * 60)}
              className="rounded-lg bg-white/5 px-1 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              {min}m
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
