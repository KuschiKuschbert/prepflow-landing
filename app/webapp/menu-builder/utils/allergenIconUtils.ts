/**
 * Allergen Icon Utilities for Print
 *
 * Converts Lucide React icons to SVG strings for print rendering
 */

/**
 * Get SVG string for allergen icon.
 *
 * @param {string} allergenCode - Allergen code (e.g., 'nuts', 'milk', 'eggs')
 * @returns {string} SVG string for the allergen icon
 */
export function getAllergenIconSVG(allergenCode: string): string {
  // SVG paths for Lucide icons (24x24 viewBox)
  const iconPaths: Record<string, string> = {
    nuts: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    milk: '<path d="M8 2h8M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 13h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    eggs: '<path d="M12 22c6.23-.05 7.87-5.57 7.5-10-.36-4.34-3.95-9.9-7.5-10-4.13.09-7.14 5.66-7.5 10-.37 4.43 1.27 9.95 7.5 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    soy: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="2" fill="currentColor"/>',
    gluten:
      '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    fish: '<path d="M2 16s9-15 20-4C11 23 2 16 2 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor"/><path d="M19 5s-1.789-1.577-3-1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    shellfish:
      '<path d="M2 16s9-15 20-4C11 23 2 16 2 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor"/><path d="M19 5s-1.789-1.577-3-1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    sesame:
      '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="currentColor"/>',
    lupin:
      '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 6v6M12 18v.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    sulphites:
      '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 9v4M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    mustard: '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>',
  };

  const path = iconPaths[allergenCode] || iconPaths.mustard; // Default to circle

  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: middle;">
    ${path}
  </svg>`;
}
