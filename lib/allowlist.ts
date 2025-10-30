export function getAllowedEmails(): string[] {
  const raw = process.env.ALLOWED_EMAILS || '';
  return raw
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isEmailAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  const allowed = getAllowedEmails();
  return allowed.includes(email.toLowerCase());
}
