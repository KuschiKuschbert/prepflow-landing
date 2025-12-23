import { HfInference } from '@huggingface/inference';

// Singleton HfInference client instance
let hfInferenceClient: HfInference | null = null;

/**
 * Get Hugging Face API key (required for router API)
 */
function getHuggingFaceApiKey(): string | null {
  return process.env.HUGGINGFACE_API_KEY || null;
}

/**
 * Get or create HfInference client instance
 */
export function getHfInferenceClient(): HfInference | null {
  const apiKey = getHuggingFaceApiKey();
  if (!apiKey) {
    return null;
  }

  if (!hfInferenceClient) {
    hfInferenceClient = new HfInference(apiKey);
  }

  return hfInferenceClient;
}

/**
 * Check if AI is enabled (checks for Hugging Face API key)
 * API key is REQUIRED for all features (text generation via router API and image generation via Inference Providers)
 */
export function isAIEnabled(): boolean {
  // Hugging Face API key is required for all features
  return !!getHuggingFaceApiKey();
}

