/**
 * Helper function to load an image and get its dimensions
 */

interface Feature {
  title: string;
  description: string;
  screenshot: string;
  screenshotAlt: string;
}

export function loadImage(
  imageSrc: string,
  onLoad: (dimensions: { width: number; height: number } | null) => void,
  onError?: () => void,
): void {
  const img = new window.Image();
  img.src = imageSrc;
  img.onload = () => {
    if (img.naturalWidth && img.naturalHeight) {
      onLoad({ width: img.naturalWidth, height: img.naturalHeight });
    } else {
      onLoad(null);
    }
  };
  img.onerror = () => {
    onLoad(null);
    onError?.();
  };
}

