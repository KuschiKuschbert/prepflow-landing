import { ExportTheme } from '../../themes';

export function getThemeBackgroundCSS(theme: ExportTheme): string {
  let backgroundPattern = '';

  switch (theme) {
    case 'cyber-carrot':
      // Concentric circles (Target-like)
      backgroundPattern = `
        background-color: var(--pf-color-bg-page);
        background-image:
          radial-gradient(circle at 50% 50%, transparent 0%, transparent 10%, var(--pf-color-accent) 10%, var(--pf-color-accent) 10.5%, transparent 10.5%),
          radial-gradient(circle at 50% 50%, transparent 0%, transparent 20%, var(--pf-color-primary) 20%, var(--pf-color-primary) 20.5%, transparent 20.5%),
          radial-gradient(circle at 50% 50%, transparent 0%, transparent 30%, var(--pf-color-accent) 30%, var(--pf-color-accent) 30.5%, transparent 30.5%),
          radial-gradient(circle at 50% 50%, transparent 0%, transparent 40%, var(--pf-color-primary) 40%, var(--pf-color-primary) 40.5%, transparent 40.5%);
        background-size: 100% 100%;
        background-attachment: fixed;
        opacity: 0.4;
      `;
      break;

    case 'electric-lemon':
      // Geometric Triangles
      backgroundPattern = `
        background-color: var(--pf-color-bg-page);
        background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 30H0L20 0Z' stroke='%23FACC15' stroke-width='1' fill='none' fill-opacity='0.2'/%3E%3C/svg%3E");
        background-size: 80px 80px;
        opacity: 0.35;
      `;
      break;

    case 'phantom-pepper':
      // Organic Dots / Mycelium -> Ghost Dots - Boosted opacity
      backgroundPattern = `
        background-color: var(--pf-color-bg-page);
        background-image: radial-gradient(#d4d4d8 1px, transparent 1px);
        background-size: 24px 24px;
        opacity: 0.4;
      `;
      break;

    case 'cosmic-blueberry':
      // Starfield - Enhanced
      backgroundPattern = `
        background-color: var(--pf-color-bg-page);
        background-image:
          radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 3px),
          radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 2px),
          radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 3px);
        background-size: 550px 550px, 350px 350px, 250px 250px;
        background-position: 0 0, 40px 60px, 130px 270px;
        opacity: 0.7;
      `;
      break;

    default:
      backgroundPattern = 'background-color: var(--pf-color-bg-page);';
  }

  return `
    .print-background-layer {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
      ${backgroundPattern.replace(/\n\s+/g, ' ')}
    }

    /* Ensure content sits above background */
    body {
       position: relative;
       min-height: 100vh;
    }
  `;
}
