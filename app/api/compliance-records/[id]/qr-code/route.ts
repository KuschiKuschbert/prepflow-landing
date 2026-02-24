import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { handleComplianceError } from '../../helpers/handleComplianceError';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Compliance record ID is required', 'BAD_REQUEST', 400),
        { status: 400 },
      );
    }

    // Generate URL that will be encoded in QR code
    // This links to the compliance record details
    const host = request.headers.get('host') || 'prepflow.org';
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const baseUrl = `${protocol}://${host}`;
    const complianceUrl = `${baseUrl}/webapp/compliance?record=${id}`;

    // Generate QR code as PNG buffer
    const qrCodeBuffer = await QRCode.toBuffer(complianceUrl, {
      type: 'png',
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    // Convert Buffer to Uint8Array for NextResponse
    const uint8Array = new Uint8Array(qrCodeBuffer);

    // Return as PNG image
    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: unknown) {
    return handleComplianceError(error, 'GET');
  }
}
