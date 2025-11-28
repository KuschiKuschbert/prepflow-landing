/**
 * Utility for calculating row styles based on item type.
 */

export function getRowStyles(isDish: boolean) {
  return {
    borderColor: isDish ? 'border-[#29E7CD]/30' : 'border-[#3B82F6]/30',
    bgColor: isDish ? 'bg-[#29E7CD]/2' : 'bg-[#3B82F6]/2',
    hoverColor: isDish ? 'hover:bg-[#29E7CD]/5' : 'hover:bg-[#3B82F6]/5',
    selectedColor: isDish ? 'bg-[#29E7CD]/10' : 'bg-[#3B82F6]/10',
  };
}
