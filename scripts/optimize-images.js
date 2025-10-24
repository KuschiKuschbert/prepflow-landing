const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

console.log('🖼️ Starting image optimization...');

const imagePaths = [
  'public/images/dashboard-screenshot.png',
  'public/images/prepflow-logo.png',
  'public/images/recipe-screenshot.png',
  'public/images/settings-screenshot.png',
  'public/images/stocklist-screenshot.png',
  'public/icons/icon-144x144.png',
];

async function optimizeImage(inputPath) {
  try {
    const inputBuffer = fs.readFileSync(inputPath);
    const inputSize = inputBuffer.length;

    // Get file info
    const info = await sharp(inputBuffer).metadata();
    const { width, height, format } = info;

    console.log(`\n📸 Optimizing ${inputPath}`);
    console.log(
      `   Original: ${width}x${height} ${format.toUpperCase()} (${(inputSize / 1024).toFixed(1)}KB)`,
    );

    // Create WebP version (better compression)
    const webpPath = inputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    const webpBuffer = await sharp(inputBuffer).webp({ quality: 85, effort: 6 }).toBuffer();

    fs.writeFileSync(webpPath, webpBuffer);
    const webpSize = webpBuffer.length;
    const webpSavings = (((inputSize - webpSize) / inputSize) * 100).toFixed(1);

    console.log(
      `   WebP: ${width}x${height} (${(webpSize / 1024).toFixed(1)}KB) - ${webpSavings}% smaller`,
    );

    // Create AVIF version (best compression)
    const avifPath = inputPath.replace(/\.(png|jpg|jpeg)$/i, '.avif');
    const avifBuffer = await sharp(inputBuffer).avif({ quality: 80, effort: 9 }).toBuffer();

    fs.writeFileSync(avifPath, avifBuffer);
    const avifSize = avifBuffer.length;
    const avifSavings = (((inputSize - avifSize) / inputSize) * 100).toFixed(1);

    console.log(
      `   AVIF: ${width}x${height} (${(avifSize / 1024).toFixed(1)}KB) - ${avifSavings}% smaller`,
    );

    return {
      original: inputSize,
      webp: webpSize,
      avif: avifSize,
      webpSavings: parseFloat(webpSavings),
      avifSavings: parseFloat(avifSavings),
    };
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
    return null;
  }
}

async function optimizeAllImages() {
  let totalOriginal = 0;
  let totalWebp = 0;
  let totalAvif = 0;
  let optimizedCount = 0;

  for (const imagePath of imagePaths) {
    if (fs.existsSync(imagePath)) {
      const result = await optimizeImage(imagePath);
      if (result) {
        totalOriginal += result.original;
        totalWebp += result.webp;
        totalAvif += result.avif;
        optimizedCount++;
      }
    } else {
      console.log(`⚠️ Image not found: ${imagePath}`);
    }
  }

  console.log('\n📊 Optimization Summary:');
  console.log(`   Images optimized: ${optimizedCount}/${imagePaths.length}`);
  console.log(`   Original total: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB`);
  console.log(
    `   WebP total: ${(totalWebp / 1024 / 1024).toFixed(2)}MB (${(((totalOriginal - totalWebp) / totalOriginal) * 100).toFixed(1)}% savings)`,
  );
  console.log(
    `   AVIF total: ${(totalAvif / 1024 / 1024).toFixed(2)}MB (${(((totalOriginal - totalAvif) / totalOriginal) * 100).toFixed(1)}% savings)`,
  );

  // Generate responsive image component
  console.log('\n💡 Next steps:');
  console.log('   1. Update image references to use WebP/AVIF with fallbacks');
  console.log('   2. Use Next.js Image component with priority loading');
  console.log('   3. Implement responsive image sizes');

  return {
    optimizedCount,
    totalOriginal,
    totalWebp,
    totalAvif,
    webpSavings: ((totalOriginal - totalWebp) / totalOriginal) * 100,
    avifSavings: ((totalOriginal - totalAvif) / totalOriginal) * 100,
  };
}

// Check if Sharp is available
try {
  require.resolve('sharp');
  optimizeAllImages().catch(console.error);
} catch (error) {
  console.log('❌ Sharp not installed. Installing...');
  console.log('Run: npm install sharp --save-dev');
  console.log('Then run this script again.');
}
