import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const STORAGE_BUCKET = 'customer-photos';

/**
 * POST /api/customers/upload-photo
 * Upload customer photo to Supabase Storage and update customers table
 */
export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = createSupabaseAdmin();

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const customerId = formData.get('customerId') as string | null;

    if (!file) {
      return NextResponse.json(
        ApiErrorHandler.createError('No file provided', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    if (!customerId) {
      return NextResponse.json(
        ApiErrorHandler.createError('No customer ID provided', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`,
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${customerId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      logger.error('[Customers API] Storage upload error:', {
        error: uploadError.message,
        context: {
          endpoint: '/api/customers/upload-photo',
          operation: 'POST',
          bucket: STORAGE_BUCKET,
          filePath,
        },
      });

      // Check if bucket exists, if not, provide helpful error
      if (uploadError.message.includes('Bucket not found')) {
        return NextResponse.json(
          ApiErrorHandler.createError(
            `Storage bucket '${STORAGE_BUCKET}' not found. Please create it in Supabase Dashboard > Storage.`,
            'STORAGE_ERROR',
            500,
          ),
          { status: 500 },
        );
      }

      throw ApiErrorHandler.fromSupabaseError(uploadError, 500);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);

    // Update Customer Record
    const { error: dbError } = await supabaseAdmin
      .from('customers')
      .update({ avatar_url: publicUrl })
      .eq('id', customerId);

    if (dbError) {
      logger.error('[Customers API] Database update error:', {
        error: dbError.message,
        context: { customerId, publicUrl },
      });
      throw ApiErrorHandler.fromSupabaseError(dbError, 500);
    }

    return NextResponse.json({
      success: true,
      message: 'Photo uploaded and profile updated successfully',
      data: {
        url: publicUrl,
        path: filePath,
      },
    });
  } catch (err: unknown) {
    logger.error('[Customers API] Photo upload error:', err);
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to upload photo', 'UPLOAD_ERROR', 500),
      { status: 500 },
    );
  }
}
