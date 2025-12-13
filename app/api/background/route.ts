/**
 * Secure background image API endpoint
 *
 * Serves the background PNG from a hidden location
 * Access at: /api/background
 *
 * Optional: Add authentication if you want to restrict access
 */

import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Path to the background image in hidden location
    // Using _hidden subdirectory in images (less obvious but still deployed)
    const backgroundPath = path.join(
      process.cwd(),
      'public',
      'images',
      '_hidden',
      'background.png',
    );

    // Check if file exists
    if (!fs.existsSync(backgroundPath)) {
      return NextResponse.json({ error: 'Background not found' }, { status: 404 });
    }

    // Read the file
    const fileBuffer = fs.readFileSync(backgroundPath);
    const fileStats = fs.statSync(backgroundPath);

    // Return the image with proper headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': fileStats.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        // Optional: Add security headers
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    logger.error('Error serving background:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
