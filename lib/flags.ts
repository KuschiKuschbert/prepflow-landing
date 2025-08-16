export type FlagValue = string | number | boolean;
export type FeatureFlags = Record<string, FlagValue>;

function parseEnvFlags(): FeatureFlags {
  const raw = process.env.NEXT_PUBLIC_FLAGS;
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as FeatureFlags;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function getClientFlags(): FeatureFlags {
  if (typeof window === 'undefined') return parseEnvFlags();
  const params = new URLSearchParams(window.location.search);
  const result: FeatureFlags = { ...parseEnvFlags() };
  params.forEach((value, key) => {
    if (key.startsWith('flag_')) {
      const name = key.substring('flag_'.length);
      if (value === '1' || value.toLowerCase() === 'true') result[name] = true;
      else if (value === '0' || value.toLowerCase() === 'false') result[name] = false;
      else if (!Number.isNaN(Number(value))) result[name] = Number(value);
      else result[name] = value;
    }
  });
  return result;
}

// Lightweight server-side evaluator for middleware/route usage
export function getServerFlagsFromUrl(url: URL): FeatureFlags {
  const base = parseEnvFlags();
  const params = url.searchParams;
  params.forEach((value, key) => {
    if (key.startsWith('flag_')) {
      const name = key.substring('flag_'.length);
      if (value === '1' || value.toLowerCase() === 'true') base[name] = true;
      else if (value === '0' || value.toLowerCase() === 'false') base[name] = false;
      else if (!Number.isNaN(Number(value))) base[name] = Number(value);
      else base[name] = value;
    }
  });
  return base;
}

export function serializeFlags(flags: FeatureFlags): Record<string, string> {
  const flattened: Record<string, string> = {};
  Object.entries(flags).forEach(([k, v]) => {
    flattened[k] = typeof v === 'string' ? v : String(v);
  });
  return flattened;
}

