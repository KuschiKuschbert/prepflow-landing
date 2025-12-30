/**
 * User name utility functions for consistent name display throughout the app
 */

/**
 * Get email prefix (part before @) as fallback
 *
 * @param email - User email address
 * @returns Email prefix or null
 */
function getEmailPrefix(email: string | null | undefined): string | null {
  if (!email) return null;
  const parts = email.split('@');
  return parts[0] || null;
}

/**
 * Get full display name from user data
 * Fallback chain: Database first_name + last_name → Database first_name → Auth0 name → Email prefix
 *
 * @param user - User object with name fields
 * @returns Full display name or null
 */
export function getUserDisplayName(user: {
  first_name?: string | null;
  last_name?: string | null;
  name?: string | null;
  email?: string | null;
}): string | null {
  // First choice: Database first_name + last_name (full name)
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`.trim();
  }

  // Second choice: Database first_name only
  if (user.first_name) {
    return user.first_name;
  }

  // Third choice: Auth0 session name
  if (user.name) {
    return user.name;
  }

  // Fourth choice: Email prefix (before @)
  if (user.email) {
    return getEmailPrefix(user.email);
  }

  return null;
}

/**
 * Get first name from user data
 * Fallback chain: Database first_name → Auth0 name (first word) → Email prefix
 *
 * @param user - User object with name fields
 * @returns First name or null
 */
export function getUserFirstName(user: {
  first_name?: string | null;
  name?: string | null;
  email?: string | null;
}): string | null {
  // First choice: Database first_name
  if (user.first_name) {
    return user.first_name;
  }

  // Second choice: First word of Auth0 session name
  if (user.name) {
    const parts = user.name.trim().split(/\s+/);
    const firstName = parts[0] || null;
    return firstName;
  }

  // Third choice: Email prefix (before @)
  if (user.email) {
    const emailPrefix = getEmailPrefix(user.email);
    return emailPrefix;
  }

  return null;
}

/**
 * Get greeting text with user name
 * Returns personalized greeting or generic fallback
 *
 * @param user - User object with name fields
 * @param greetingPrefix - Prefix for greeting (default: "Hi")
 * @returns Greeting string
 */
export function getUserGreeting(
  user: {
    first_name?: string | null;
    last_name?: string | null;
    name?: string | null;
    email?: string | null;
  },
  greetingPrefix: string = 'Hi',
): string {
  const firstName = getUserFirstName(user);

  if (firstName) {
    return `${greetingPrefix}, ${firstName}!`;
  }

  return `${greetingPrefix} there!`;
}
