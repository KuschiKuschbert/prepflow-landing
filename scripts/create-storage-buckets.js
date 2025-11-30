#!/usr/bin/env node

/**
 * Create Supabase Storage Buckets
 * Creates the required storage buckets for recipe and dish images
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing required environment variables:');
  if (!supabaseUrl) console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  if (!serviceRoleKey) console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

/**
 * Creates a storage bucket if it doesn't exist
 * Uses Supabase Management API via REST call since JS client doesn't have createBucket
 * @param {string} bucketName - Name of the bucket
 * @param {boolean} publicBucket - Whether the bucket should be public
 * @param {object} options - Additional options (fileSizeLimit, allowedMimeTypes)
 */
async function createBucket(bucketName, publicBucket = true, options = {}) {
  try {
    // Check if bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      throw new Error(`Failed to list buckets: ${listError.message}`);
    }

    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);

    if (bucketExists) {
      console.log(`✅ Bucket '${bucketName}' already exists`);
      return { created: false, exists: true };
    }

    // Use REST API to create bucket (JS client doesn't have createBucket method)
    const response = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
      },
      body: JSON.stringify({
        name: bucketName,
        public: publicBucket,
        file_size_limit: options.fileSizeLimit || 10485760, // 10MB default
        allowed_mime_types: options.allowedMimeTypes || ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Failed to create bucket: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();

    console.log(`✅ Successfully created bucket '${bucketName}'`);
    console.log(`   - Public: ${publicBucket}`);
    console.log(`   - File size limit: ${(options.fileSizeLimit || 10485760) / 1024 / 1024}MB`);
    console.log(`   - Allowed MIME types: ${(options.allowedMimeTypes || ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']).join(', ')}`);

    return { created: true, exists: false, data };
  } catch (err) {
    console.error(`❌ Error creating bucket '${bucketName}':`, err.message);
    throw err;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Creating Supabase Storage Buckets...\n');

  try {
    // Create recipe-images bucket
    console.log('Creating recipe-images bucket...');
    await createBucket('recipe-images', true, {
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    });

    console.log('\n✅ All storage buckets created successfully!');
    console.log('\nYou can now use the image generation feature.');
  } catch (err) {
    console.error('\n❌ Failed to create storage buckets:', err.message);
    process.exit(1);
  }
}

// Run the script
main();

