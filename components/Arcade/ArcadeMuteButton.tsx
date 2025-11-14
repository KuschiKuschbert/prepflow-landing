/**
 * Arcade Mute Button
 *
 * Global mute toggle for all arcade game sounds.
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { isArcadeMuted, toggleArcadeMute, initArcadeMute } from '@/lib/arcadeMute';

interface ArcadeMuteButtonProps {
  className?: string;
}

export const ArcadeMuteButton: React.FC<ArcadeMuteButtonProps> = ({ className = '' }) => {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    // Initialize mute state
    setMuted(initArcadeMute());

    // Listen for mute changes
    const handleMuteChange = () => {
      setMuted(isArcadeMuted());
    };

    window.addEventListener('arcade:muteChanged', handleMuteChange);
    return () => window.removeEventListener('arcade:muteChanged', handleMuteChange);
  }, []);

  const handleToggle = () => {
    toggleArcadeMute();
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      className={`fixed top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-[#2a2a2a] bg-[#1f1f1f]/80 backdrop-blur-sm transition-all duration-200 hover:bg-[#2a2a2a] focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:outline-none ${className}`}
      aria-label={muted ? 'Unmute Arcade Sounds' : 'Mute Arcade Sounds'}
      title={muted ? 'Unmute Arcade Sounds' : 'Mute Arcade Sounds'}
    >
      {muted ? (
        <span className="text-fluid-xl" aria-hidden="true">
          🔇
        </span>
      ) : (
        <span className="text-fluid-xl" aria-hidden="true">
          🔊
        </span>
      )}
    </motion.button>
  );
};
