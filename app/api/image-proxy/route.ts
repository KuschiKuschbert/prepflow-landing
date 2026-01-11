/**
 * Image Proxy API Route
 * Proxies external images to bypass CORS restrictions
 *
 * Usage: /api/image-proxy?url=<encoded-image-url>
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

/**
 * Allowed image domains for security (whitelist approach)
 * Add more domains as needed
 */
const ALLOWED_DOMAINS = [
  'allrecipes.com',
  'www.allrecipes.com',
  'tasty.co',
  'www.tasty.co',
  'foodnetwork.com',
  'www.foodnetwork.com',
  'bonappetit.com',
  'www.bonappetit.com',
  'seriouseats.com',
  'www.seriouseats.com',
  'bbc.co.uk',
  'www.bbc.co.uk',
  'bbcgoodfood.com',
  'www.bbcgoodfood.com',
  // Add more recipe site domains as needed
];

/**
 * Check if a URL is from an allowed domain
 */
function isAllowedDomain(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();

    // Remove 'www.' prefix for comparison
    const hostnameWithoutWww = hostname.replace(/^www\./, '');

    return ALLOWED_DOMAINS.some(domain => {
      const domainWithoutWww = domain.replace(/^www\./, '');
      return hostname === domain || hostnameWithoutWww === domainWithoutWww;
    });
  } catch {
    return false;
  }
}

/**
 * GET handler for image proxy
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json(
        ApiErrorHandler.createError('Missing url parameter', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Decode the URL if it's encoded
    let decodedUrl: string;
    try {
      decodedUrl = decodeURIComponent(imageUrl);
    } catch {
      decodedUrl = imageUrl;
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(decodedUrl);
    } catch {
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid URL format', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Security: Only allow HTTP/HTTPS
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        ApiErrorHandler.createError('Only HTTP/HTTPS URLs are allowed', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Security: Check if domain is whitelisted
    if (!isAllowedDomain(decodedUrl)) {
      logger.warn('[ImageProxy] Blocked request from non-whitelisted domain', {
        url: decodedUrl,
        hostname: parsedUrl.hostname,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Domain not allowed', 'FORBIDDEN', 403),
        { status: 403 },
      );
    }

    // Fetch the image
    const imageResponse = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PrepFlow Recipe Scraper)',
        Accept: 'image/*',
      },
      // Timeout after 10 seconds
      signal: AbortSignal.timeout(10000),
    });

    if (!imageResponse.ok) {
      logger.error('[ImageProxy] Failed to fetch image', {
        url: decodedUrl,
        status: imageResponse.status,
        statusText: imageResponse.statusText,
      });
      return NextResponse.json(
        ApiErrorHandler.createError(
          `Failed to fetch image: ${imageResponse.statusText}`,
          'FETCH_ERROR',
          imageResponse.status,
        ),
        { status: imageResponse.status },
      );
    }

    // Get the image data
    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': imageBuffer.byteLength.toString(),
        // Cache for 1 hour (3600 seconds)
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        // CORS headers - allow all origins since this is our own proxy
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      },
    });
  } catch (error) {
    logger.error('[ImageProxy] Error proxying image', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Handle timeout errors
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        ApiErrorHandler.createError('Request timeout', 'TIMEOUT_ERROR', 504),
        { status: 504 },
      );
    }

    // Handle abort errors
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(ApiErrorHandler.createError('Request aborted', 'ABORT_ERROR', 499), {
        status: 499,
      });
    }

    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
