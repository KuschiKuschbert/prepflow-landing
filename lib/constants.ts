/**
 * Application constants for consistent values across the app
 */

// Performance thresholds
export const PERFORMANCE_THRESHOLDS = {
  SLOW_RESOURCE_THRESHOLD: 2000, // 2 seconds
  SLOW_RESOURCE_REPORT_INTERVAL: 5000, // 5 seconds
  SAMPLE_RATE_DEVELOPMENT: 0.01, // 1% in development
  SAMPLE_RATE_PRODUCTION: 0.1, // 10% in production
} as const;

// UI constants
export const UI_CONSTANTS = {
  MIN_TOUCH_TARGET_SIZE: 44, // Minimum touch target size in pixels
  ANIMATION_DURATION: 300, // Default animation duration in ms
  DEBOUNCE_DELAY: 300, // Default debounce delay in ms
} as const;

// API constants
export const API_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 50,
  MAX_RETRY_ATTEMPTS: 3,
  REQUEST_TIMEOUT: 10000, // 10 seconds
} as const;

// Storage keys
export const STORAGE_KEYS = {
  USER_ID: 'prepflow_user_id',
  EDITING_RECIPE: 'editingRecipe',
  COGS_CALCULATIONS: 'cogsCalculations',
} as const;

// Environment checks
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
