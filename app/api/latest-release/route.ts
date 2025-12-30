import { ApiErrorHandler } from '@/lib/api-error-handler';
import { getLatestRelease } from '@/lib/github-release';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

/**
 * Proxy to fetch the latest release from GitHub.
 * Now improved to use the shared helper.
 * @returns JSON object with release details.
 */
export async function GET() {
  try {
    const release = await getLatestRelease();

    if (!release) {
      const error = ApiErrorHandler.createError('Failed to fetch release', 'GITHUB_ERROR', 404);
      logger.error('[Latest Release API] No release found');
      return NextResponse.json(error, { status: 404 });
    }

    // Map to the format expected by consumers (though now identical to ReleaseData)
    // Maintaining for backward compatibility/clarity
    const responseData = {
      tag_name: release.tag_name,
      name: release.name,
      published_at: release.published_at,
      html_url: release.html_url,
      assets: [
        {
          name: 'curbos.apk', // generic name or from asset
          browser_download_url: release.download_url,
        },
      ],
    };

    return NextResponse.json(responseData);
  } catch (error) {
    logger.error('[Latest Release API] Unexpected error', error);
    const errorObj = error instanceof Error ? error : new Error(String(error));
    const apiError = ApiErrorHandler.fromException(errorObj);
    return NextResponse.json(apiError, { status: 500 });
  }
}
