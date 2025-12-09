import type { TemperatureEquipment } from '../../../types';

/**
 * Convert equipment to format expected by TemperatureFilters component
 */
export function convertEquipmentForFilters(equipment: TemperatureEquipment[]): Array<{
  id?: number;
  name: string;
  equipment_type: string;
  is_active: boolean;
}> {
  return equipment.map((eq: TemperatureEquipment) => {
    const parsedId = eq.id && !isNaN(parseInt(eq.id, 10)) ? parseInt(eq.id, 10) : undefined;
    return {
      id: parsedId,
      name: eq.name,
      equipment_type: eq.equipment_type,
      is_active: eq.is_active,
    };
  });
}
