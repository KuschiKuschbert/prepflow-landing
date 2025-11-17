'use client';
/**
 * Hook for managing Kitchen's on Fire sound effects using Web Audio API
 */

import { useRef, useCallback } from 'react';

import { logger } from '@/lib/logger';

interface AudioNodeRef {
  node: AudioBufferSourceNode;
  gainNode: GainNode;
}

export const useKitchenFireSounds = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const fireLoopRef = useRef<AudioNodeRef | null>(null);
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
      logger.warn('Audio context creation failed:', { error: error instanceof Error ? error.message : String(error) });
      return false;
    }
  }, []);

  const createBrownNoise = useCallback((): AudioNodeRef | null => {
    if (!audioContextRef.current) return null;

    const bufferSize = 4096;
    const buffer = audioContextRef.current.createBuffer(
      1,
      bufferSize,
      audioContextRef.current.sampleRate,
    );
    const data = buffer.getChannelData(0);
    let lastOut = 0;

    for (let i = 0; i < bufferSize; i++) {
      const brown = (Math.random() * 2 - 1) * 0.1;
      data[i] = (lastOut + brown) * 0.98;
      lastOut = data[i];
    }

    const source = audioContextRef.current.createBufferSource();
    const gainNode = audioContextRef.current.createGain();
    const filter = audioContextRef.current.createBiquadFilter();

    source.buffer = buffer;
    source.loop = true;

    filter.type = 'lowpass';
    filter.frequency.value = 800;
    filter.Q.value = 1;

    gainNode.gain.value = 0.15;

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    source.start(0);

    return { node: source, gainNode };
  }, []);

  const startFireLoop = useCallback(() => {
    if (!audioContextRef.current || !audioEnabledRef.current) return;

    try {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      const fireLoop = createBrownNoise();
      if (fireLoop) {
        fireLoopRef.current = fireLoop;
      }
    } catch (error) {
      logger.warn('Failed to start fire loop:', { error: error instanceof Error ? error.message : String(error) });
    }
  }, [createBrownNoise]);

  const stopFireLoop = useCallback(() => {
    if (fireLoopRef.current?.gainNode && audioContextRef.current) {
      try {
        const currentTime = audioContextRef.current.currentTime;
        fireLoopRef.current.gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.5);
        setTimeout(() => {
          if (fireLoopRef.current?.node) {
            try {
              fireLoopRef.current.node.stop();
            } catch (e) {
              // Already stopped
            }
          }
          fireLoopRef.current = null;
        }, 500);
      } catch (error) {
        logger.warn('Failed to stop fire loop:', { error: error instanceof Error ? error.message : String(error) });
      }
    }
  }, []);

  const playExtinguisherSound = useCallback(() => {
    if (!audioContextRef.current || !audioEnabledRef.current) return;

    try {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      const duration = 0.4;
      const bufferSize = Math.floor(audioContextRef.current.sampleRate * duration);
      const buffer = audioContextRef.current.createBuffer(
        1,
        bufferSize,
        audioContextRef.current.sampleRate,
      );
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const source = audioContextRef.current.createBufferSource();
      const gainNode = audioContextRef.current.createGain();

      source.buffer = buffer;
      const currentTime = audioContextRef.current.currentTime;
      gainNode.gain.setValueAtTime(0.3, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + duration);

      source.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      source.start();
    } catch (error) {
      logger.warn('Failed to play extinguisher sound:', { error: error instanceof Error ? error.message : String(error) });
    }
  }, []);

  const playSuccessSound = useCallback(() => {
    if (!audioContextRef.current || !audioEnabledRef.current) return;

    try {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      const frequencies = [261.63, 329.63, 392.0, 523.25];
      const duration = 0.3;
      const currentTime = audioContextRef.current.currentTime;

      frequencies.forEach((freq, index) => {
        const oscillator = audioContextRef.current!.createOscillator();
        const gainNode = audioContextRef.current!.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.value = freq;

        const startTime = currentTime + index * duration * 0.7;
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current!.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      });
    } catch (error) {
      logger.warn('Failed to play success sound:', { error: error instanceof Error ? error.message : String(error) });
    }
  }, []);

  const playAlertSound = useCallback(() => {
    if (!audioContextRef.current || !audioEnabledRef.current) return;

    try {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      const currentTime = audioContextRef.current.currentTime;

      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(800, currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, currentTime + 2);

      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.linearRampToValueAtTime(0.4, currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 2);

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.start();
      oscillator.stop(currentTime + 2);
    } catch (error) {
      logger.warn('Failed to play alert sound:', { error: error instanceof Error ? error.message : String(error) });
    }
  }, []);

  const cleanup = useCallback(() => {
    stopFireLoop();
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {
        // Ignore errors on close
      });
    }
  }, [stopFireLoop]);

  return {
    initAudio,
    startFireLoop,
    stopFireLoop,
    playExtinguisherSound,
    playSuccessSound,
    playAlertSound,
    cleanup,
    audioReady: audioReadyRef.current,
  };
};
