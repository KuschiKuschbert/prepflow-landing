import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const STORAGE_BUCKET = 'employee-photos';

/**
 * POST /api/employees/upload-photo
 * Upload employee photo to Supabase Storage
 */
export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = createSupabaseAdmin();

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const employeeId = formData.get('employeeId') as string | null;

    if (!file) {
      return NextResponse.json(
        ApiErrorHandler.createError('No file provided', 'VALIDATION_ERROR', 400),
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
    const fileName = `${employeeId || 'temp'}-${Date.now()}.${fileExt}`;
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
      logger.error('[Employees API] Storage upload error:', {
        error: uploadError.message,
        context: {
          endpoint: '/api/employees/upload-photo',
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

    return NextResponse.json({
      success: true,
      message: 'Photo uploaded successfully',
      data: {
        url: publicUrl,
        path: filePath,
      },
    });
  } catch (err: any) {
    logger.error('[Employees API] Photo upload error:', err);
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to upload photo', 'UPLOAD_ERROR', 500),
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/employees/upload-photo
 * Delete employee photo from Supabase Storage
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabaseAdmin = createSupabaseAdmin();
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json(
        ApiErrorHandler.createError('File path is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Extract filename from path (remove bucket prefix if present)
    const fileName = filePath.split('/').pop() || filePath;

    const { error: deleteError } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .remove([fileName]);

    if (deleteError) {
      logger.error('[Employees API] Storage delete error:', {
        error: deleteError.message,
        context: {
          endpoint: '/api/employees/upload-photo',
          operation: 'DELETE',
          bucket: STORAGE_BUCKET,
          fileName,
        },
      });
      throw ApiErrorHandler.fromSupabaseError(deleteError, 500);
    }

    return NextResponse.json({
      success: true,
      message: 'Photo deleted successfully',
    });
  } catch (err: any) {
    logger.error('[Employees API] Photo delete error:', err);
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to delete photo', 'DELETE_ERROR', 500),
      { status: 500 },
    );
  }
}

