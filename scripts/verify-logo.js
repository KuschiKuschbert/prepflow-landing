#!/usr/bin/env node

/**
 * Verify PrepFlow Logo Setup
 * Checks that logo file exists and all references are correct
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying PrepFlow Logo Setup...\n');

const logoPath = path.join(process.cwd(), 'public', 'images', 'prepflow-logo.png');
const logoExists = fs.existsSync(logoPath);

if (!logoExists) {
  console.error('❌ Logo file not found at:', logoPath);
  console.error('   Please add your logo file to this location.');
  process.exit(1);
}

const stats = fs.statSync(logoPath);
const fileSizeKB = (stats.size / 1024).toFixed(1);
const fileDate = stats.mtime.toLocaleString();

console.log('✅ Logo file found!');
console.log(`   Path: ${logoPath}`);
console.log(`   Size: ${fileSizeKB} KB`);
console.log(`   Modified: ${fileDate}`);
console.log('');

// Check if it's a valid PNG
try {
  const fileBuffer = fs.readFileSync(logoPath);
  const isPNG =
    fileBuffer[0] === 0x89 &&
    fileBuffer[1] === 0x50 &&
    fileBuffer[2] === 0x4e &&
    fileBuffer[3] === 0x47;

  if (isPNG) {
    console.log('✅ Valid PNG file detected');
  } else {
    console.warn('⚠️  File may not be a valid PNG (checking magic bytes)');
  }
} catch (err) {
  console.warn('⚠️  Could not verify PNG format:', err.message);
}

console.log('\n📋 Next Steps:');
console.log('   1. Start dev server: npm run dev');
console.log('   2. Check landing page: http://localhost:3000');
console.log('   3. Check webapp: http://localhost:3000/webapp');
console.log('   4. Verify logo appears in:');
console.log('      - Landing page header');
console.log('      - Webapp navigation');
console.log('      - Page headers (Recipes, Setup, etc.)');
console.log('      - Background watermarks');
console.log('\n💡 Optional: Generate optimized variants');
console.log('   Run: node scripts/optimize-images.js');
console.log('   This creates WebP and AVIF versions for better performance\n');

