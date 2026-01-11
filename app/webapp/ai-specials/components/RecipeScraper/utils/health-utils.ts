/**
 * Health status utilities for scraper diagnostics
 */

import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

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
