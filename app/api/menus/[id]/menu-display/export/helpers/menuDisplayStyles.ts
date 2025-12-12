/**
 * CSS styles for menu display export
 */

export const menuDisplayStyles = `
  .menu-display {
    max-width: 100%;
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
    border-bottom: 2px solid rgba(41, 231, 205, 0.3);
    padding-bottom: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .menu-category-header h2 {
    font-size: 24px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.95);
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
    background: rgba(42, 42, 42, 0.3);
    border-radius: 12px;
    border: 1px solid rgba(42, 42, 42, 0.5);
    transition: all 0.2s ease;
  }

  .menu-item:hover {
    border-color: rgba(41, 231, 205, 0.5);
    background: rgba(42, 42, 42, 0.4);
  }

  .menu-item-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }

  .menu-item-name {
    font-size: 18px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.95);
    flex: 1;
    line-height: 1.3;
  }

  .menu-item-price {
    font-size: 18px;
    font-weight: 700;
    color: #29E7CD;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .menu-item-description {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
    margin-top: 0.5rem;
  }

  @media print {
    .menu-display {
      background: #ffffff;
    }

    .menu-category-header {
      border-bottom-color: #000;
    }

    .menu-category-header h2 {
      color: #000;
    }

    .menu-item {
      background: #f9f9f9;
      border-color: #e0e0e0;
      page-break-inside: avoid;
    }

    .menu-item-name {
      color: #000;
    }

    .menu-item-price {
      color: #000;
    }

    .menu-item-description {
      color: #333;
    }

    .menu-items-grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
  }
`;




