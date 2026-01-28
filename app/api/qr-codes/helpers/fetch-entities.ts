import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import {
    CleaningAreaRow,
    EmployeeRow,
    QRCodeEntity,
    RecipeRow,
    StorageEquipmentRow,
    SupplierRow,
} from './types';

const STORAGE_EQUIPMENT_TYPES = [
  'Cold Storage',
  'Freezer',
  'Ice Production',
  'Dry Storage',
  'Coolroom',
  'Fridge',
];

export async function fetchRecipes(
  supabase: SupabaseClient,
  baseUrl: string,
): Promise<QRCodeEntity[]> {
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, recipe_name, created_at')
    .order('recipe_name');

  if (error) {
    logger.warn('[QR Codes API] Error fetching recipes:', error.message);
    return [];
  }

  return (recipes as RecipeRow[]).map(r => ({
    id: r.id,
    name: r.recipe_name,
    type: 'recipe',
    destinationUrl: `${baseUrl}/webapp/recipes/${r.id}`,
    createdAt: r.created_at,
  }));
}

export async function fetchCleaningAreas(
  supabase: SupabaseClient,
  baseUrl: string,
): Promise<QRCodeEntity[]> {
  const { data: areas, error } = await supabase
    .from('cleaning_areas')
    .select('id, area_name, cleaning_frequency, created_at')
    .order('area_name');

  if (error) {
    logger.warn('[QR Codes API] Error fetching cleaning areas:', error.message);
    return [];
  }

  return (areas as CleaningAreaRow[]).map(a => ({
    id: a.id,
    name: a.area_name,
    type: 'cleaning-area',
    subtitle: a.cleaning_frequency || undefined,
    destinationUrl: `${baseUrl}/webapp/cleaning?area=${a.id}`,
    createdAt: a.created_at,
  }));
}

export async function fetchStorageAreas(
  supabase: SupabaseClient,
  baseUrl: string,
): Promise<QRCodeEntity[]> {
  const { data: storage, error } = await supabase
    .from('temperature_equipment')
    .select('id, name, equipment_type, location, created_at')
    .in('equipment_type', STORAGE_EQUIPMENT_TYPES)
    .order('name');

  if (error) {
    logger.warn('[QR Codes API] Error fetching storage areas:', error.message);
    return [];
  }

  return (storage as StorageEquipmentRow[]).map(s => ({
    id: s.id,
    name: s.name,
    type: 'storage-area',
    subtitle: s.equipment_type || s.location || undefined,
    destinationUrl: `${baseUrl}/webapp/ingredients?storage=${s.id}`,
    createdAt: s.created_at,
  }));
}

export async function fetchEmployees(
  supabase: SupabaseClient,
  baseUrl: string,
): Promise<QRCodeEntity[]> {
  const { data: employees, error } = await supabase
    .from('employees')
    .select('id, full_name, role, created_at')
    .eq('status', 'active')
    .order('full_name');

  if (error) {
    logger.warn('[QR Codes API] Error fetching employees:', error.message);
    return [];
  }

  return (employees as EmployeeRow[]).map(e => ({
    id: e.id,
    name: e.full_name,
    type: 'employee',
    subtitle: e.role || undefined,
    destinationUrl: `${baseUrl}/webapp/staff?id=${e.id}`,
    createdAt: e.created_at,
  }));
}

export async function fetchSuppliers(
  supabase: SupabaseClient,
  baseUrl: string,
): Promise<QRCodeEntity[]> {
  const { data: suppliers, error } = await supabase
    .from('suppliers')
    .select('id, supplier_name, created_at')
    .order('supplier_name');

  if (error) {
    logger.warn('[QR Codes API] Error fetching suppliers:', error.message);
    return [];
  }

  return (suppliers as SupplierRow[]).map(s => ({
    id: s.id,
    name: s.supplier_name,
    type: 'supplier',
    destinationUrl: `${baseUrl}/webapp/suppliers?id=${s.id}`,
    createdAt: s.created_at,
  }));
}
