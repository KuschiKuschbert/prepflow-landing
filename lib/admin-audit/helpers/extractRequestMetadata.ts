/**
 * Extract IP address and user agent from request headers
 */
export function extractRequestMetadata(request?: { headers: Headers }): {
  ipAddress: string;
  userAgent: string;
} {
  const ipAddress =
    request?.headers.get('x-forwarded-for') || request?.headers.get('x-real-ip') || 'unknown';
  const userAgent = request?.headers.get('user-agent') || 'unknown';
  return { ipAddress, userAgent };
}
