'use client';

import { useTheme } from '@/lib/theme/useTheme';

interface GradientOrbsProps {
  className?: string;
}

export default function GradientOrbs({ className = '' }: GradientOrbsProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Light mode: use richer, more saturated colors with higher opacity
  // Dark mode: use neon colors with lower opacity
  const primaryColor = isLight ? 'rgba(26, 157, 138, 0.12)' : undefined;
  const accentColor = isLight ? 'rgba(160, 26, 138, 0.08)' : undefined;
  const secondaryColor = isLight ? 'rgba(37, 99, 235, 0.06)' : undefined;

  return (
    <div
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`}
      aria-hidden={true}
    >
      {/* Primary Cyan Orb - Top Left */}
      <div
        className={
          isLight
            ? 'absolute -top-1/4 -left-1/4 h-[800px] w-[800px] rounded-full blur-3xl'
            : 'bg-landing-primary absolute -top-1/4 -left-1/4 h-[800px] w-[800px] rounded-full opacity-10 blur-3xl'
        }
        style={{
          ...(primaryColor ? { backgroundColor: primaryColor } : {}),
          animation: 'float-medium 20s ease-in-out infinite',
          willChange: 'transform',
        }}
      />

      {/* Secondary Magenta Orb - Bottom Right */}
      <div
        className={
          isLight
            ? 'absolute -right-1/4 -bottom-1/4 h-[1000px] w-[1000px] rounded-full blur-3xl'
            : 'bg-landing-accent absolute -right-1/4 -bottom-1/4 h-[1000px] w-[1000px] rounded-full opacity-8 blur-3xl'
        }
        style={{
          ...(accentColor ? { backgroundColor: accentColor } : {}),
          animation: 'float-medium 25s ease-in-out infinite reverse',
          animationDelay: '2s',
          willChange: 'transform',
        }}
      />

      {/* Blue Accent Orb - Center */}
      <div
        className={
          isLight
            ? 'absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl'
            : 'bg-landing-secondary absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-6 blur-3xl'
        }
        style={{
          ...(secondaryColor ? { backgroundColor: secondaryColor } : {}),
          animation: 'float-medium 18s ease-in-out infinite',
          animationDelay: '1s',
          willChange: 'transform',
        }}
      />

      {/* Additional smaller orbs for depth */}
      <div
        className={
          isLight
            ? 'absolute top-1/3 right-1/4 h-[400px] w-[400px] rounded-full blur-2xl'
            : 'bg-landing-primary absolute top-1/3 right-1/4 h-[400px] w-[400px] rounded-full opacity-5 blur-2xl'
        }
        style={{
          ...(primaryColor ? { backgroundColor: `${primaryColor.replace('0.12', '0.06')}` } : {}),
          animation: 'float-medium 15s ease-in-out infinite',
          animationDelay: '3s',
          willChange: 'transform',
        }}
      />

      <div
        className={
          isLight
            ? 'absolute bottom-1/3 left-1/3 h-[500px] w-[500px] rounded-full blur-2xl'
            : 'bg-landing-accent absolute bottom-1/3 left-1/3 h-[500px] w-[500px] rounded-full opacity-5 blur-2xl'
        }
        style={{
          ...(accentColor ? { backgroundColor: `${accentColor.replace('0.08', '0.05')}` } : {}),
          animation: 'float-medium 22s ease-in-out infinite reverse',
          animationDelay: '4s',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
