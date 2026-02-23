/**
 * Base and event info styles for runsheet variant
 */
export function getRunsheetBaseCSS(): string {
  return `
    body.variant-runsheet {
      background: var(--pf-color-bg-page);
      padding: 10px;
      font-family: var(--pf-font-family-body);
    }

    .variant-runsheet .content-wrapper {
      background: var(--pf-color-bg-content);
      box-shadow: none;
      padding: 16px;
      max-width: 100%;
      border-radius: var(--pf-border-radius);
    }

    .variant-runsheet .header {
      padding-bottom: 12px;
      margin-bottom: 16px;
      border-bottom: 2px solid var(--pf-color-primary);
    }

    .variant-runsheet .header-content h1 {
      font-size: 20px;
      font-weight: 600;
      font-family: var(--pf-font-family-header);
      color: var(--pf-color-text-header);
      background: none;
      -webkit-text-fill-color: var(--pf-color-text-header);
      margin: 0;
    }

    .variant-runsheet .header-content h2 {
      font-size: 14px;
      font-family: var(--pf-font-family-body);
      color: var(--pf-color-text-muted);
      margin: 4px 0 0 0;
    }

    .variant-runsheet .header-meta {
      font-family: var(--pf-font-family-body);
      color: var(--pf-color-text-muted);
      font-size: 12px;
    }

    .variant-runsheet .export-content {
      margin-top: 0;
    }

    .runsheet-event-info {
      margin-bottom: 20px;
      padding: 16px;
      background: color-mix(in srgb, var(--pf-color-border) 12%, transparent);
      border-left: 4px solid var(--pf-color-primary);
      border-radius: 8px;
      font-size: 13px;
      font-family: var(--pf-font-family-body);
      color: var(--pf-color-text-main);
    }

    .runsheet-event-info p {
      margin: 4px 0;
    }

    .runsheet-event-info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px 32px;
      margin-bottom: 16px;
    }

    .runsheet-event-info-section {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .runsheet-event-info-section-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--pf-color-primary);
      margin-bottom: 2px;
    }

    .runsheet-event-info-notes {
      grid-column: 1 / -1;
      margin-top: 4px;
      padding-top: 12px;
      border-top: 1px solid var(--pf-color-border);
    }
  `;
}
