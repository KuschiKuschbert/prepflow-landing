/**
 * Utility for calculating row styles based on item type.
 */

export function getRowStyles(isDish: boolean) {
  return {
    borderColor: isDish ? 'border-[var(--primary)]/30' : 'border-[var(--color-info)]/30',
    bgColor: isDish ? 'bg-[var(--primary)]/2' : 'bg-[var(--color-info)]/2',
    hoverColor: isDish ? 'hover:bg-[var(--primary)]/5' : 'hover:bg-[var(--color-info)]/5',
    selectedColor: isDish ? 'bg-[var(--primary)]/10' : 'bg-[var(--color-info)]/10',
  };
}
