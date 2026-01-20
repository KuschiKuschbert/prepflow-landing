import { logger } from '@/lib/logger';
import { useEffect } from 'react';
import { OrderStatus } from '../types';

export function useOrderNotification(order: OrderStatus | null, isReadyRef: React.MutableRefObject<boolean>) {
  // Sound Effect Helper (Web Audio API)
  const playNotificationSound = () => {
    try {
      const AudioContextClass = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext) as typeof AudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // Nice "Ding" sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.1); // C6

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      logger.error('Audio play failed', e as Error);
    }
  };

  useEffect(() => {
    // Request Notification Permission on mount
    if (typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
     if (isReadyRef.current && order) {
         isReadyRef.current = false; // Reset trigger

         // Play Sound
         playNotificationSound();

         // Vibrate
         if (typeof navigator !== 'undefined' && navigator.vibrate) {
             navigator.vibrate([200, 100, 200]);
         }

         // System Notification
         if (Notification.permission === 'granted') {
             new Notification('Order Ready!', {
                 body: `Order #${order.order_number} is ready for pickup!`,
                 icon: '/favicon.ico'
             });
         }
     }
  }, [order, isReadyRef]);
}
