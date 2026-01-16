import { logger } from '@/lib/logger';

/**
 * Check hidden feature flags (for unlockable features)
 */
export async function checkHiddenFeature(
  featureKey: string,
  userEmail?: string,
): Promise<{ enabled: boolean; exists: boolean }> {
  try {
    let hiddenFeatureFlagsModule: {
      isHiddenFeatureEnabled?: (key: string, email?: string) => Promise<boolean>;
    } | null = null;
    try {
      hiddenFeatureFlagsModule = await import('@/lib/hidden-feature-flags');
    } catch {
      hiddenFeatureFlagsModule = null;
    }

    if (hiddenFeatureFlagsModule?.isHiddenFeatureEnabled) {
      const enabled = await hiddenFeatureFlagsModule.isHiddenFeatureEnabled(featureKey, userEmail);
      return { enabled, exists: true };
    }

    return { enabled: false, exists: false };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    if (errorMessage.includes('relation') || errorMessage.includes('does not exist')) {
      return { enabled: false, exists: false };
    }
    logger.warn('[Feature Gate] Error checking hidden feature flag:', {
      error: errorMessage,
    });
    return { enabled: false, exists: false };
  }
}
