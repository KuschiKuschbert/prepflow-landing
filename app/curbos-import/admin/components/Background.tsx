import React from 'react';

const RotatingLogo = () => (
  <svg
    width="120"
    height="120"
    viewBox="0 0 100 100"
    className="animate-[spin_10s_linear_infinite] opacity-80"
    aria-label="Rotating Logo"
  >
    <path
      d="M50 15 L85 80 L15 80 Z"
      fill="#fbbf24" /* amber-400 */
      stroke="#d97706" /* amber-600 */
      strokeWidth="3"
      strokeLinejoin="round"
    />
    {/* Texture details */}
    <circle cx="40" cy="50" r="1.5" fill="#d97706" />
    <circle cx="60" cy="60" r="1.5" fill="#d97706" />
    <circle cx="50" cy="70" r="1.5" fill="#d97706" />
    <circle cx="35" cy="65" r="1.5" fill="#d97706" />
    <circle cx="65" cy="45" r="1.5" fill="#d97706" />
  </svg>
);

const Triangle = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 100 100" className={`absolute opacity-10 ${className}`} style={style}>
    <path d="M50 0 L100 100 L0 100 Z" fill="currentColor" />
  </svg>
);

export default function Background() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-neutral-950">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950" />

      {/* Geometric Triangles */}
      <Triangle className="-top-20 -left-20 h-96 w-96 rotate-12 text-lime-500" />
      <Triangle className="top-40 right-10 h-64 w-64 -rotate-12 text-lime-700 opacity-5" />
      <Triangle className="-right-32 -bottom-32 h-[500px] w-[500px] rotate-45 text-neutral-700 opacity-5" />

      {/* Rotating Logo - top-right */}
      <div className="absolute top-20 right-20 hidden md:block">
        <RotatingLogo />
      </div>
      {/* Small floating logo for mobile */}
      <div className="absolute right-10 bottom-10 scale-50 md:hidden">
        <RotatingLogo />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
    </div>
  );
}
