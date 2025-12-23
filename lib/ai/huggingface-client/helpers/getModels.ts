import {
  DEFAULT_IMAGE_MODEL,
  DEFAULT_TEXT_MODEL,
  DEFAULT_VISION_MODEL,
} from '../constants';

/**
 * Get the image generation model to use
 */
export function getHuggingFaceImageModel(): string {
  return process.env.HUGGINGFACE_IMAGE_MODEL || DEFAULT_IMAGE_MODEL;
}

/**
 * Get the text generation model to use
 */
export function getHuggingFaceTextModel(): string {
  return process.env.HUGGINGFACE_TEXT_MODEL || DEFAULT_TEXT_MODEL;
}

/**
 * Get the vision/image analysis model to use
 */
export function getHuggingFaceVisionModel(): string {
  return process.env.HUGGINGFACE_VISION_MODEL || DEFAULT_VISION_MODEL;
}
