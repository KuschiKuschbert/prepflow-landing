'use client';


interface GradientOrbsProps {
  className?: string;
}

export default function GradientOrbs({ className = '' }: GradientOrbsProps) {
  return (
    <div className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`} aria-hidden={true}>
      {/* Primary Cyan Orb - Top Left */}
      <div
        className="absolute -left-1/4 -top-1/4 h-[800px] w-[800px] rounded-full bg-[#29E7CD] opacity-10 blur-3xl"
        style={{
          animation: 'float 20s ease-in-out infinite',
        }}
      />

      {/* Secondary Magenta Orb - Bottom Right */}
      <div
        className="absolute -bottom-1/4 -right-1/4 h-[1000px] w-[1000px] rounded-full bg-[#D925C7] opacity-8 blur-3xl"
        style={{
          animation: 'float 25s ease-in-out infinite reverse',
          animationDelay: '2s',
        }}
      />

      {/* Blue Accent Orb - Center */}
      <div
        className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3B82F6] opacity-6 blur-3xl"
        style={{
          animation: 'float 18s ease-in-out infinite',
          animationDelay: '1s',
        }}
      />

      {/* Additional smaller orbs for depth */}
      <div
        className="absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-[#29E7CD] opacity-5 blur-2xl"
        style={{
          animation: 'float 15s ease-in-out infinite',
          animationDelay: '3s',
        }}
      />

      <div
        className="absolute bottom-1/3 left-1/3 h-[500px] w-[500px] rounded-full bg-[#D925C7] opacity-5 blur-2xl"
        style={{
          animation: 'float 22s ease-in-out infinite reverse',
          animationDelay: '4s',
        }}
      />
    </div>
  );
}
