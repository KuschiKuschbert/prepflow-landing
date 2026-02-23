import {
  Snowflake,
  Flame,
  Package,
  Thermometer,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  LucideIcon,
} from 'lucide-react';

export const temperatureTypes = [
  { value: 'fridge', label: 'Fridge', icon: Snowflake },
  { value: 'freezer', label: 'Freezer', icon: Snowflake },
  { value: 'food_cooking', label: 'Food Cooking', icon: Flame },
  { value: 'food_hot_holding', label: 'Food Hot Holding', icon: Flame },
  { value: 'food_cold_holding', label: 'Food Cold Holding', icon: Snowflake },
  { value: 'storage', label: 'Storage', icon: Package },
];

/**
 * Temperature types for select options (label only; native <option> cannot render icons).
 */
export const temperatureTypesForSelect: Array<{ value: string; label: string; icon: string }> = [
  { value: 'fridge', label: 'Fridge', icon: '' },
  { value: 'freezer', label: 'Freezer', icon: '' },
  { value: 'food_cooking', label: 'Food Cooking', icon: '' },
  { value: 'food_hot_holding', label: 'Food Hot Holding', icon: '' },
  { value: 'food_cold_holding', label: 'Food Cold Holding', icon: '' },
  { value: 'storage', label: 'Storage', icon: '' },
];

/**
 * Get Lucide icon component for equipment type
 */
export function getTypeIconComponent(type: string): LucideIcon {
  const typeInfo = temperatureTypes.find(t => t.value === type);
  return typeInfo?.icon || Thermometer;
}

/**
 * @deprecated Use getTypeIconComponent instead. Kept for backward compatibility.
 */
export function getTypeIcon(_type: string): string {
  // Return empty string - components should use getTypeIconComponent with Icon wrapper
  return '';
}

export function getTypeLabel(type: string): string {
  const typeInfo = temperatureTypes.find(t => t.value === type);
  return typeInfo?.label || type;
}

export function getFoodSafetyStatus(temp: number, logTime: string, logDate: string, type: string) {
  if (type !== 'food_cooking' && type !== 'food_hot_holding' && type !== 'food_cold_holding') {
    return null;
  }

  if (temp < 5 || temp > 60) {
    return {
      status: 'safe',
      message: 'Outside danger zone',
      color: 'text-[var(--color-success)]',
      icon: CheckCircle2,
    };
  }

  const logDateTime = new Date(`${logDate}T${logTime}`);
  const now = new Date();
  const hoursInDangerZone = (now.getTime() - logDateTime.getTime()) / (1000 * 60 * 60);

  if (hoursInDangerZone < 2) {
    return {
      status: 'safe',
      message: `${(2 - hoursInDangerZone).toFixed(1)}h remaining - can refrigerate`,
      color: 'text-[var(--color-success)]',
      icon: CheckCircle2,
    };
  } else if (hoursInDangerZone < 4) {
    return {
      status: 'warning',
      message: `${(4 - hoursInDangerZone).toFixed(1)}h remaining - use immediately`,
      color: 'text-[var(--color-warning)]',
      icon: AlertTriangle,
    };
  } else {
    return {
      status: 'danger',
      message: `${hoursInDangerZone.toFixed(1)}h in danger zone - DISCARD`,
      color: 'text-[var(--color-error)]',
      icon: AlertCircle,
    };
  }
}
