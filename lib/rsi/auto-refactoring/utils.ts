export function extractPath(text: string): string[] | undefined {
  // 1. Look for backticked paths: `app/api/`
  const backtickMatch = text.match(/`([^`]+)`/);
  if (backtickMatch) {
    const pathStr = backtickMatch[1];
    if (pathStr.includes('/') || pathStr.endsWith('.ts') || pathStr.endsWith('.tsx')) {
      if (pathStr.endsWith('/')) return [`${pathStr}**/*.{ts,tsx}`];
      return [pathStr];
    }
  }

  // 2. Look for common path patterns without backticks: app/webapp or app/api/ingredients
  const pathRegex =
    /(app\/[a-zA-Z0-9\/\-_]+|components\/[a-zA-Z0-9\/\-_]+|lib\/[a-zA-Z0-9\/\-_]+)/g;
  const matches = text.match(pathRegex);
  if (matches && matches.length > 0) {
    // Return directory paths directly. jscodeshift walks directories recursively by default.
    // This is safer than globbing which depends on shell expansion.
    return matches.map(m => (m.endsWith('/') ? m.slice(0, -1) : m));
  }

  return undefined;
}
