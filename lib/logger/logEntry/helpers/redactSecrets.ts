/**
 * Redact sensitive information from strings (secrets, keys, passwords, tokens).
 *
 * @param {string} str - String that may contain sensitive data
 * @returns {string} String with sensitive data redacted
 */
export function redactSecrets(str: string): string {
  // Patterns to redact: API keys, tokens, passwords, secrets
  const patterns = [
    // Stripe keys: sk_live_..., sk_test_..., pk_live_..., pk_test_...
    /\b(sk|pk)_(live|test)_[a-zA-Z0-9]{24,}/g,
    // Webhook secrets: whsec_...
    /\bwhsec_[a-zA-Z0-9]{32,}/g,
    // JWT tokens: eyJ...
    /\beyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g,
    // Database URLs with passwords: postgresql://user:password@host
    /postgresql:\/\/[^:]+:[^@]+@/g,
    // Generic API keys: ..._KEY=..., ..._SECRET=...
    /\b[A-Z_]+(?:KEY|SECRET|PASSWORD|TOKEN)=[^\s'"]+/gi,
    // Hex keys: 64-character hex strings (encryption keys)
    /\b[a-fA-F0-9]{64}\b/g,
  ];

  let redacted = str;
  patterns.forEach(pattern => {
    redacted = redacted.replace(pattern, '[REDACTED]');
  });

  return redacted;
}

