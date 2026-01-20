/**
 * Build required callback, logout, and web origin URLs for Auth0 configuration.
 */
export function buildRequiredUrls(baseUrl: string) {
  // Use baseUrl (which comes from Auth0) as primary, but fallback to APP_BASE_URL for local dev consistency
  // Ideally, baseUrl passed here should match APP_BASE_URL in most cases

  const localhostBase = 'http://localhost:3000';
  const localhostAlt = 'http://localhost:3001';

  const requiredCallbacks = [
    `${baseUrl}/api/auth/callback`,
    ...(baseUrl.includes('www.')
      ? [`${baseUrl.replace('www.', '')}/api/auth/callback`]
      : [`${baseUrl.replace(/^https?:\/\//, 'https://www.')}/api/auth/callback`]),
    `${localhostBase}/api/auth/callback`,
    `${localhostAlt}/api/auth/callback`,
    ...(process.env.VERCEL_URL && !process.env.VERCEL_URL.includes('prepflow.org')
      ? [
          `https://${process.env.VERCEL_URL}/api/auth/callback`,
          `http://${process.env.VERCEL_URL}/api/auth/callback`,
        ]
      : []),
  ];

  const requiredLogoutUrls = [
    baseUrl,
    `${baseUrl}/`,
    ...(baseUrl.includes('www.')
      ? [baseUrl.replace('www.', ''), `${baseUrl.replace('www.', '')}/`]
      : [
          baseUrl.replace(/^https?:\/\//, 'https://www.'),
          `${baseUrl.replace(/^https?:\/\//, 'https://www.')}/`,
        ]),
    localhostBase,
    `${localhostBase}/`,
    localhostAlt,
    `${localhostAlt}/`,
  ];

  const requiredWebOrigins = [
    baseUrl,
    ...(baseUrl.includes('www.')
      ? [baseUrl.replace('www.', '')]
      : [baseUrl.replace(/^https?:\/\//, 'https://www.')]),
    localhostBase,
    localhostAlt,
  ];

  return { requiredCallbacks, requiredLogoutUrls, requiredWebOrigins };
}
