/**
 * AI-related TypeScript types and interfaces
 */

export interface AIRequestOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  useCache?: boolean;
  cacheTTL?: number; // Time to live in milliseconds
}

export interface AIResponse<T = string> {
  content: T;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  cached?: boolean;
  error?: string;
}

export interface AIChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIChatRequest {
  messages: AIChatMessage[];
  options?: AIRequestOptions;
}

export interface AIVisionRequest {
  imageUrl: string;
  prompt: string;
  options?: AIRequestOptions;
}

export interface AICacheEntry {
  key: string;
  response: string;
  timestamp: number;
  ttl: number;
}

export interface AIRateLimit {
  userId?: string;
  ipAddress?: string;
  requests: number;
  windowStart: number;
}

export interface AICostTracking {
  requestId: string;
  endpoint: string;
  model: string;
  tokens: number;
  cost: number;
  timestamp: number;
}

export type AIErrorType =
  | 'API_KEY_MISSING'
  | 'API_ERROR'
  | 'RATE_LIMITED'
  | 'QUOTA_EXCEEDED'
  | 'INVALID_REQUEST'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'UNKNOWN';

export interface AIError {
  type: AIErrorType;
  message: string;
  details?: unknown;
  retryable: boolean;
}
