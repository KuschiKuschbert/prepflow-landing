import type { TemplateVariant } from '../../template-utils';

/**
 * Validate HTML structure for export templates
 */
export function validateExportHTML(html: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!html.includes('<!DOCTYPE html>')) {
    errors.push('Missing DOCTYPE declaration');
  }

  if (!html.includes('<html')) {
    errors.push('Missing <html> tag');
  }

  if (!html.includes('<head>')) {
    errors.push('Missing <head> tag');
  }

  if (!html.includes('<body')) {
    errors.push('Missing <body> tag');
  }

  if (!html.includes('<style>') && !html.includes('<style ')) {
    errors.push('Missing <style> tag');
  }

  if (!html.includes('content-wrapper')) {
    errors.push('Missing content-wrapper class');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate template variant is correctly applied
 */
export function validateVariant(html: string, variant: TemplateVariant): boolean {
  const variantClass = `variant-${variant}`;
  return (
    html.includes(variantClass) ||
    html.includes(`class="${variantClass}"`) ||
    html.includes(`class='${variantClass}'`)
  );
}

/**
 * Check if HTML contains required Cyber Carrot branding elements
 */
export function hasAppropriateBranding(html: string, variant: TemplateVariant): boolean {
  if (variant === 'default') {
    return html.includes('PrepFlow') || html.includes('prepflow');
  }

  if (variant === 'kitchen' || variant === 'compact') {
    return !html.includes('background-grid') && !html.includes('corner-glow');
  }

  return true;
}
