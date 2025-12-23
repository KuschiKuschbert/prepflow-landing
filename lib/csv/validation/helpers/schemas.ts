import type { ValidationSchema } from '../types';

/**
 * Get validation schema for ingredients
 *
 * @returns {ValidationSchema} Ingredients validation schema
 */
export function getIngredientsValidationSchema(): ValidationSchema {
  return {
    ingredient_name: {
      required: true,
      type: 'string',
      custom: value => {
        if (typeof value !== 'string' || value.trim().length === 0) {
          return 'Ingredient name is required';
        }
        return true;
      },
      transform: value => String(value).trim(),
    },
    cost_per_unit: {
      required: true,
      type: 'number',
      min: 0,
      transform: value => {
        const num = parseFloat(String(value));
        return isNaN(num) ? 0 : num;
      },
    },
    unit: {
      required: false,
      type: 'string',
      transform: value => (value ? String(value).toUpperCase().trim() : 'GM'),
    },
    brand: {
      required: false,
      type: 'string',
      transform: value => (value ? String(value).trim() : null),
    },
    supplier: {
      required: false,
      type: 'string',
      transform: value => (value ? String(value).trim() : null),
    },
    storage_location: {
      required: false,
      type: 'string',
      transform: value => (value ? String(value).trim() : null),
    },
    product_code: {
      required: false,
      type: 'string',
      transform: value => (value ? String(value).trim() : null),
    },
    pack_size: {
      required: false,
      type: 'string',
      transform: value => (value ? String(value).trim() : '1'),
    },
    pack_size_unit: {
      required: false,
      type: 'string',
      transform: value => (value ? String(value).trim() : null),
    },
    pack_price: {
      required: false,
      type: 'number',
      min: 0,
      transform: value => {
        const num = parseFloat(String(value));
        return isNaN(num) ? null : num;
      },
    },
    min_stock_level: {
      required: false,
      type: 'number',
      min: 0,
      transform: value => {
        const num = parseFloat(String(value));
        return isNaN(num) ? null : num;
      },
    },
    current_stock: {
      required: false,
      type: 'number',
      min: 0,
      transform: value => {
        const num = parseFloat(String(value));
        return isNaN(num) ? null : num;
      },
    },
  };
}

/**
 * Get validation schema for performance data
 *
 * @returns {ValidationSchema} Performance data validation schema
 */
export function getPerformanceValidationSchema(): ValidationSchema {
  return {
    dish_name: {
      required: true,
      type: 'string',
      custom: value => {
        if (typeof value !== 'string' || value.trim().length === 0) {
          return 'Dish name is required';
        }
        return true;
      },
      transform: value => String(value).trim(),
    },
    number_sold: {
      required: true,
      type: 'number',
      min: 0,
      transform: value => {
        const num = parseInt(String(value), 10);
        return isNaN(num) ? 0 : num;
      },
    },
    popularity_percentage: {
      required: false,
      type: 'number',
      min: 0,
      max: 100,
      transform: value => {
        const num = parseFloat(String(value));
        return isNaN(num) ? 0 : num;
      },
    },
  };
}

