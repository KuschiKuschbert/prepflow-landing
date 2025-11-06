/**
 * Hook for managing Catch the Docket game logic
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Howl } from 'howler';
import { addStat, addSessionStat, STAT_KEYS } from '@/lib/arcadeStats';
import { throwConfetti } from '@/hooks/useConfetti';
import { isArcadeMuted } from '@/lib/arcadeMute';

export interface Docket {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
}

interface UseCatchTheDocketProps {
  isLoading: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const useCatchTheDocket = ({ isLoading, containerRef }: UseCatchTheDocketProps) => {
  const [dockets, setDockets] = useState<Docket[]>([]);
  const [caught, setCaught] = useState(0);
  const [playTime, setPlayTime] = useState(0);
  const [alertShown, setAlertShown] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const animationRef = useRef<number | null>(null);
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sound effects
  const clickSound = useRef<Howl | null>(null);
  const whooshSound = useRef<Howl | null>(null);
  const successSound = useRef<Howl | null>(null);
  const alertSound = useRef<Howl | null>(null);

  // Initialize sounds
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      clickSound.current = new Howl({
        src: ['/sfx/click.mp3'],
        volume: 0.5,
        preload: false,
      });
      whooshSound.current = new Howl({
        src: ['/sfx/whoosh.mp3'],
        volume: 0.3,
        preload: false,
      });
      successSound.current = new Howl({
        src: ['/sfx/success.mp3'],
        volume: 0.6,
        preload: false,
      });
      alertSound.current = new Howl({
        src: ['/sfx/alert.mp3'],
        volume: 0.7,
        preload: false,
      });
    } catch (error) {
      console.warn('Failed to load sounds, using fallback');
    }
  }, []);

  // Play sound helper
  const playSound = useCallback((sound: Howl | null, fallbackFreq: number = 800) => {
    if (isArcadeMuted()) return;

    if (sound) {
      try {
        sound.play();
      } catch (error) {
        // Fallback beep
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.value = fallbackFreq;
          oscillator.type = 'sine';

          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
          // Silently fail
        }
      }
    }
  }, []);

  // Spawn new docket
  const spawnDocket = useCallback(() => {
    if (!containerRef.current || gameFinished) return;

    const container = containerRef.current.getBoundingClientRect();
    const side = Math.floor(Math.random() * 4);
    let x = 0;
    let y = 0;
    let vx = 0;
    let vy = 0;

    switch (side) {
      case 0: // Top
        x = Math.random() * container.width;
        y = 0;
        vx = (Math.random() - 0.5) * 4;
        vy = Math.random() * 2 + 2;
        break;
      case 1: // Right
        x = container.width;
        y = Math.random() * container.height;
        vx = -(Math.random() * 2 + 2);
        vy = (Math.random() - 0.5) * 4;
        break;
      case 2: // Bottom
        x = Math.random() * container.width;
        y = container.height;
        vx = (Math.random() - 0.5) * 4;
        vy = -(Math.random() * 2 + 2);
        break;
      case 3: // Left
        x = 0;
        y = Math.random() * container.height;
        vx = Math.random() * 2 + 2;
        vy = (Math.random() - 0.5) * 4;
        break;
    }

    const newDocket: Docket = {
      id: `docket-${Date.now()}-${Math.random()}`,
      x,
      y,
      vx,
      vy,
      rotation: Math.random() * 360,
    };

    setDockets(prev => [...prev, newDocket]);
    playSound(whooshSound.current, 600);
  }, [gameFinished, containerRef, playSound]);

  // Update dockets animation
  useEffect(() => {
    if (!isLoading || gameFinished) return;

    const animate = () => {
      setDockets(prev =>
        prev
          .map(docket => ({
            ...docket,
            x: docket.x + docket.vx,
            y: docket.y + docket.vy,
            rotation: docket.rotation + 5,
          }))
          .filter(docket => {
            if (!containerRef.current) return false;
            const container = containerRef.current.getBoundingClientRect();
            return (
              docket.x > -100 &&
              docket.x < container.width + 100 &&
              docket.y > -100 &&
              docket.y < container.height + 100
            );
          }),
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isLoading, gameFinished, containerRef]);

  // Spawn dockets periodically
  useEffect(() => {
    if (!isLoading || gameFinished) return;

    const spawnInterval = setInterval(() => {
      spawnDocket();
    }, 2000);

    return () => clearInterval(spawnInterval);
  }, [isLoading, gameFinished, spawnDocket]);

  // Timer
  useEffect(() => {
    if (!isLoading || gameFinished) return;

    timeIntervalRef.current = setInterval(() => {
      setPlayTime(prev => {
        const newTime = prev + 1;

        if (newTime >= 30 && !alertShown) {
          setAlertShown(true);
          playSound(alertSound.current, 400);
        }

        return newTime;
      });
    }, 1000);

    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, [isLoading, gameFinished, alertShown, playSound]);

  // Handle load complete
  useEffect(() => {
    if (!isLoading && !gameFinished && caught > 0) {
      setGameFinished(true);

      const newTotal = addStat(STAT_KEYS.DOCKETS, caught);
      addSessionStat(STAT_KEYS.DOCKETS, caught);

      if ([10, 25, 50, 100].includes(newTotal)) {
        throwConfetti(1.5);
      } else if (caught > 0) {
        throwConfetti(1);
      }

      playSound(successSound.current, 1000);
    }
  }, [isLoading, gameFinished, caught, playSound]);

  // Handle docket click
  const handleDocketClick = useCallback(
    (id: string) => {
      if (gameFinished) return;

      setDockets(prev => prev.filter(d => d.id !== id));
      setCaught(prev => {
        const newCaught = prev + 1;

        const newTotal = addStat(STAT_KEYS.DOCKETS, 1);
        addSessionStat(STAT_KEYS.DOCKETS, 1);
        if ([10, 25, 50, 100].includes(newTotal)) {
          throwConfetti(1);
        }

        playSound(clickSound.current, 800);
        return newCaught;
      });
    },
    [gameFinished, playSound],
  );

  return {
    dockets,
    caught,
    playTime,
    alertShown,
    gameFinished,
    spawnDocket,
    handleDocketClick,
  };
};
