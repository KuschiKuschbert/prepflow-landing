/**
 * Split full name into first_name and last_name
 */
export function splitName(fullName: string | null | undefined): {
  first_name: string | null;
  last_name: string | null;
} {
  if (!fullName) return { first_name: null, last_name: null };
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { first_name: parts[0], last_name: null };
  return { first_name: parts[0], last_name: parts.slice(1).join(' ') };
}

