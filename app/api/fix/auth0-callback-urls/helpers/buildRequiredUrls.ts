/**
 * Build required callback, logout, and web origin URLs for Auth0 configuration.
 */
export function buildRequiredUrls(baseUrl: string) {
  const requiredCallbacks = [
    `${baseUrl}/api/auth/callback`,
    ...(baseUrl.includes('www.')
      ? [`${baseUrl.replace('www.', '')}/api/auth/callback`]
      : [`${baseUrl.replace(/^https?:\/\//, 'https://www.')}/api/auth/callback`]),
    'http://localhost:3000/api/auth/callback',
    'http://localhost:3001/api/auth/callback',
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
    'http://localhost:3000',
    'http://localhost:3000/',
    'http://localhost:3001',
    'http://localhost:3001/',
  ];

  const requiredWebOrigins = [
    baseUrl,
    ...(baseUrl.includes('www.')
      ? [baseUrl.replace('www.', '')]
      : [baseUrl.replace(/^https?:\/\//, 'https://www.')]),
    'http://localhost:3000',
    'http://localhost:3001',
  ];

  return { requiredCallbacks, requiredLogoutUrls, requiredWebOrigins };
}
