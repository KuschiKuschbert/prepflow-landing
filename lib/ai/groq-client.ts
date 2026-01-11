/**
 * Groq API Client
 *
 * Fastest free AI option for recipe processing (sub-second responses, 500+ tokens/sec)
 * Uses OpenAI-compatible API format via Groq Cloud
 *
 * STRICT COST GUARDS:
 * - Only used if USE_GROQ=true AND GROQ_API_KEY is set
 * - Fails immediately if API key missing (no silent fallback)
 * - Ollama fallback available for completely free operation
 *
 * Setup:
 * 1. Get free API key: https://console.groq.com/
 * 2. Set USE_GROQ=true in environment variables
 * 3. Set GROQ_API_KEY=your-api-key-here
 * 4. Set spending limits in Groq Console (Settings → Billing → Limits)
 *
 * See: docs/GROQ_SETUP_GUIDE.md
 */

// Re-export all functions from helpers to maintain API compatibility
export {
  isGroqEnabled,
  isGroqAvailable,
  generateTextWithGroq,
  getGroqApiKey,
} from './groq-client-helpers';
