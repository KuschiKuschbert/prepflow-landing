/**
 * Utility functions for ProcessingStatus component
 */

import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const formatDuration = (seconds?: number): string => {
  if (!seconds) return 'N/A';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};

export const getHealthColor = (health?: string): string => {
  switch (health) {
    case 'healthy':
      return 'text-green-400';
    case 'warning':
      return 'text-yellow-400';
    case 'error':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
};

export const getHealthIcon = (health?: string) => {
  switch (health) {
    case 'healthy':
      return CheckCircle2;
    case 'warning':
      return AlertTriangle;
    case 'error':
      return AlertCircle;
    default:
      return AlertCircle;
  }
};
