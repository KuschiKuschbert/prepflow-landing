'use client';

import React from 'react';
import Image from 'next/image';

export default function BackgroundLogo() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-15 flex items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      <div className="animate-pulse-slow relative h-[80vw] max-h-[800px] w-[80vw] max-w-[800px] opacity-[0.03] blur-3xl">
        <Image
          src="/images/prepflow-logo.png"
          alt=""
          fill
          className="object-contain"
          priority
          sizes="(max-width: 800px) 80vw, 800px"
        />
      </div>
    </div>
  );
}
