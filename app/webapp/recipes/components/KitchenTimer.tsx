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
        setTimeLeft((prev) => {
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
            className="fixed bottom-6 sticky right-6 z-50 rounded-full bg-emerald-600 p-4 text-white hover:bg-emerald-500 shadow-lg transition-transform hover:scale-110 active:scale-95 flex items-center gap-2"
          >
            <Icon icon={Timer} size="lg" />
            <span className="font-semibold hidden tablet:inline">Timer</span>
          </button>
      );
  }

  // Timer Overlay when open
  return (
    <div className="fixed bottom-6 right-6 z-[60] w-72 rounded-2xl bg-[#1a1a1a] border border-white/10 shadow-2xl p-4 animate-in slide-in-from-bottom-10 fade-in">
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
                <Icon icon={Timer} size="sm" className="text-emerald-500" />
                Kitchen Timer
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
                <Icon icon={X} size="sm" />
            </button>
        </div>

        {timeLeft > 0 ? (
            <div className="text-center">
                 <div className={`text-5xl font-mono font-bold mb-4 tabular-nums tracking-wider ${timeLeft === 0 && !isRunning ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                    {formatTime(timeLeft)}
                 </div>
                 <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={toggleTimer}
                        className={`p-3 rounded-full ${isRunning ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-emerald-600 hover:bg-emerald-500'} text-white transition-colors`}
                    >
                        <Icon icon={isRunning ? Pause : Play} size="md" />
                    </button>
                    <button
                        onClick={resetTimer}
                        className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                        <Icon icon={RotateCcw} size="md" />
                    </button>
                 </div>
            </div>
        ) : (
            <div className="grid grid-cols-3 gap-2">
                {[1, 5, 10, 15, 30, 45].map((min) => (
                    <button
                        key={min}
                        onClick={() => startTimer(min * 60)}
                        className="py-2 px-1 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors"
                    >
                        {min}m
                    </button>
                ))}
            </div>
        )}
    </div>
  );
}
