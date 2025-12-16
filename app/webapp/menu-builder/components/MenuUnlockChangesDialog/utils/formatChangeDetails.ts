import { MenuChangeTracking } from '@/lib/menu-lock/change-tracking';

/**
 * Format change details for display
 */
export function formatChangeDetails(change: MenuChangeTracking): string {
  const details = change.change_details;
  if (!details || typeof details !== 'object') {
    return change.change_type.replace(/_/g, ' ');
  }

  const parts: string[] = [];

  // Price changes
  if (details.price) {
    const { before, after, change: changeType } = details.price;
    if (before !== undefined && after !== undefined) {
      parts.push(`Price ${changeType} from $${before.toFixed(2)} to $${after.toFixed(2)}`);
    } else {
      parts.push('Price changed');
    }
  }

  // Yield changes
  if (details.yield) {
    const { before, after, change: changeType } = details.yield;
    if (before !== undefined && after !== undefined) {
      parts.push(`Yield ${changeType} from ${before} to ${after}`);
    } else {
      parts.push('Yield changed');
    }
  }

  // Ingredients changes
  if (details.ingredients) {
    parts.push('Ingredients updated');
  }

  // Recipes changes
  if (details.recipes) {
    parts.push('Recipes updated');
  }

  // Cost changes (for ingredients)
  if (
    details.cost_per_unit ||
    details.cost_per_unit_as_purchased ||
    details.cost_per_unit_incl_trim
  ) {
    parts.push('Cost updated');
  }

  // Instructions changes
  if (details.instructions) {
    parts.push('Instructions updated');
  }

  // Description changes
  if (details.description) {
    parts.push('Description updated');
  }

  if (parts.length === 0) {
    return change.change_type.replace(/_/g, ' ');
  }

  return parts.join(', ');
}



