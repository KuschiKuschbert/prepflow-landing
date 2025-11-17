# Employee Photo Storage Setup

This guide explains how to set up Supabase Storage for employee photos.

## Prerequisites

- Supabase project configured
- Admin access to Supabase Dashboard

## Setup Steps

### 1. Create Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Configure the bucket:
   - **Name**: `employee-photos`
   - **Public bucket**: ✅ Checked (allows public access to photos)
   - **File size limit**: 5MB (recommended)
   - **Allowed MIME types**: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`

### 2. Configure Storage Policies (Optional but Recommended)

For better security, you can add RLS policies:

```sql
-- Allow authenticated users to upload photos
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'employee-photos');

-- Allow public read access to photos
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'employee-photos');

-- Allow authenticated users to delete their own uploads
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'employee-photos');
```

### 3. Verify Setup

After creating the bucket, test the photo upload functionality:

1. Go to the Employees page (`/webapp/employees`)
2. Click "Add Employee" or edit an existing employee
3. Try uploading a photo (JPG, PNG, or WebP, max 5MB)
4. Verify the photo appears in the preview
5. Check Supabase Storage to confirm the file was uploaded

## Configuration

The storage bucket name is configured in:

- `app/api/employees/upload-photo/route.ts` - `STORAGE_BUCKET` constant

To change the bucket name, update this constant and create a new bucket in Supabase.

## File Validation

The system validates:

- **File types**: JPEG, JPG, PNG, WebP only
- **File size**: Maximum 5MB
- **File extension**: Must match allowed types

Validation happens both client-side (immediate feedback) and server-side (security).

## Troubleshooting

### "Bucket not found" Error

If you see this error, the storage bucket hasn't been created yet. Follow Step 1 above.

### Upload Fails

1. Check Supabase Storage bucket exists and is public
2. Verify file size is under 5MB
3. Check file type is allowed (JPG, PNG, WebP)
4. Check browser console for detailed error messages
5. Verify Supabase environment variables are set correctly

### Photos Not Displaying

1. Verify bucket is set to **Public**
2. Check photo URL in database (`photo_url` field)
3. Verify Supabase Storage policies allow public read access

## Storage Limits

- **Default file size limit**: 5MB per photo
- **Recommended bucket size limit**: Configure based on your needs
- **File naming**: `{employeeId}-{timestamp}.{ext}` format

## Cleanup

Old photos are automatically deleted when:

- Employee photo is removed
- Employee is deleted (if cascade delete is configured)

Manual cleanup can be done via Supabase Dashboard > Storage > employee-photos bucket.
