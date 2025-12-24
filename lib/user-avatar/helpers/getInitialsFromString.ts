/**
 * Get initials from user name string (backward compatibility)
 */
export function getInitialsFromString(userName: string): string {
  if (!userName) return 'U';
  const parts = userName.trim().split(/\s+/);
  if (parts.length >= 2) {
    // First letter of first name + first letter of last name
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  // First letter of name or email
  return userName[0].toUpperCase();
}
