interface SeverityDetectionContext {
  message?: string;
  error?: Error | string;
  endpoint?: string;
  component?: string;
  operation?: string;
  [key: string]: unknown;
}

/**
 * Collect all text sources from context for keyword matching
 */
export function collectTextSources(context: SeverityDetectionContext): string {
  const textSources: string[] = [];

  if (context.message) {
    textSources.push(context.message.toLowerCase());
  }

  if (context.error) {
    const errorText =
      context.error instanceof Error ? context.error.message : String(context.error);
    textSources.push(errorText.toLowerCase());
  }

  if (context.endpoint) {
    textSources.push(context.endpoint.toLowerCase());
  }

  if (context.component) {
    textSources.push(context.component.toLowerCase());
  }

  if (context.operation) {
    textSources.push(context.operation.toLowerCase());
  }

  return textSources.join(' ');
}
