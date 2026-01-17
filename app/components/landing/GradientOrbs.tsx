'use client';

interface GradientOrbsProps {
  className?: string;
}

export default function GradientOrbs({ className = '' }: GradientOrbsProps) {
  return (
    <div
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`}
      aria-hidden={true}
    >
      {/* Primary Cyan Orb - Top Left */}
      <div
        className="bg-landing-primary absolute -top-1/4 -left-1/4 h-[800px] w-[800px] rounded-full opacity-10 blur-3xl"
        style={
          {
            '--orb-animation': 'float-medium 20s ease-in-out infinite',
            animation: 'var(--orb-animation)',
            willChange: 'transform',
          } as React.CSSProperties
        }
      />

      {/* Secondary Magenta Orb - Bottom Right */}
      <div
        className="bg-landing-accent absolute -right-1/4 -bottom-1/4 h-[1000px] w-[1000px] rounded-full opacity-8 blur-3xl"
        style={
          {
            '--orb-animation': 'float-medium 25s ease-in-out infinite reverse',
            '--orb-delay': '2s',
            animation: 'var(--orb-animation)',
            animationDelay: 'var(--orb-delay)',
            willChange: 'transform',
          } as React.CSSProperties
        }
      />

      {/* Blue Accent Orb - Center */}
      <div
        className="bg-landing-secondary absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-6 blur-3xl"
        style={
          {
            '--orb-animation': 'float-medium 18s ease-in-out infinite',
            '--orb-delay': '1s',
            animation: 'var(--orb-animation)',
            animationDelay: 'var(--orb-delay)',
            willChange: 'transform',
          } as React.CSSProperties
        }
      />

      {/* Additional smaller orbs for depth */}
      <div
        className="bg-landing-primary absolute top-1/3 right-1/4 h-[400px] w-[400px] rounded-full opacity-5 blur-2xl"
        style={
          {
            '--orb-animation': 'float-medium 15s ease-in-out infinite',
            '--orb-delay': '3s',
            animation: 'var(--orb-animation)',
            animationDelay: 'var(--orb-delay)',
            willChange: 'transform',
          } as React.CSSProperties
        }
      />

      <div
        className="bg-landing-accent absolute bottom-1/3 left-1/3 h-[500px] w-[500px] rounded-full opacity-5 blur-2xl"
        style={
          {
            '--orb-animation': 'float-medium 22s ease-in-out infinite reverse',
            '--orb-delay': '4s',
            animation: 'var(--orb-animation)',
            animationDelay: 'var(--orb-delay)',
            willChange: 'transform',
          } as React.CSSProperties
        }
      />
    </div>
  );
}
