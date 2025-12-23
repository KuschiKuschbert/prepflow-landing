/**
 * Background elements CSS
 */
export function getBackgroundStyles(): string {
  return `
    /* Background Elements */
    .background-grid {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background-image:
        linear-gradient(rgba(41,231,205,0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(59,130,246,0.06) 1px, transparent 1px);
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
      background: radial-gradient(closest-side, rgba(41,231,205,0.18), transparent 70%);
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
      background: radial-gradient(closest-side, rgba(217,37,199,0.16), transparent 70%);
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
      border: 1.5px solid rgba(41, 231, 205, 0.08);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .circle-1 { width: 80px; height: 80px; }
    .circle-2 { width: 130px; height: 130px; border-color: rgba(41, 231, 205, 0.06); }
    .circle-3 { width: 180px; height: 180px; border-color: rgba(41, 231, 205, 0.05); }
    .circle-4 { width: 230px; height: 230px; border-color: rgba(41, 231, 205, 0.04); }
  `;
}

