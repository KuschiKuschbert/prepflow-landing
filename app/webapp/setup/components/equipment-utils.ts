import { equipmentTypes } from './equipment-config';

export function getDefaultTemps(type: string) {
  const typeInfo = equipmentTypes.find(t => t.value === type);
  return { min: typeInfo?.defaultMin || 0, max: typeInfo?.defaultMax || 10 };
}

export function getEquipmentIcon(type: string): string {
  const typeInfo = equipmentTypes.find(t => t.value === type);
  return typeInfo?.icon || '🌡️';
}

export function getEquipmentLabel(type: string): string {
  const typeInfo = equipmentTypes.find(t => t.value === type);
  return typeInfo?.label || type;
}
