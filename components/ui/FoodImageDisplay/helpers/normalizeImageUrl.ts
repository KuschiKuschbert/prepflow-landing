/**
 * Normalize image URL - handles both old JSON format and new string format.
 */
export function isValidBase64(str: string): boolean {
  if (!str || str.length === 0) return false;
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  return base64Regex.test(str);
}

export function normalizeImageUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') return null;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    if (url.startsWith('data:')) {
      const match = url.match(/^data:([^;]+);base64,(.+)$/);
      if (match && isValidBase64(match[2])) return url;
      return null;
    }
    return url;
  }
  try {
    const parsed = JSON.parse(url);
    if (typeof parsed === 'object' && parsed !== null) {
      if (parsed.imageUrl && typeof parsed.imageUrl === 'string') return parsed.imageUrl;
      if (parsed.imageData && typeof parsed.imageData === 'string') {
        if (!isValidBase64(parsed.imageData)) return null;
        const mimeType = parsed.mimeType || 'image/jpeg';
        return `data:${mimeType};base64,${parsed.imageData}`;
      }
    }
  } catch {}
  return null;
}
