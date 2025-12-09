import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

interface QRCodeEntity {
  id: string;
  name: string;
  type: 'recipe' | 'cleaning-area' | 'employee' | 'supplier' | 'storage-area';
  subtitle?: string;
  destinationUrl: string;
  createdAt?: string;
}

interface RecipeRow {
  id: string;
  recipe_name: string;
  created_at: string;
}

interface CleaningAreaRow {
  id: string;
  area_name: string;
  cleaning_frequency: string | null;
  created_at: string;
}

interface EmployeeRow {
  id: string;
  full_name: string;
  role: string | null;
  created_at: string;
}

interface SupplierRow {
  id: string;
  supplier_name: string;
  created_at: string;
}

interface StorageEquipmentRow {
  id: string;
  name: string;
  equipment_type: string | null;
  location: string | null;
  created_at: string;
}

// Storage types that should have QR codes (cold storage only, not hot holding)
const STORAGE_EQUIPMENT_TYPES = [
  'Cold Storage',
  'Freezer',
  'Ice Production',
  'Dry Storage',
  'Coolroom',
  'Fridge',
];

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    const entities: QRCodeEntity[] = [];
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // Fetch recipes
    const { data: recipes, error: recipesError } = await supabaseAdmin
      .from('recipes')
      .select('id, recipe_name, created_at')
      .order('recipe_name');

    if (recipesError) {
      logger.warn('[QR Codes API] Error fetching recipes:', recipesError.message);
    } else if (recipes) {
      entities.push(
        ...(recipes as RecipeRow[]).map((r: RecipeRow) => ({
          id: r.id,
          name: r.recipe_name,
          type: 'recipe' as const,
          destinationUrl: `${baseUrl}/webapp/recipes/${r.id}`,
          createdAt: r.created_at,
        })),
      );
    }

    // Fetch cleaning areas
    const { data: cleaningAreas, error: cleaningError } = await supabaseAdmin
      .from('cleaning_areas')
      .select('id, area_name, cleaning_frequency, created_at')
      .order('area_name');

    if (cleaningError) {
      logger.warn('[QR Codes API] Error fetching cleaning areas:', cleaningError.message);
    } else if (cleaningAreas) {
      entities.push(
        ...(cleaningAreas as CleaningAreaRow[]).map((a: CleaningAreaRow) => ({
          id: a.id,
          name: a.area_name,
          type: 'cleaning-area' as const,
          subtitle: a.cleaning_frequency || undefined,
          destinationUrl: `${baseUrl}/webapp/cleaning?area=${a.id}`,
          createdAt: a.created_at,
        })),
      );
    }

    // Fetch storage areas (temperature equipment - only cold storage, not hot holding)
    const { data: storageEquipment, error: storageError } = await supabaseAdmin
      .from('temperature_equipment')
      .select('id, name, equipment_type, location, created_at')
      .in('equipment_type', STORAGE_EQUIPMENT_TYPES)
      .order('name');

    if (storageError) {
      logger.warn('[QR Codes API] Error fetching storage areas:', storageError.message);
    } else if (storageEquipment) {
      entities.push(
        ...(storageEquipment as StorageEquipmentRow[]).map((s: StorageEquipmentRow) => ({
          id: s.id,
          name: s.name,
          type: 'storage-area' as const,
          subtitle: s.equipment_type || s.location || undefined,
          // Link to ingredients page filtered by this storage area
          destinationUrl: `${baseUrl}/webapp/ingredients?storage=${s.id}`,
          createdAt: s.created_at,
        })),
      );
    }

    // Fetch employees
    const { data: employees, error: employeesError } = await supabaseAdmin
      .from('employees')
      .select('id, full_name, role, created_at')
      .eq('status', 'active')
      .order('full_name');

    if (employeesError) {
      logger.warn('[QR Codes API] Error fetching employees:', employeesError.message);
    } else if (employees) {
      entities.push(
        ...(employees as EmployeeRow[]).map((e: EmployeeRow) => ({
          id: e.id,
          name: e.full_name,
          type: 'employee' as const,
          subtitle: e.role || undefined,
          destinationUrl: `${baseUrl}/webapp/employees?id=${e.id}`,
          createdAt: e.created_at,
        })),
      );
    }

    // Fetch suppliers
    const { data: suppliers, error: suppliersError } = await supabaseAdmin
      .from('suppliers')
      .select('id, supplier_name, created_at')
      .order('supplier_name');

    if (suppliersError) {
      logger.warn('[QR Codes API] Error fetching suppliers:', suppliersError.message);
    } else if (suppliers) {
      entities.push(
        ...(suppliers as SupplierRow[]).map((s: SupplierRow) => ({
          id: s.id,
          name: s.supplier_name,
          type: 'supplier' as const,
          destinationUrl: `${baseUrl}/webapp/suppliers?id=${s.id}`,
          createdAt: s.created_at,
        })),
      );
    }

    logger.info(`[QR Codes API] Returning ${entities.length} entities`);

    return NextResponse.json({
      success: true,
      entities,
      counts: {
        recipes: recipes?.length || 0,
        cleaningAreas: cleaningAreas?.length || 0,
        storageAreas: storageEquipment?.length || 0,
        employees: employees?.length || 0,
        suppliers: suppliers?.length || 0,
        total: entities.length,
      },
    });
  } catch (error) {
    logger.error('[QR Codes API] Error fetching entities:', error);
    return NextResponse.json({ error: 'Failed to fetch entities' }, { status: 500 });
  }
}
