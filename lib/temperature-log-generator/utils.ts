import { getRecommendedTempRange, getStricterTempRange } from '../temperature-standards';

export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export function generateTemperature(
  equipmentType: string,
  countryCode: string,
  equipmentMin: number | null,
  equipmentMax: number | null,
  isOutOfRange: boolean = false,
): number {
  const regionalRange = getRecommendedTempRange(equipmentType, countryCode);
  const strictRange = getStricterTempRange(regionalRange, equipmentMin, equipmentMax);
  if (isOutOfRange) {
    const type = equipmentType.toLowerCase();
    if (type.includes('freezer')) return randomFloat(strictRange.max + 1, strictRange.max + 5);
    if (type.includes('hot')) return randomFloat(strictRange.min - 5, strictRange.min - 1);
    return Math.random() > 0.5
      ? randomFloat(strictRange.max + 1, strictRange.max + 3)
      : randomFloat(strictRange.min - 3, strictRange.min - 1);
  }
  const variance = (strictRange.max - strictRange.min) * 0.1;
  return parseFloat(randomFloat(strictRange.min + variance, strictRange.max - variance).toFixed(1));
}

export function generateTimeForCheck(isEvening: boolean): { hour: number; minute: number } {
  return isEvening
    ? { hour: randomInt(17, 21), minute: randomInt(0, 59) }
    : { hour: randomInt(6, 10), minute: randomInt(0, 59) };
}
