/**
 * Persona configuration for simulation tests.
 * Each persona represents a restaurant type with distinct feature usage patterns.
 */
import {
  type Action,
  CAFE_DAY_PROFILE,
  RESTAURANT_DAY_PROFILE,
  FOOD_TRUCK_DAY_PROFILE,
} from './day-profiles';

export type Domain =
  | 'ingredients'
  | 'recipes'
  | 'cogs'
  | 'performance'
  | 'menu'
  | 'dish'
  | 'temperature'
  | 'cleaning'
  | 'compliance'
  | 'suppliers'
  | 'par-levels'
  | 'order-lists'
  | 'prep-lists'
  | 'sections'
  | 'specials'
  | 'staff'
  | 'roster'
  | 'settings'
  | 'functions'
  | 'customers'
  | 'dashboard'
  | 'guide'
  | 'setup'
  | 'square'
  | 'time-attendance'
  | 'equipment';

export type RestaurantType = 'cafe' | 'restaurant' | 'food-truck' | 'catering';
export type Role = 'chef' | 'prep' | 'manager' | 'owner';

export interface PersonaConfig {
  id: string;
  prefix: string;
  restaurantType: RestaurantType;
  role: Role;
  dayProfile: Action[][];
  featureWeights: Partial<Record<Domain, number>>;
  intensity?: number;
}

const CAFE_FEATURE_WEIGHTS: Partial<Record<Domain, number>> = {
  temperature: 0.9,
  'prep-lists': 0.9,
  ingredients: 0.6,
  recipes: 0.5,
  menu: 0.3,
  cogs: 0.2,
  'par-levels': 0.4,
  'order-lists': 0.3,
  cleaning: 0.5,
  compliance: 0.4,
  dashboard: 0.5,
  functions: 0.2,
  specials: 0.4,
  roster: 0.3,
  sections: 0.3,
  guide: 0.4,
  setup: 0.3,
  settings: 0.3,
  staff: 0.6,
  equipment: 0.4,
  customers: 0.4,
  'time-attendance': 0.3,
  performance: 0.3,
};

const RESTAURANT_FEATURE_WEIGHTS: Partial<Record<Domain, number>> = {
  recipes: 0.9,
  menu: 0.9,
  cogs: 0.9,
  performance: 0.9,
  ingredients: 0.8,
  temperature: 0.6,
  cleaning: 0.5,
  compliance: 0.5,
  suppliers: 0.7,
  dish: 0.8,
  sections: 0.7,
  specials: 0.5,
  dashboard: 0.7,
  functions: 0.8,
  roster: 0.5,
  staff: 0.7,
  customers: 0.5,
  square: 0.4,
  'time-attendance': 0.4,
  equipment: 0.5,
  'par-levels': 0.4,
  'order-lists': 0.3,
  'prep-lists': 0.5,
  settings: 0.4,
  guide: 0.3,
  setup: 0.3,
};

const FOOD_TRUCK_FEATURE_WEIGHTS: Partial<Record<Domain, number>> = {
  'par-levels': 0.9,
  'order-lists': 0.9,
  'prep-lists': 0.8,
  ingredients: 0.7,
  recipes: 0.6,
  temperature: 0.5,
  suppliers: 0.6,
  dashboard: 0.5,
  functions: 0.3,
  sections: 0.5,
  compliance: 0.4,
  cleaning: 0.5,
  customers: 0.5,
  settings: 0.3,
  roster: 0.3,
  staff: 0.4,
  equipment: 0.4,
  specials: 0.4,
  performance: 0.4,
  'time-attendance': 0.3,
  guide: 0.3,
  setup: 0.3,
};

function createPersona(
  id: string,
  prefix: string,
  restaurantType: RestaurantType,
  role: Role,
  dayProfile: Action[][],
  featureWeights: Partial<Record<Domain, number>>,
): PersonaConfig {
  return { id, prefix, restaurantType, role, dayProfile, featureWeights };
}

export const CAFE_PERSONA = createPersona(
  'cafe',
  'SIM_A_',
  'cafe',
  'prep',
  CAFE_DAY_PROFILE,
  CAFE_FEATURE_WEIGHTS,
);

export const RESTAURANT_PERSONA = createPersona(
  'restaurant',
  'SIM_B_',
  'restaurant',
  'chef',
  RESTAURANT_DAY_PROFILE,
  RESTAURANT_FEATURE_WEIGHTS,
);

export const FOOD_TRUCK_PERSONA = createPersona(
  'food-truck',
  'SIM_C_',
  'food-truck',
  'manager',
  FOOD_TRUCK_DAY_PROFILE,
  FOOD_TRUCK_FEATURE_WEIGHTS,
);

export const PERSONAS = [CAFE_PERSONA, RESTAURANT_PERSONA, FOOD_TRUCK_PERSONA] as const;
