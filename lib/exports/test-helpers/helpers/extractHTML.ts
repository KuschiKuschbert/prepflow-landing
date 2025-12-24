/**
 * Extract CSS from HTML string
 */
export function extractCSS(html: string): string {
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/);
  return styleMatch ? styleMatch[1] : '';
}

/**
 * Extract content from HTML string
 */
export function extractContent(html: string): string {
  const contentMatch = html.match(
    /<div[^>]*class="[^"]*export-content[^"]*"[^>]*>([\s\S]*?)<\/div>/,
  );
  return contentMatch ? contentMatch[1] : '';
}
