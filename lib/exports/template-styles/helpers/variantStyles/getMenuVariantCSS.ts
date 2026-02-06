/**
 * Get menu variant styles (restaurant-style, centered, elegant)
 *
 * @returns {string} CSS for menu variant
 */
export function getMenuVariantCSS(): string {
  return `
    /* Modern Menu Variant */

    .menu-display {
      max-width: 100%;
    }

    .menu-category {
      page-break-inside: avoid;
      margin-bottom: 3rem;
    }

    .menu-category-header {
      border-bottom: 2px solid var(--pf-color-primary);
      padding-bottom: 1rem;
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .menu-category-header h2 {
      font-size: 2rem;
      font-weight: 800;
      color: var(--pf-color-primary);
      margin: 0;
      text-transform: uppercase;
      letter-spacing: -0.02em;
    }

    .menu-items-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .menu-item {
      page-break-inside: avoid;
      padding: 1.5rem;
      background: var(--pf-color-bg-content);
      border-radius: var(--pf-border-radius);
      border: 1px solid var(--pf-color-border);
      box-shadow: var(--pf-shadow-content);
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    }

    /* Decorative left accent */
    .menu-item::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: transparent;
      transition: background 0.2s ease;
    }

    /* Highlight accent for items with higher price or special logic if we had classes,
       but for now just keeping it clean */

    .menu-item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 0.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      padding-bottom: 0.75rem;
    }

    .menu-item-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--pf-color-text-header);
      flex: 1;
      line-height: 1.2;
    }

    .menu-item-price {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--pf-color-primary);
      white-space: nowrap;
      flex-shrink: 0;
      font-family: var(--pf-font-family-header);
    }

    .menu-item-description {
      font-size: 0.95rem;
      color: var(--pf-color-text-muted);
      line-height: 1.5;
      margin-top: auto; /* Push to bottom if we want aligned heights, but auto-fill grid handles heights */
      padding-top: 0.75rem;
    }

    /* Restaurant-style alternative layout (if .variant-menu class is used on body) */
    body.variant-menu {
       background: var(--pf-color-bg-page);
       padding: 40px;
    }

    body.variant-menu .menu-items-grid {
       /* Single column for more formal menus? Or keep grid. Keeping grid is modern. */
    }

    /* Density Variants */
    .menu-display.density-compact .menu-category {
      margin-bottom: 2rem;
    }

    .menu-display.density-compact .menu-category-header {
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;
    }

    .menu-display.density-compact .menu-category-header h2 {
      font-size: 1.5rem;
    }

    .menu-display.density-compact .menu-items-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }

    .menu-display.density-compact .menu-item {
      padding: 1rem;
    }

    .menu-display.density-compact .menu-item-name {
      font-size: 1.1rem;
    }

    .menu-display.density-compact .menu-item-price {
      font-size: 1.1rem;
    }

    /* Ultra Compact (List View) */
    .menu-display.density-ultra-compact .menu-category {
      margin-bottom: 1.5rem;
      page-break-inside: auto; /* Allow breaking inside categories for long lists */
    }

    .menu-display.density-ultra-compact .menu-category-header {
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom-width: 1px;
    }

    .menu-display.density-ultra-compact .menu-category-header h2 {
      font-size: 1.25rem;
    }

    .menu-display.density-ultra-compact .menu-items-grid {
      display: block; /* Switch to list */
    }

    .menu-display.density-ultra-compact .menu-item {
      display: flex;
      flex-direction: row;
      align-items: baseline;
      padding: 0.75rem 0;
      background: transparent;
      border: none;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      border-radius: 0;
      box-shadow: none;
      margin-bottom: 0;
      gap: 1rem;
    }

    .menu-display.density-ultra-compact .menu-item::before {
      display: none;
    }

    .menu-display.density-ultra-compact .menu-item-header {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
      width: 40%; /* Fixed width for name/price column */
      flex-shrink: 0;
    }

    .menu-display.density-ultra-compact .menu-item-description {
      margin-top: 0;
      padding-top: 0;
      font-size: 0.9rem;
      flex: 1;
    }

    @media print {
      .menu-category-header {
        border-bottom-color: #000;
      }

      .menu-category-header h2 {
        color: #000;
      }

      .menu-item {
        background: #ffffff;
        border-color: #e5e5e5;
        box-shadow: none;
      }

      .menu-item-name {
        color: #000;
      }

      .menu-item-price {
        color: #000;
      }

      .menu-item-description {
        color: #444;
      }

      .menu-item-header {
        border-bottom-color: #eee;
      }
    }
  `;
}
