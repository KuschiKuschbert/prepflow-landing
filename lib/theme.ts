export interface BackgroundTheme {
  gridSizePx: number;
  gridCyanOpacity: number; // 0..1
  gridBlueOpacity: number; // 0..1
  cornerCyanOpacity: number; // 0..1
  cornerMagentaOpacity: number; // 0..1
}

// Single place to tweak the global background look
export const backgroundTheme: BackgroundTheme = {
  gridSizePx: 48,
  gridCyanOpacity: 0.08,
  gridBlueOpacity: 0.06,
  cornerCyanOpacity: 0.18,
  cornerMagentaOpacity: 0.16,
};


