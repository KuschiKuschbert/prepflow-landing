import { logger } from '@/lib/logger';

export interface ReleaseData {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  download_url: string;
}

/**
 * Fetches the latest release from GitHub.
 * Designed to be used in Server Components and API routes.
 */
export async function getLatestRelease(): Promise<ReleaseData | null> {
  const GITHUB_REPO = 'KuschiKuschbert/CurbOS';

  try {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
    };

    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`, {
      headers,
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      logger.error('[GitHub Release] Failed to fetch release', { status: response.status });
      return null;
    }

    interface GitHubAsset {
      name: string;
      browser_download_url: string;
    }

    interface GitHubReleaseResponse {
      tag_name: string;
      name: string;
      published_at: string;
      html_url: string;
      assets: GitHubAsset[];
    }

    const data = (await response.json()) as GitHubReleaseResponse;

    // Find the APK asset
    const apkAsset =
      data.assets?.find((a: GitHubAsset) => a.name.endsWith('.apk')) || data.assets?.[0];

    return {
      tag_name: data.tag_name,
      name: data.name,
      published_at: data.published_at,
      html_url: data.html_url,
      download_url: apkAsset ? apkAsset.browser_download_url : data.html_url,
    };
  } catch (error) {
    logger.error('[GitHub Release] Fetch error:', error);
    return null;
  }
}
