/**
 * Landing page background effects component
 */

import React from 'react';

const LandingBackground = React.memo(function LandingBackground() {
  return (
    <>
      {/* Background gradient effects - optimized with CSS custom properties */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-[#29E7CD]/10 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 h-96 w-96 rounded-full bg-[#D925C7]/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-96 w-96 rounded-full bg-[#3B82F6]/10 blur-3xl" />
      </div>

      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-gradient-to-br from-[#29E7CD]/20 to-transparent blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-gradient-to-tr from-[#D925C7]/20 to-transparent blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-60 w-60 animate-pulse rounded-full bg-gradient-to-r from-[#3B82F6]/20 to-transparent blur-3xl" />
      </div>
    </>
  );
});

export default LandingBackground;
