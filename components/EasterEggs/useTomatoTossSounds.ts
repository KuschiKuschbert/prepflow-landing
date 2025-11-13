'use client';

/**
 * Hook for managing Tomato Toss sound effects using Web Audio API
 * Follows the same pattern as useKitchenFireSounds.ts
 */

import { useRef, useCallback } from 'react';

interface AudioNodeRef {
  node: AudioBufferSourceNode;
  gainNode: GainNode;
}

export const useTomatoTossSounds = () => {
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
      console.warn('Audio context creation failed:', error);
      return false;
    }
  }, []);

  const playThrowSound = useCallback(() => {
    if (!audioContextRef.current || !audioEnabledRef.current) return;

    try {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      const duration = 0.15;
      const bufferSize = Math.floor(audioContextRef.current.sampleRate * duration);
      const buffer = audioContextRef.current.createBuffer(
        1,
        bufferSize,
        audioContextRef.current.sampleRate,
      );
      const data = buffer.getChannelData(0);

      // Create whoosh sound (white noise with low-pass filter)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3;
      }

      const source = audioContextRef.current.createBufferSource();
      const gainNode = audioContextRef.current.createGain();
      const filter = audioContextRef.current.createBiquadFilter();

      source.buffer = buffer;
      filter.type = 'lowpass';
      filter.frequency.value = 2000;
      filter.Q.value = 1;

      const currentTime = audioContextRef.current.currentTime;
      gainNode.gain.setValueAtTime(0.2, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + duration);

      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      source.start();
    } catch (error) {
      console.warn('Failed to play throw sound:', error);
    }
  }, []);

  const playSplatSound = useCallback(() => {
    if (!audioContextRef.current || !audioEnabledRef.current) return;

    try {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      const duration = 0.2;
      const bufferSize = Math.floor(audioContextRef.current.sampleRate * duration);
      const buffer = audioContextRef.current.createBuffer(
        1,
        bufferSize,
        audioContextRef.current.sampleRate,
      );
      const data = buffer.getChannelData(0);

      // Create splat sound with variation
      const variation = Math.random() * 0.3 + 0.7;
      for (let i = 0; i < bufferSize; i++) {
        const progress = i / bufferSize;
        const noise = (Math.random() * 2 - 1) * 0.4;
        const envelope = Math.sin(progress * Math.PI);
        data[i] = noise * envelope * variation;
      }

      const source = audioContextRef.current.createBufferSource();
      const gainNode = audioContextRef.current.createGain();
      const filter = audioContextRef.current.createBiquadFilter();

      source.buffer = buffer;
      filter.type = 'lowpass';
      filter.frequency.value = 1500;
      filter.Q.value = 2;

      const currentTime = audioContextRef.current.currentTime;
      gainNode.gain.setValueAtTime(0.35, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + duration);

      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      source.start();
    } catch (error) {
      console.warn('Failed to play splat sound:', error);
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

      // Descending tone for "get back to work" alert
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(600, currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, currentTime + 1.5);

      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 1.5);

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.start();
      oscillator.stop(currentTime + 1.5);
    } catch (error) {
      console.warn('Failed to play alert sound:', error);
    }
  }, []);

  const playConfettiSound = useCallback(() => {
    if (!audioContextRef.current || !audioEnabledRef.current) return;

    try {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      // Play a quick celebratory sound (ascending tones)
      const frequencies = [261.63, 329.63, 392.0, 523.25];
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
      console.warn('Failed to play confetti sound:', error);
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
    playThrowSound,
    playSplatSound,
    playAlertSound,
    playConfettiSound,
    cleanup,
    audioReady: audioReadyRef.current,
  };
};


