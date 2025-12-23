import { z } from 'zod';

export const createTemperatureEquipmentSchema = z.object({
  name: z.string().min(1, 'Equipment name is required'),
  equipment_type: z.string().optional(),
  location: z.string().optional(),
  min_temp_celsius: z.number().nullable().optional(),
  max_temp_celsius: z.number().nullable().optional(),
  notes: z.string().optional(),
});

export const updateTemperatureEquipmentSchema = z.object({
  name: z.string().min(1, 'Equipment name is required').optional(),
  equipment_type: z.string().optional(),
  location: z.string().optional(),
  min_temp_celsius: z.number().nullable().optional(),
  max_temp_celsius: z.number().nullable().optional(),
  is_active: z.boolean().optional(),
  notes: z.string().optional(),
});

