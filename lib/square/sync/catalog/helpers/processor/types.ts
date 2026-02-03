import { CatalogItem, SquareClient } from 'square';

export type CatalogApi = SquareClient['catalog'];

/**
 * Square item data payload for create/update operations.
 * Uses the CatalogItem type from the Square SDK.
 */
export interface SquareItemPayload {
  id?: string;
  itemData: CatalogItem;
}
