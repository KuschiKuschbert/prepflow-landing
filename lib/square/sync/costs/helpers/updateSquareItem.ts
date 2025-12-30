/**
 * Update Square catalog item with cost data.
 */
import { logger } from '@/lib/logger';
import { SquareClient } from 'square';
import type { CostData } from '../../costs';

/**
 * Update Square catalog item with cost data using custom attributes
 */
export async function updateSquareItemCosts(
  client: SquareClient,
  squareItemId: string,
  costs: CostData,
): Promise<boolean> {
  try {
    const catalogApi = client.catalog;

    // Create custom attribute values for cost data
    const customAttributes = [
      {
        type: 'STRING',
        name: 'prepflow_total_cost',
        stringValue: costs.total_cost.toFixed(4),
      },
      {
        type: 'STRING',
        name: 'prepflow_food_cost_percent',
        stringValue: costs.food_cost_percent.toFixed(2),
      },
      {
        type: 'STRING',
        name: 'prepflow_gross_profit',
        stringValue: costs.gross_profit.toFixed(4),
      },
      {
        type: 'STRING',
        name: 'prepflow_gross_profit_margin',
        stringValue: costs.gross_profit_margin.toFixed(2),
      },
      {
        type: 'STRING',
        name: 'prepflow_contributing_margin',
        stringValue: costs.contributing_margin.toFixed(4),
      },
      {
        type: 'STRING',
        name: 'prepflow_contributing_margin_percent',
        stringValue: costs.contributing_margin_percent.toFixed(2),
      },
      {
        type: 'STRING',
        name: 'prepflow_cost_last_updated',
        stringValue: costs.last_updated,
      },
    ];

    // Update catalog object with custom attributes
    // Note: Square API requires updating the entire object, so we need to fetch first
    const getResponse = await (catalogApi as any).retrieveCatalogObject(squareItemId, true);

    if (!getResponse.result?.object) {
      logger.error('[Square Cost Sync] Square catalog item not found:', { squareItemId });
      return false;
    }

    const existingObject = getResponse.result.object;
    const existingItemData = existingObject.itemData;

    if (!existingItemData) {
      logger.error('[Square Cost Sync] Square catalog item data not found:', { squareItemId });
      return false;
    }

    // Update with custom attributes
    const updateResponse = await (catalogApi as any).upsertCatalogObject({
      idempotencyKey: `${squareItemId}-cost-${Date.now()}`,
      object: {
        type: 'ITEM',
        id: squareItemId,
        itemData: {
          ...existingItemData,
          customAttributeValues: customAttributes.reduce(
            (acc, attr) => {
              acc[attr.name] = {
                type: attr.type,
                name: attr.name,
                stringValue: attr.stringValue,
              };
              return acc;
            },
            {} as Record<string, any>,
          ),
        },
      },
    });

    if (updateResponse.result?.catalogObject) {
      logger.dev('[Square Cost Sync] Successfully updated Square item costs:', {
        squareItemId,
        totalCost: costs.total_cost,
        foodCostPercent: costs.food_cost_percent,
      });
      return true;
    } else {
      logger.error('[Square Cost Sync] Failed to update Square item costs:', { squareItemId });
      return false;
    }
  } catch (error: any) {
    logger.error('[Square Cost Sync] Error updating Square item costs:', {
      error: error.message,
      squareItemId,
      stack: error.stack,
    });
    return false;
  }
}


