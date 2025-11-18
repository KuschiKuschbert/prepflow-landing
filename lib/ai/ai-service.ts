/**
 * AI service utilities - re-exported from specialized modules.
 */

// Re-export AI service functions
export { generateAIResponse } from './ai-service/chat';
export { generateAIVisionResponse } from './ai-service/vision';

// Re-export types
export type { AIRequestOptions, AIResponse, AIChatMessage } from './types';
