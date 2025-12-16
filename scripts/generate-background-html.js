/**
 * Generate background HTML template
 * Extracted from generate-background-png.js to reduce file size
 */

function generateBackgroundHTML() {
  // Background theme values from lib/theme.ts
  const gridSizePx = 48;
  const gridCyanOpacity = 0.08;
  const gridBlueOpacity = 0.06;
  const cornerCyanOpacity = 0.18;
  const cornerMagentaOpacity = 0.16;

  // Fixed mouse position (center of screen for static image)
  const mouseX = 960; // Half of 1920
  const mouseY = 540; // Half of 1080

  // Logo watermark positions (3 instances)
  const logoPositions = [
    { x: 10, y: 15, rotation: 0, scale: 0.8 },
    { x: 40, y: 40, rotation: 15, scale: 0.9 },
    { x: 70, y: 65, rotation: 30, scale: 1.0 },
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PrepFlow Background</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      width: 1920px;
      height: 1080px;
      overflow: hidden;
      position: relative;
    }

    .base-gradient {
      position: absolute;
      inset: 0;
      z-index: 1;
      background: linear-gradient(180deg, rgba(10,10,10,1) 0%, rgba(8,8,10,1) 100%);
    }

    .spotlight {
      position: absolute;
      inset: 0;
      z-index: 2;
      pointer-events: none;
      background: radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(41, 231, 205, 0.06), transparent 40%);
    }

    .logo-watermark {
      position: absolute;
      pointer-events: none;
      z-index: 3;
      opacity: 0.02;
      width: 300px;
      height: 300px;
    }

    .grid {
      position: absolute;
      inset: 0;
      z-index: 4;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(41,231,205,${gridCyanOpacity}) 1px, transparent 1px),
        linear-gradient(90deg, rgba(59,130,246,${gridBlueOpacity}) 1px, transparent 1px);
      background-size: ${gridSizePx}px ${gridSizePx}px;
      background-position: 0px 0px, 0px 0px;
      mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
      -webkit-mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
    }

    .corner-glow-cyan {
      position: absolute;
      left: 0;
      top: 0;
      width: 420px;
      height: 420px;
      z-index: 5;
      pointer-events: none;
      background: radial-gradient(closest-side, rgba(41,231,205,${cornerCyanOpacity}), transparent 70%);
    }

    .corner-glow-magenta {
      position: absolute;
      right: 0;
      top: 120px;
      width: 400px;
      height: 400px;
      z-index: 5;
      pointer-events: none;
      background: radial-gradient(closest-side, rgba(217,37,199,${cornerMagentaOpacity}), transparent 70%);
    }

    .noise {
      position: absolute;
      inset: 0;
      z-index: 6;
      pointer-events: none;
      opacity: 0.02;
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/></filter><rect width="64" height="64" filter="url(%23n)" opacity="0.5"/></svg>');
      background-size: 256px 256px;
    }
  </style>
</head>
<body>
  <div class="base-gradient"></div>
  <div class="spotlight"></div>
  ${logoPositions
    .map(
      pos => `
    <svg
      class="logo-watermark"
      style="left: ${pos.x}%; top: ${pos.y}%; transform: rotate(${pos.rotation}deg) scale(${pos.scale});"
      width="300"
      height="300"
      viewBox="0 0 300 300"
    >
      <circle cx="150" cy="150" r="100" fill="rgba(41,231,205,0.02)" stroke="rgba(41,231,205,0.04)" stroke-width="2"/>
    </svg>
  `,
    )
    .join('')}
  <div class="grid"></div>
  <div class="corner-glow-cyan"></div>
  <div class="corner-glow-magenta"></div>
  <div class="noise"></div>
</body>
</html>`;
}

module.exports = { generateBackgroundHTML };



