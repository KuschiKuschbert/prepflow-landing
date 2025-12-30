import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

/**
 * Proxy to fetch the latest release from GitHub to avoid exposing tokens (if used)
 * and to provide a stable endpoint for the frontend.
 * @returns JSON object with release details.
 */
export async function GET() {
  try {
    // Replace with your actual repo details
    const GITHUB_REPO = 'KuschiKuschbert/CurbOS';
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
        if (response.status === 404) {
             const error = ApiErrorHandler.createError('No releases found', 'NOT_FOUND', 404);
             return NextResponse.json(error, { status: 404 });
        }
        logger.error('Failed to fetch release from GitHub', { status: response.status });
        const error = ApiErrorHandler.createError('Failed to fetch release', 'GITHUB_ERROR', response.status);
        return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();

    // Extract relevant data
    const releaseValue = {
      tag_name: data.tag_name, // e.g., "v0.2.7"
      name: data.name,
      published_at: data.published_at,
      html_url: data.html_url,
      // Find the APK asset if multiple assets exist
      assets: data.assets.map((asset: any) => ({
        name: asset.name,
        browser_download_url: asset.browser_download_url
      }))
    };

    return NextResponse.json(releaseValue);
  } catch (e) {
    logger.error('Release API Error:', e);
    const errorObj = e instanceof Error ? e : new Error(String(e));
    const apiError = ApiErrorHandler.fromException(errorObj);
    return NextResponse.json(apiError, { status: 500 });
  }
}
