import type { QRCodeEntity } from '../types';
import { typeConfig } from '../config';

/**
 * Group entities by type
 */
export function groupEntities(entities: QRCodeEntity[]): Record<string, QRCodeEntity[]> {
  return entities.reduce(
    (acc, entity) => {
      if (!acc[entity.type]) {
        acc[entity.type] = [];
      }
      acc[entity.type].push(entity);
      return acc;
    },
    {} as Record<string, QRCodeEntity[]>,
  );
}

/**
 * Sort entity types by order
 */
export function sortEntityTypes(types: string[]): string[] {
  return types.sort((a, b) => {
    return (typeConfig[a]?.order || 99) - (typeConfig[b]?.order || 99);
  });
}
