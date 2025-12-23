/**
 * Hugging Face API constants and configuration.
 */

// Router API base URL - only supports OpenAI-compatible chat completions for specific text models
export const HUGGINGFACE_ROUTER_BASE = 'https://router.huggingface.co';
// Old inference API - deprecated (returns 410 Gone)
export const HUGGINGFACE_INFERENCE_BASE = 'https://api-inference.huggingface.co/models';
export const DEFAULT_IMAGE_MODEL = 'stabilityai/stable-diffusion-xl-base-1.0';
// Router API supports Llama models (Apache 2.0 license, commercial use allowed)
export const DEFAULT_TEXT_MODEL = 'meta-llama/Llama-3.2-3B-Instruct';
export const DEFAULT_VISION_MODEL = 'Salesforce/blip-image-captioning-base';

// Inference Providers for image generation (fal-ai or replicate)
export const DEFAULT_IMAGE_PROVIDER = 'fal-ai';
export const FALLBACK_IMAGE_PROVIDER = 'replicate';
