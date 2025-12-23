/**
 * Validate base64 string format
 */
export function isValidBase64(str: string): boolean {
  if (!str || str.length === 0) return false;
  // Base64 regex: allows A-Z, a-z, 0-9, +, /, = (padding)
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  return base64Regex.test(str);
}
