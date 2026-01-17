import { DiscoveredFlag } from '../../types';

interface AutoCreateResponse {
  success: boolean;
  created: number;
  skipped: number;
}

export async function createFlagsApi(flags: DiscoveredFlag[]): Promise<AutoCreateResponse> {
  const response = await fetch('/api/admin/features/auto-create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      flags: flags.map(f => ({
        flag_key: f.flagKey,
        type: f.type,
        description: `Discovered from ${f.file}:${f.line}`,
      })),
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to auto-create feature flags');
  }

  const data = await response.json();
  if (data.success === false) {
    throw new Error('Failed to auto-create feature flags');
  }

  return data;
}
