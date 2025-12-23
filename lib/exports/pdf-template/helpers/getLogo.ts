/**
 * Get PrepFlow logo URL or inline SVG
 * Client-safe: Uses public URL or inline SVG fallback (no filesystem access)
 */
export function getLogoUrl(): string {
  // Use public URL for logo (works in both client and server contexts)
  // For HTML exports, this will work as a relative URL
  // For PDF exports via API, the server can handle the logo separately if needed
  return '/images/prepflow-logo.png';
}

/**
 * Get inline SVG logo as base64 data URI (fallback)
 * Used when public URL is not available (e.g., in standalone HTML files)
 * Client-safe: Uses browser APIs only
 */
export function getInlineSVGLogo(): string {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" width="200" height="80"><defs><linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#29E7CD;stop-opacity:0.9" /><stop offset="100%" style="stop-color:#29E7CD;stop-opacity:0.6" /></linearGradient><linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#3B82F6;stop-opacity:0.8" /><stop offset="100%" style="stop-color:#3B82F6;stop-opacity:0.5" /></linearGradient><linearGradient id="magentaGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#D925C7;stop-opacity:0.9" /><stop offset="100%" style="stop-color:#D925C7;stop-opacity:0.6" /></linearGradient><pattern id="wavePattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M0,10 Q5,5 10,10 T20,10" stroke="rgba(255,255,255,0.3)" stroke-width="1" fill="none"/></pattern></defs><ellipse cx="30" cy="25" rx="18" ry="15" fill="url(#cyanGradient)" opacity="0.85"/><rect x="20" y="20" width="35" height="25" rx="8" fill="url(#blueGradient)" opacity="0.75"/><rect x="20" y="20" width="35" height="25" rx="8" fill="url(#wavePattern)" opacity="0.4"/><rect x="25" y="30" width="30" height="20" rx="6" fill="url(#magentaGradient)" opacity="0.8" transform="rotate(-15 40 40)"/><g opacity="0.7"><path d="M 55 20 Q 65 15 75 18" stroke="#D925C7" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="75" cy="18" r="2" fill="#D925C7"/><path d="M 58 25 Q 68 20 78 23" stroke="#D925C7" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="78" cy="23" r="2" fill="#D925C7"/><path d="M 60 30 Q 70 25 80 28" stroke="#D925C7" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="80" cy="28" r="2" fill="#D925C7"/></g><circle cx="15" cy="50" r="6" fill="#29E7CD" opacity="0.8"/><circle cx="20" cy="58" r="4" fill="#D925C7" opacity="0.8"/><circle cx="75" cy="45" r="7" fill="#29E7CD" opacity="0.7"/><text x="100" y="45" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="600" fill="white" letter-spacing="-0.5"><tspan font-weight="700">P</tspan>rep<tspan font-weight="700">F</tspan>low</text></svg>`;

  // Convert SVG to base64 data URI (client-safe, works in browser)
  // Use btoa which is available in all browsers
  try {
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgContent)));
  } catch {
    // Fallback: return SVG as data URI without base64 encoding
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);
  }
}
