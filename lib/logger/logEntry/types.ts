/**
 * Type definitions for log entry utilities
 */

export interface ErrorContext {
  userId?: string;
  entityId?: string;
  entityType?: string;
  endpoint?: string;
  component?: string;
  hook?: string;
  operation?: string;
  table?: string;
  severity?: 'safety' | 'critical' | 'high' | 'medium' | 'low';
  category?: 'security' | 'database' | 'api' | 'client' | 'system' | 'other';
  [key: string]: unknown;
}

export interface LogEntry {
  level: 'error' | 'warn' | 'info' | 'debug' | 'dev';
  message: string;
  timestamp: string;
  context?: ErrorContext;
  error?: {
    message: string;
    stack?: string;
    name?: string;
  };
  data?: unknown;
}

