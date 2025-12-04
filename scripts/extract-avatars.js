const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * Extract avatars from a source image grid.
 * Assumes a grid layout and extracts individual avatars.
 *
 * Usage: node scripts/extract-avatars.js <source-image-path> [rows] [cols]
 * Example: node scripts/extract-avatars.js ./avatar-grid.png 3 4
 */

const AVATAR_COUNT = 11;
const OUTPUT_DIR = 'public/images/avatars';
const AVATAR_SIZE = 256; // Output size for each avatar (square)

async function extractAvatars(sourcePath, rows = 3, cols = 4) {
  try {
    // Validate source file exists
    if (!fs.existsSync(sourcePath)) {
      console.error(`❌ Source image not found: ${sourcePath}`);
      process.exit(1);
    }

    // Create output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      console.log(`📁 Created directory: ${OUTPUT_DIR}`);
    }

    // Load source image
    const image = sharp(sourcePath);
    const metadata = await image.metadata();
    const { width, height } = metadata;

    console.log(`\n🖼️  Source image: ${width}x${height}`);
    console.log(`📐 Grid layout: ${rows} rows × ${cols} cols`);
    console.log(`🎯 Extracting ${AVATAR_COUNT} avatars...\n`);

    // Calculate cell dimensions (ensure we don't exceed image bounds)
    const cellWidth = Math.floor(width / cols);
    const cellHeight = Math.floor(height / rows);

    console.log(`📏 Cell size: ${cellWidth}x${cellHeight}`);

    // Extract each avatar
    let avatarIndex = 0;
    for (let row = 0; row < rows && avatarIndex < AVATAR_COUNT; row++) {
      for (let col = 0; col < cols && avatarIndex < AVATAR_COUNT; col++) {
        avatarIndex++;

        const left = col * cellWidth;
        const top = row * cellHeight;

        // Ensure we don't exceed image bounds
        // For the last column/row, use remaining space
        const extractWidth = col === cols - 1 ? width - left : cellWidth;
        const extractHeight = row === rows - 1 ? height - top : cellHeight;

        const avatarId = `avatar-${String(avatarIndex).padStart(2, '0')}`;
        const outputPath = path.join(OUTPUT_DIR, `${avatarId}.webp`);

        // Validate extract area
        if (
          left < 0 ||
          top < 0 ||
          left + extractWidth > width ||
          top + extractHeight > height ||
          extractWidth <= 0 ||
          extractHeight <= 0
        ) {
          console.error(
            `❌ Invalid extract area for ${avatarId}: left=${left}, top=${top}, width=${extractWidth}, height=${extractHeight}`,
          );
          continue;
        }

        // Extract and resize avatar (create new Sharp instance for each extraction)
        await sharp(sourcePath)
          .extract({
            left,
            top,
            width: extractWidth,
            height: extractHeight,
          })
          .resize(AVATAR_SIZE, AVATAR_SIZE, {
            fit: 'cover',
            position: 'center',
          })
          .webp({ quality: 90, effort: 6 })
          .toFile(outputPath);

        console.log(`✅ Extracted ${avatarId} → ${outputPath}`);
      }
    }

    console.log(`\n✨ Successfully extracted ${avatarIndex} avatars to ${OUTPUT_DIR}/`);
  } catch (error) {
    console.error('❌ Error extracting avatars:', error.message);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node scripts/extract-avatars.js <source-image-path> [rows] [cols]');
  console.error('Example: node scripts/extract-avatars.js ./avatar-grid.png 3 4');
  process.exit(1);
}

const sourcePath = args[0];
const rows = args[1] ? parseInt(args[1], 10) : 3;
const cols = args[2] ? parseInt(args[2], 10) : 4;

extractAvatars(sourcePath, rows, cols);
