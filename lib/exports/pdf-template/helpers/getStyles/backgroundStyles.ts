import { ExportTheme, themes } from '@/lib/exports/themes';

/**
 * Background elements CSS
 */
export function getBackgroundStyles(theme: ExportTheme = 'cyber-carrot'): string {
  const config = themes[theme] || themes['cyber-carrot'];
  const primary = config.cssVariables['--pf-color-primary'];
  const secondary = config.cssVariables['--pf-color-secondary'];

  return `
    /* Background Elements */
    .background-grid {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background-image:
        linear-gradient(${primary}14 1px, transparent 1px),
        linear-gradient(90deg, ${secondary}0F 1px, transparent 1px);
      background-size: 48px 48px;
      background-position: 0px 0px, 0px 0px;
      opacity: 0.6;
    }

    .corner-glow-cyan {
      position: fixed;
      left: 0;
      top: 0;
      width: 420px;
      height: 420px;
      pointer-events: none;
      z-index: 0;
      background: radial-gradient(closest-side, ${primary}2D, transparent 70%);
      opacity: 0.5;
    }

    .corner-glow-magenta {
      position: fixed;
      right: 0;
      top: 120px;
      width: 400px;
      height: 400px;
      pointer-events: none;
      z-index: 0;
      background: radial-gradient(closest-side, ${secondary}28, transparent 70%);
      opacity: 0.5;
    }

    .concentric-circles {
      position: fixed;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 400px;
      height: 400px;
      pointer-events: none;
      z-index: 0;
      opacity: 0.3;
    }

    .circle {
      position: absolute;
      border-radius: 50%;
      border: 1.5px solid ${primary}14;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .circle-1 { width: 80px; height: 80px; }
    .circle-2 { width: 130px; height: 130px; border-color: ${primary}0F; }
    .circle-3 { width: 180px; height: 180px; border-color: ${primary}0D; }
    .circle-4 { width: 230px; height: 230px; border-color: ${primary}0A; }
  `;
}
