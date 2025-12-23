/**
 * Match endpoint patterns for severity hints
 */
export function matchEndpointPatterns(endpoint?: string): 'safety' | 'critical' | null {
  if (!endpoint) {
    return null;
  }

  const endpointLower = endpoint.toLowerCase();

  if (
    endpointLower.includes('/auth') ||
    endpointLower.includes('/login') ||
    endpointLower.includes('/signin')
  ) {
    return 'safety';
  }

  if (endpointLower.includes('/db/') || endpointLower.includes('/database')) {
    return 'critical';
  }

  return null;
}

