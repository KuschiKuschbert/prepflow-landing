/**
 * Template variant type
 */
export type TemplateVariant =
  | 'default'
  | 'kitchen'
  | 'customer'
  | 'supplier'
  | 'compliance'
  | 'compact';

/**
 * Get recommended variant for a content type
 */
export function getRecommendedVariant(
  contentType: string,
  context: {
    isCustomerFacing?: boolean;
    isKitchenUse?: boolean;
    isAudit?: boolean;
    isSupplier?: boolean;
  } = {},
): TemplateVariant {
  const { isCustomerFacing, isKitchenUse, isAudit, isSupplier } = context;

  if (isSupplier || contentType === 'order-list') {
    return 'supplier';
  }

  if (
    isAudit ||
    contentType === 'compliance' ||
    contentType === 'temperature' ||
    contentType === 'cleaning'
  ) {
    return 'compliance';
  }

  if (isCustomerFacing || contentType === 'menu') {
    return 'customer';
  }

  if (isKitchenUse || contentType === 'prep-list') {
    return 'kitchen';
  }

  return 'default';
}

/**
 * Get variant description for UI display
 */
export function getVariantDescription(variant: TemplateVariant): string {
  const descriptions: Record<TemplateVariant, string> = {
    default: 'Standard format with full PrepFlow branding',
    kitchen: 'Compact layout with checkboxes for kitchen use',
    customer: 'Polished design for customer-facing menus',
    supplier: 'Purchase order format for supplier orders',
    compliance: 'Audit-ready formal layout for compliance reports',
    compact: 'Compact layout with minimal spacing',
  };
  return descriptions[variant] || descriptions.default;
}

/**
 * Get variant display name for UI
 */
export function getVariantDisplayName(variant: TemplateVariant): string {
  const names: Record<TemplateVariant, string> = {
    default: 'Standard',
    kitchen: 'Kitchen',
    customer: 'Customer',
    supplier: 'Supplier',
    compliance: 'Compliance',
    compact: 'Compact',
  };
  return names[variant] || 'Standard';
}

