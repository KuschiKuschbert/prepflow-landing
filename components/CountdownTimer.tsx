'use client';

import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endDate: Date;
  onExpired?: () => void;
  showSeconds?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({
  endDate,
  onExpired,
  showSeconds = true,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const difference = endDate.getTime() - new Date().getTime();

      if (difference <= 0) {
        setIsExpired(true);
        onExpired?.();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    // Calculate immediately
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate, onExpired]);

  if (isExpired) {
    return (
      <div className="text-center">
        <div className="mb-2 text-2xl font-bold text-red-500">⏰ Launch Discount Expired</div>
        <p className="text-sm text-gray-400">Regular pricing now applies</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mb-2 text-sm text-gray-400">🔥 Launch discount ends in:</div>
      <div className="mb-3 flex items-center justify-center gap-3">
        {/* Days */}
        <div className="flex flex-col items-center">
          <div className="min-w-[3rem] rounded-lg bg-[#D925C7] px-3 py-2 text-lg font-bold text-white">
            {timeLeft.days.toString().padStart(2, '0')}
          </div>
          <span className="mt-1 text-xs text-gray-400">Days</span>
        </div>

        {/* Hours */}
        <div className="flex flex-col items-center">
          <div className="min-w-[3rem] rounded-lg bg-[#29E7CD] px-3 py-2 text-lg font-bold text-black">
            {timeLeft.hours.toString().padStart(2, '0')}
          </div>
          <span className="mt-1 text-xs text-gray-400">Hours</span>
        </div>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <div className="min-w-[3rem] rounded-lg bg-[#3B82F6] px-3 py-2 text-lg font-bold text-white">
            {timeLeft.minutes.toString().padStart(2, '0')}
          </div>
          <span className="mt-1 text-xs text-gray-400">Minutes</span>
        </div>

        {/* Seconds */}
        {showSeconds && (
          <div className="flex flex-col items-center">
            <div className="min-w-[3rem] rounded-lg bg-gray-600 px-3 py-2 text-lg font-bold text-white">
              {timeLeft.seconds.toString().padStart(2, '0')}
            </div>
            <span className="mt-1 text-xs text-gray-400">Seconds</span>
          </div>
        )}
      </div>

      {/* Urgency message */}
      <div className="text-sm font-semibold text-[#29E7CD]">
        {timeLeft.days === 0 && timeLeft.hours < 6
          ? '🚨 Last few hours remaining!'
          : timeLeft.days === 0
            ? "⚡ Final day - don't miss out!"
            : '🔥 Limited time offer - secure your discount!'}
      </div>
    </div>
  );
}
