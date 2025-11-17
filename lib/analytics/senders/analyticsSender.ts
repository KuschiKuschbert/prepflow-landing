import { logger } from '@/lib/logger';
import type { AnalyticsEvent, ConversionEvent, PerformanceMetrics } from '../types';

export function sendToAnalytics(event: AnalyticsEvent): void {
  if (process.env.NODE_ENV === 'development') {
    logger.dev('📊 Analytics Event:', event);
  }
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      custom_parameter_page: event.page,
      custom_parameter_session_id: event.sessionId,
      custom_parameter_user_id: event.userId,
    });
  }
}

export function sendConversion(conversion: ConversionEvent): void {
  if (process.env.NODE_ENV === 'development') {
    logger.dev('🎯 Conversion Event:', conversion);
  }
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      event_category: 'conversion',
      event_label: conversion.type,
      value: 1,
      custom_parameter_element: conversion.element,
      custom_parameter_page: conversion.page,
      custom_parameter_session_id: conversion.sessionId,
      custom_parameter_user_id: conversion.userId,
      custom_parameter_metadata: JSON.stringify(conversion.metadata),
    });
  }
}

export function sendPerformanceMetrics(metrics: PerformanceMetrics): void {
  if (process.env.NODE_ENV === 'development') {
    logger.dev('⚡ Performance Metrics:', metrics);
  }
}
