const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * Process individual avatar images: resize, convert to WebP, and optimize.
 * Processes all image files in a directory and saves them as numbered avatars.
 *
 * Usage: node scripts/process-avatars.js <source-directory>
 * Example: node scripts/process-avatars.js public/images/avatars
 */

const OUTPUT_DIR = 'public/images/avatars';
const AVATAR_SIZE = 256; // Output size for each avatar (square)
const WEBP_QUALITY = 90;
const WEBP_EFFORT = 6;

// Supported image formats
const SUPPORTED_FORMATS = ['.png', '.jpg', '.jpeg', '.webp', '.avif'];

/**
 * Get all image files from a directory, sorted alphabetically.
 */
function getImageFiles(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.error(`❌ Directory not found: ${dirPath}`);
    process.exit(1);
  }

  const files = fs.readdirSync(dirPath);
  const imageFiles = files
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return SUPPORTED_FORMATS.includes(ext);
    })
    .map(file => ({
      filename: file,
      path: path.join(dirPath, file),
      basename: path.basename(file, path.extname(file)),
    }))
    .sort((a, b) => a.filename.localeCompare(b.filename));

  return imageFiles;
}

/**
 * Process a single avatar image.
 */
async function processAvatar(inputPath, outputPath, index) {
  try {
    const avatarId = `avatar-${String(index + 1).padStart(2, '0')}`;

    // Load and process image
    await sharp(inputPath)
      .resize(AVATAR_SIZE, AVATAR_SIZE, {
        fit: 'cover',
        position: 'center',
      })
      .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })
      .toFile(outputPath);

    console.log(`✅ Processed ${avatarId} → ${outputPath}`);
    return { avatarId, originalFilename: path.basename(inputPath), outputPath };
  } catch (error) {
    console.error(`❌ Error processing ${inputPath}:`, error.message);
    throw error;
  }
}

/**
 * Clean up old avatar files (avatar-*.webp).
 */
function cleanupOldAvatars() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    return;
  }

  const files = fs.readdirSync(OUTPUT_DIR);
  const oldAvatars = files.filter(file => /^avatar-\d+\.webp$/.test(file));

  if (oldAvatars.length > 0) {
    console.log(`\n🧹 Cleaning up ${oldAvatars.length} old avatar files...`);
    oldAvatars.forEach(file => {
      const filePath = path.join(OUTPUT_DIR, file);
      fs.unlinkSync(filePath);
      console.log(`   Deleted ${file}`);
    });
  }
}

/**
 * Main processing function.
 */
async function processAvatars(sourceDir) {
  try {
    console.log(`\n🖼️  Processing avatars from: ${sourceDir}\n`);

    // Get all image files
    const imageFiles = getImageFiles(sourceDir);

    if (imageFiles.length === 0) {
      console.error(`❌ No image files found in ${sourceDir}`);
      console.error(`   Supported formats: ${SUPPORTED_FORMATS.join(', ')}`);
      process.exit(1);
    }

    console.log(`📋 Found ${imageFiles.length} image file(s)\n`);

    // Clean up old avatars
    cleanupOldAvatars();

    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      console.log(`📁 Created directory: ${OUTPUT_DIR}\n`);
    }

    // Process each image
    const processedAvatars = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const imageFile = imageFiles[i];
      const outputPath = path.join(OUTPUT_DIR, `avatar-${String(i + 1).padStart(2, '0')}.webp`);

      const result = await processAvatar(imageFile.path, outputPath, i);
      processedAvatars.push(result);
    }

    console.log(`\n✨ Successfully processed ${processedAvatars.length} avatars to ${OUTPUT_DIR}/`);
    console.log(`\n📝 Avatar mapping:`);
    processedAvatars.forEach(({ avatarId, originalFilename }) => {
      console.log(`   ${avatarId}: ${originalFilename}`);
    });

    console.log(`\n💡 Next steps:`);
    console.log(`   1. Review the processed avatars`);
    console.log(`   2. Update lib/avatars.ts with new avatar names`);
    console.log(`   3. Test avatar selection in settings page`);
  } catch (error) {
    console.error('❌ Error processing avatars:', error.message);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node scripts/process-avatars.js <source-directory>');
  console.error('Example: node scripts/process-avatars.js public/images/avatars');
  process.exit(1);
}

const sourceDir = args[0];
processAvatars(sourceDir);

