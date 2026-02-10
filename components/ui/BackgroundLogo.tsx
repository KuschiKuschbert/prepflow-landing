'use client';

export default function BackgroundLogo() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-15 flex items-center justify-center overflow-hidden"
      aria-hidden={true}
    >
      {/* Replaced Image with CSS Gradient for LCP Optimization */}
      <div className="animate-pulse-slow relative h-[80vw] max-h-[800px] w-[80vw] max-w-[800px] opacity-[0.1] blur-3xl">
        <div className="h-full w-full rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)]" />
      </div>
    </div>
  );
}
