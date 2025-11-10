'use client';

import { useState, useEffect, useRef } from 'react';

export function KitchenTimer() {
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            playAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const playAlarm = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // Ignore audio play errors (user interaction required)
      });
    }
  };

  const formatTime = (totalSeconds: number): string => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds > 0) {
      setTimeLeft(totalSeconds);
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  const handlePreset = (minutes: number) => {
    setHours(0);
    setMinutes(minutes);
    setSeconds(0);
    setTimeLeft(minutes * 60);
  };

  const displayTime = timeLeft > 0 ? timeLeft : hours * 3600 + minutes * 60 + seconds;

  return (
    <div className="w-full space-y-2 sm:space-y-4">
      <div className="hidden sm:block">
        <h2 className="mb-1 text-base font-semibold text-white sm:mb-2 sm:text-lg">
          Kitchen Timer
        </h2>
        <p className="text-xs text-gray-400">Set a timer for your cooking tasks</p>
      </div>

      {/* Large Time Display - Compact for Mobile */}
      <div className="flex w-full items-center justify-center rounded-xl bg-[#2a2a2a] p-3 sm:rounded-2xl sm:p-6 md:p-8">
        <div className="w-full text-center">
          <div className="text-4xl font-bold text-[#29E7CD] sm:text-5xl md:text-6xl lg:text-8xl">
            {formatTime(displayTime)}
          </div>
          {timeLeft > 0 && (
            <div className="mt-1 text-xs text-gray-400 sm:mt-2 sm:text-sm">
              {isRunning ? 'Running...' : 'Paused'}
            </div>
          )}
        </div>
      </div>

      {/* Preset Buttons - Compact */}
      <div className="w-full">
        <label className="mb-1 block text-xs font-medium text-gray-300 sm:mb-2 sm:text-sm">
          Quick Presets
        </label>
        <div className="grid w-full grid-cols-5 gap-1 sm:gap-2">
          {[5, 10, 15, 30, 60].map(mins => (
            <button
              key={mins}
              onClick={() => handlePreset(mins)}
              disabled={isRunning}
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/50 px-1 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-xl sm:px-2 sm:py-2 sm:text-sm"
            >
              {mins}m
            </button>
          ))}
        </div>
      </div>

      {/* Time Input - Compact */}
      <div className="grid w-full grid-cols-3 gap-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-300 sm:mb-2 sm:text-sm">
            H
          </label>
          <input
            type="number"
            min="0"
            max="23"
            value={hours}
            onChange={e => setHours(Math.max(0, parseInt(e.target.value) || 0))}
            disabled={isRunning}
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/50 px-2 py-2 text-sm text-white placeholder-gray-500 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none disabled:opacity-50 sm:rounded-xl sm:px-3 sm:py-2.5"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-300 sm:mb-2 sm:text-sm">
            M
          </label>
          <input
            type="number"
            min="0"
            max="59"
            value={minutes}
            onChange={e => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
            disabled={isRunning}
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/50 px-2 py-2 text-sm text-white placeholder-gray-500 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none disabled:opacity-50 sm:rounded-xl sm:px-3 sm:py-2.5"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-300 sm:mb-2 sm:text-sm">
            S
          </label>
          <input
            type="number"
            min="0"
            max="59"
            value={seconds}
            onChange={e => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
            disabled={isRunning}
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/50 px-2 py-2 text-sm text-white placeholder-gray-500 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none disabled:opacity-50 sm:rounded-xl sm:px-3 sm:py-2.5"
          />
        </div>
      </div>

      {/* Control Buttons - Compact */}
      <div className="flex gap-2">
        {!isRunning ? (
          <button
            onClick={handleStart}
            disabled={displayTime === 0}
            className="flex-1 rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-[#29E7CD]/20 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-2xl sm:px-6 sm:py-3"
          >
            Start
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex-1 rounded-xl bg-[#3B82F6] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#3B82F6]/80 sm:rounded-2xl sm:px-6 sm:py-3"
          >
            Pause
          </button>
        )}
        <button
          onClick={handleReset}
          className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/50 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2a2a2a] sm:rounded-2xl sm:px-4 sm:py-3"
        >
          Reset
        </button>
      </div>

      {/* Hidden audio element for alarm */}
      <audio ref={audioRef} preload="auto">
        <source src="/sounds/timer-alarm.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}
