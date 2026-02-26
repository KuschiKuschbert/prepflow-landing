import { z } from 'zod';

// --- Base Schemas ---

export const functionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  customer_id: z.string().uuid().nullable().optional(),
  name: z.string().min(1, 'Function name is required'),
  type: z.enum(['Birthday', 'Christmas Party', 'Wedding', 'Wake', 'Kids Birthday', 'Other']),
  start_date: z.string(),
  start_time: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  end_time: z.string().nullable().optional(),
  same_day: z.boolean().default(true),
  attendees: z.number().int().min(0).default(0),
  location: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const runsheetItemSchema = z.object({
  id: z.string().uuid(),
  function_id: z.string().uuid(),
  day_number: z.number().int().min(1).default(1),
  item_time: z.string().nullable().optional(),
  description: z.string().min(1, 'Description is required'),
  item_type: z.enum(['meal', 'activity', 'setup', 'other']).default('activity'),
  menu_id: z.string().uuid().nullable().optional(),
  dish_id: z.string().uuid().nullable().optional(),
  recipe_id: z.string().uuid().nullable().optional(),
  position: z.number().int().min(0).default(0),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// --- Input Schemas ---

const coerceBoolean = (val: unknown) => {
  if (typeof val === 'boolean') return val;
  if (val === 'true') return true;
  if (val === 'false') return false;
  return val;
};

const coerceNumber = (val: unknown) => {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const n = parseInt(val, 10);
    return Number.isNaN(n) ? val : n;
  }
  return val;
};

const emptyStringToNull = (val: unknown) => (val === '' ? null : val);

export const createFunctionSchema = z.object({
  name: z.string().min(1, 'Function name is required'),
  // Accept any non-empty string (DB has TEXT; legacy rows may have Corporate, Conference, etc.)
  type: z.string().min(1, 'Event type is required'),
  start_date: z.string(),
  start_time: z.preprocess(emptyStringToNull, z.string().nullable().optional()),
  end_date: z.preprocess(emptyStringToNull, z.string().nullable().optional()),
  end_time: z.preprocess(emptyStringToNull, z.string().nullable().optional()),
  same_day: z.preprocess(coerceBoolean, z.boolean().default(true)),
  attendees: z.preprocess(coerceNumber, z.number().int().min(0).default(0)),
  customer_id: z.preprocess(
    val => (val === '' ? null : val),
    z.string().uuid().nullable().optional(),
  ),
  location: z.preprocess(emptyStringToNull, z.string().nullable().optional()),
  notes: z.preprocess(emptyStringToNull, z.string().nullable().optional()),
});

export const updateFunctionSchema = createFunctionSchema.partial();

export const createRunsheetItemSchema = z.object({
  day_number: z.number().int().min(1).default(1),
  item_time: z.string().nullable().optional(),
  description: z.string().min(1, 'Description is required'),
  item_type: z.enum(['meal', 'activity', 'setup', 'other']).default('activity'),
  menu_id: z.string().uuid().nullable().optional(),
  dish_id: z.string().uuid().nullable().optional(),
  recipe_id: z.string().uuid().nullable().optional(),
  position: z.number().int().min(0).default(0),
});

export const updateRunsheetItemSchema = createRunsheetItemSchema.partial();

export const reorderRunsheetSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid(),
      position: z.number().int().min(0),
    }),
  ),
});

// --- Inferred Types ---

export type AppFunction = z.infer<typeof functionSchema>;
export type RunsheetItem = z.infer<typeof runsheetItemSchema>;
