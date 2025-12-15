/**
 * Unified share utilities
 * Provides consistent sharing functionality across all pages
 * Supports copy link, Web Share API, email, and PDF sharing
 */

import { logger } from '@/lib/logger';

export interface ShareOptions {
  title: string;
  text?: string;
  url?: string;
  files?: File[];
}

/**
 * Copy text to clipboard with fallback support
 *
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch (err) {
        document.body.removeChild(textArea);
        logger.error('[Share Utils] Clipboard fallback failed:', err);
        return false;
      }
    }
  } catch (err) {
    logger.error('[Share Utils] Clipboard copy failed:', err);
    return false;
  }
}

/**
 * Generate shareable URL with current filters/search params
 *
 * @param {string} basePath - Base path (e.g., '/webapp/recipes')
 * @param {Record<string, string>} params - URL parameters to include
 * @returns {string} Full shareable URL
 */
export function generateShareableUrl(basePath: string, params?: Record<string, string>): string {
  if (typeof window === 'undefined') {
    return basePath;
  }

  const baseUrl = window.location.origin;
  const url = new URL(basePath, baseUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      }
    });
  }

  return url.toString();
}

/**
 * Copy current page URL to clipboard
 *
 * @param {Record<string, string>} params - Additional parameters to include
 * @returns {Promise<boolean>} Success status
 */
export async function copyCurrentPageUrl(params?: Record<string, string>): Promise<boolean> {
  if (typeof window === 'undefined') {
    return false;
  }

  const url = generateShareableUrl(window.location.pathname, params);
  return copyToClipboard(url);
}

/**
 * Use Web Share API if available (mobile devices)
 *
 * @param {ShareOptions} options - Share options
 * @returns {Promise<boolean>} Success status (false if not supported)
 */
export async function shareViaWebAPI(options: ShareOptions): Promise<boolean> {
  if (!navigator.share) {
    return false;
  }

  try {
    const shareData: ShareData = {
      title: options.title,
      text: options.text,
      url: options.url || window.location.href,
    };

    await navigator.share(shareData);
    return true;
  } catch (err: any) {
    // User cancelled or error occurred
    if (err.name !== 'AbortError') {
      logger.error('[Share Utils] Web Share API failed:', err);
    }
    return false;
  }
}

/**
 * Share via email (mailto link)
 *
 * @param {string} recipient - Email recipient
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 * @returns {void} Opens email client
 */
export function shareViaEmail(recipient: string, subject: string, body: string): void {
  const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoLink;
}

/**
 * Check if Web Share API is available
 *
 * @returns {boolean} True if Web Share API is supported
 */
export function isWebShareAPIAvailable(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.share;
}

/**
 * Check if clipboard API is available
 *
 * @returns {boolean} True if clipboard API is supported
 */
export function isClipboardAPIAvailable(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.clipboard;
}
