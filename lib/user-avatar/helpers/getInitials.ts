/**
 * Get initials from user object (preferred format using database fields)
 */
export function getInitialsFromUserObject(user: {
  first_name?: string | null;
  last_name?: string | null;
  name?: string | null;
  email?: string | null;
}): string {
  const { first_name, last_name, name, email } = user;

  // First choice: first_name + last_name (best initials)
  if (first_name && last_name) {
    return (first_name[0] + last_name[0]).toUpperCase();
  }

  // Second choice: first_name only
  if (first_name) {
    return first_name[0].toUpperCase();
  }

  // Third choice: full name string
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  }

  // Fourth choice: email prefix
  if (email) {
    const emailPrefix = email.split('@')[0];
    return emailPrefix[0].toUpperCase();
  }

  return 'U';
}


