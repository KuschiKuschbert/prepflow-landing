import crypto from 'crypto';

export function generateDeterministicId(namespace: string, value: string): string {
  const hash = crypto.createHash('sha1').update(`${namespace}:${value}`).digest('hex');
  // Convert to UUID-like string from SHA1 hex
  return `${hash.substring(0, 8)}-${hash.substring(8, 12)}-${hash.substring(12, 16)}-${hash.substring(16, 20)}-${hash.substring(20, 32)}`;
}

export function normalizeIngredientName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

export function toCents(valueAud: number): number {
  return Math.round(valueAud * 100);
}

export type UpsertResult = {
  success: boolean;
  error?: string;
};
