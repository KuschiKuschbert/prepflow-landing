/**
 * CSS styles for menu display section in combined export
 */

export const menuDisplayStyles = `
  .menu-display {
    max-width: 100%;
    margin-bottom: 3rem;
    font-family: var(--pf-font-family-body);
    color: var(--pf-color-text-main);
  }

  .menu-category {
    page-break-inside: avoid;
    margin-bottom: 2.5rem;
    margin-top: 2rem;
  }

  .menu-category:first-of-type {
    margin-top: 0;
  }

  .menu-category-header {
    border-bottom-width: var(--pf-border-width);
    border-bottom-style: var(--pf-header-style);
    border-bottom-color: var(--pf-color-border);
    padding-bottom: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .menu-category-header h2 {
    font-family: var(--pf-font-family-header);
    font-size: 24px;
    font-weight: 700;
    color: var(--pf-color-text-header);
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .menu-items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .menu-item {
    page-break-inside: avoid;
    padding: 1.25rem;
    background: var(--pf-color-bg-content);
    border-radius: var(--pf-border-radius);
    border: var(--pf-border-width) solid var(--pf-color-border);
    box-shadow: var(--pf-shadow-content);
  }

  .menu-item-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }

  .menu-item-name {
    font-family: var(--pf-font-family-header);
    font-size: 18px;
    font-weight: 600;
    color: var(--pf-color-text-main);
    flex: 1;
    line-height: 1.3;
  }

  .menu-item-price {
    font-family: var(--pf-font-family-header);
    font-size: 18px;
    font-weight: 700;
    color: var(--pf-color-primary);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .menu-item-description {
    font-size: 14px;
    color: var(--pf-color-text-muted);
    line-height: 1.6;
    margin-top: 0.5rem;
  }

  @media print {
    .menu-display {
      background: transparent;
    }
  }
`;
