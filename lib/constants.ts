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

// Pagination constants
export const PAGINATION_CONSTANTS = {
  RECIPE_LIST_OPTIONS: [10, 20, 50, 100],
} as const;

// Storage keys
export const STORAGE_KEYS = {
  USER_ID: 'prepflow_user_id',
  EDITING_RECIPE: 'editingRecipe',
  COGS_CALCULATIONS: 'cogsCalculations',
} as const;

// Environment checks
export const isProduction = process.env.NODE_ENV === 'production';

// Auth constants
export const AUTH_CONSTANTS = {
  SESSION_MAX_AGE: 60 * 60 * 24 * 7, // 1 week in seconds
} as const;

// Cache constants
export const CACHE_CONSTANTS = {
  USER_PROFILE_TTL: 5 * 60 * 1000, // 5 minutes in milliseconds
} as const;

// Data Size constants
export const DATA_SIZE_CONSTANTS = {
  BYTES_PER_KB: 1024,
  BYTES_PER_MB: 1024 * 1024,
  BYTES_PER_GB: 1024 * 1024 * 1024,
} as const;

// Animation constants
export const ANIMATION_CONSTANTS = {
  TRIANGLE_GRID: {
    COUNT: 50,
    MIN_SIZE: 20,
    MAX_SIZE: 40, // Base + Random * this
    OPACITY_BASE: 0.15,
    OPACITY_VARIANCE: 0.5,
  },
} as const;

// App Configuration
export const APP_BASE_URL =
  process.env.AUTH0_BASE_URL ||
  (isProduction ? 'https://app.prepflow.io' : 'http://localhost:3000');

// Business Logic
export const BUSINESS_LOGIC = {
  TARGET_GROSS_PROFIT_PERCENT: 70,
  TARGET_FOOD_COST_PERCENT: 30, // 100 - 70
  DEFAULT_WASTAGE_PERCENT: 0,
} as const;

// UI Dimensions (Pixels)
export const UI_DIMENSIONS = {
  CATEGORY_SELECTOR: {
    WIDTH: 280,
    ITEM_HEIGHT: 48,
    HEADER_HEIGHT: 60,
    MAX_HEIGHT: 320,
  },
  TOOLTIP: {
    WIDTH: 256,
    OFFSET: 12,
  },
  POPOVER: {
    INGREDIENT_WIDTH: 400,
    INGREDIENT_MAX_HEIGHT: 500,
  },
  SWIPE: {
    MIN_DISTANCE: 100,
  },
} as const;
