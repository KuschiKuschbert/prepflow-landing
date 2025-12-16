'use client';
/**
 * Hook for managing Train Off Track sound effects using Web Audio API
 * Light, non-distracting sounds - no looping background audio
 */

import { useRef, useCallback } from 'react';

import { logger } from '@/lib/logger';

export const useTrainOffTrackSounds = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioEnabledRef = useRef(false);
  const audioReadyRef = useRef(false);

  const initAudio = useCallback(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        return false;
      }
      audioContextRef.current = new AudioContextClass();

      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      audioEnabledRef.current = true;
      audioReadyRef.current = true;
      return true;
    } catch (error) {
      logger.warn('Audio context creation failed:', {
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }, []);

  const playTrainWhistleSound = useCallback(() => {
    if (!audioContextRef.current || !audioEnabledRef.current) return;

    try {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      const currentTime = audioContextRef.current.currentTime;

      // Train whistle: frequency sweep from high to low
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, currentTime + 0.3);
      oscillator.frequency.setValueAtTime(600, currentTime + 0.4);
      oscillator.frequency.exponentialRampToValueAtTime(300, currentTime + 0.7);

      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0.15, currentTime + 0.3);
      gainNode.gain.linearRampToValueAtTime(0.2, currentTime + 0.4);
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.7);

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.start();
      oscillator.stop(currentTime + 0.7);
    } catch (error) {
      logger.warn('Failed to play train whistle sound:', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }, []);

  const playSuccessSound = useCallback(() => {
    if (!audioContextRef.current || !audioEnabledRef.current) return;

    try {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      // Simple success chord (2-3 notes, lighter than kitchen fire)
      const frequencies = [329.63, 392.0, 523.25]; // E, G, C
      const duration = 0.25;
      const currentTime = audioContextRef.current.currentTime;

      frequencies.forEach((freq, index) => {
        const oscillator = audioContextRef.current!.createOscillator();
        const gainNode = audioContextRef.current!.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.value = freq;

        const startTime = currentTime + index * duration * 0.6;
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current!.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      });
    } catch (error) {
      logger.warn('Failed to play success sound:', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }, []);

  const cleanup = useCallback(() => {
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {
        // Ignore errors on close
      });
    }
  }, []);

  return {
    initAudio,
    playTrainWhistleSound,
    playSuccessSound,
    cleanup,
    audioReady: audioReadyRef.current,
  };
};
